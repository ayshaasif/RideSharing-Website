import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import '../index.css';
import axios from 'axios';
import { useGetLocateDriversMutation } from '../features/trip/tripSlice';

const Map = ()=>{
     const [startloc,setStartLoc] = useState('') 
     const [ endloc, setEndLoc] = useState('')


     const [startLocResults, setStartLocResults] = useState([]);
     const [endLocResults, setEndLocResults] = useState([]);


    const [startCoordinates, setStartCoordinates] = useState(null);
    const [endCoordinates, setEndCoordinates] = useState(null);

     const uaeCoordinates = { lng: 53.8478, lat: 23.4241 };
     const [userLocation, setUserLocation] = useState(uaeCoordinates);

     const mapContainer = useRef(null);
     const markerRef = useRef(null);  // Reference for the user location marker
     const startMarkerRef = useRef(null);  // Reference for the user location marker
     const endMarkerRef = useRef(null);  // Reference for the user location marker

     const [getLocateDrivers, {data,isLoading, error}] = useGetLocateDriversMutation();

     const map = useRef(null);
     const zoom = 15;
     const MAPTILER_API_KEY = process.env.REACT_APP_MAPTILER_API_KEY;
     maptilersdk.config.apiKey = MAPTILER_API_KEY;

// GET THE USER LOCATION 
     useEffect(() => {
        // Get user's current location
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
          },
          () => {
            console.warn("Location access denied or unavailable, using default location.");
          }
        );
      }, []);
      
      // set the map centered to users location and mark the users location on the map
     useEffect(() => {
        if (map.current) return; // stops map from intializing more than once
        map.current = new maptilersdk.Map({
          container: mapContainer.current,
          style: maptilersdk.MapStyle.STREETS,
          center:  [userLocation.lng, userLocation.lat],
          zoom: zoom
        }); 
      }, [userLocation]);

      const updateMarkerAndFlyTo = (coordinates, markerRef, color) => {
        if (!map.current || !coordinates) return;
    
        map.current.flyTo({
          center: [coordinates.lng, coordinates.lat],
          zoom: 10,
        });
    
        if (markerRef.current) {
          markerRef.current.remove();
        }
    
        markerRef.current = new maptilersdk.Marker({
          color : color,
          // draggable: true
        })
          .setLngLat([coordinates.lng, coordinates.lat])
          .addTo(map.current);
      };

      useEffect(() => {
        if (startCoordinates) {
          updateMarkerAndFlyTo(startCoordinates, startMarkerRef, "#FF0000");
        }
      }, [startCoordinates]);
    
      useEffect(() => {
        if (endCoordinates) {
          updateMarkerAndFlyTo(endCoordinates, endMarkerRef,"#00FF00");
        }
      }, [endCoordinates]);



      useEffect(()=>{
        if (map.current){
          map.current.setCenter([userLocation.lng, userLocation.lat])
        }

        if(markerRef.current){
          markerRef.current.remove();
        }

        markerRef.current = new maptilersdk.Marker()
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map.current);
      }, [userLocation]);


// INTRODUCE DEBOUNCING TO ELIMINATE REDUNDANT API CALLS

const useDebounce = (value , delay)=>{
  const [debouncedLoc , setDebouncedLoc] = useState(value);
  useEffect(()=>{
    const handler = setTimeout(()=>{
      setDebouncedLoc(value)
    },delay);

    return () => {
      clearTimeout(handler)
    }
  },[value, delay])

  return debouncedLoc;
};


const startLocDebounced = useDebounce(startloc, 1000)
const endLocDebounced = useDebounce(endloc, 1000)

useEffect(() => {
  if (startLocDebounced.length > 2) {
    axios.get('https://api.maptiler.com/geocoding/'+startLocDebounced+'.json?key='+MAPTILER_API_KEY)
      .then((response) => {
        console.log(response.data.features);
        setStartLocResults(response.data.features);
      })
      .catch((error) => console.error("Error fetching start location:", error));
  }
}, [startLocDebounced]);

useEffect(() => {
  if (endLocDebounced.length > 2) {
    axios.get('https://api.maptiler.com/geocoding/'+endLocDebounced+'.json?key='+MAPTILER_API_KEY)
      .then((response) => {
        console.log(response.data.features);
        setEndLocResults(response.data.features);
      })
      .catch((error) => console.error("Error fetching end location:", error));
  }
}, [endLocDebounced]);


const handleStartLocSelect = (e) => {
  const selectedFeature = startLocResults.find((res) => res.place_name_en === e.target.value);
  if (selectedFeature) {
    setStartCoordinates({
      lng: selectedFeature.geometry.coordinates[0],
      lat: selectedFeature.geometry.coordinates[1],
    });
  }
  setStartLoc(e.target.value);
};

const handleEndLocSelect = (e) => {
  const selectedFeature = endLocResults.find((res) => res.place_name_en === e.target.value);
  if (selectedFeature) {
    setEndCoordinates({
      lng: selectedFeature.geometry.coordinates[0],
      lat: selectedFeature.geometry.coordinates[1],
    });
  }
  setEndLoc(e.target.value);
};


const handleFindDrivers = async () => {
  try {
    let coordinates = {
      start_location : [startCoordinates['lng'],startCoordinates['lat']],
      end_location : [endCoordinates['lng'],endCoordinates['lat']]
    }
    console.log(coordinates)
    const result = await getLocateDrivers(coordinates).unwrap(); // Unwrap for the actual result
    console.log('Nearest Drivers:', result);
  } catch (err) {
    console.error('Failed to locate drivers:', err);
  }
};

const handleSubmit = (e)=>{
  e.preventDefault()
}

     return (
        <>
        <form onSubmit={handleSubmit}>
            <div>
            pickup location : <input onChange={(e)=>setStartLoc(e.target.value)} value={startloc}></input>
            <select value={startloc} onChange={handleStartLocSelect}>
                <option key="0" value="">Select start location</option>
                {startLocResults.map((option) => (
                <option key={option.id} value={option.place_name_en}>
                {option.place_name_en}      {option.geometry.coordinates}    
                </option>))}
            </select>
            </div>
         
            <div>
            dropoff location : <input onChange={(e)=>setEndLoc(e.target.value)} value={endloc}></input>
            <select value={endloc} onChange={handleEndLocSelect}>
                <option key="0" value="">Select end location</option>
                {endLocResults.map((option) => (
                <option key={option.id} value={option.place_name_en}>
                {option.place_name_en}      {option.geometry.coordinates}         
                </option>))}
            </select>
            </div>

            <button onClick={handleFindDrivers} disabled={isLoading}>
                {isLoading ? "Finding drivers..." : "Find Drivers"}
            </button>
      </form>
        
        <div className="map-wrap">
                <div ref={mapContainer} className="map" />
        </div>
        
        <div>
            <h3>Geocoding results: </h3>
            <ul>
            {/* Display results */}
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
            {error && <p>Error: {error.message}</p>}  
            </ul>
        </div>
        </>
     )
}

export default Map;
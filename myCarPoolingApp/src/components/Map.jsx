import React from 'react';
import { useState, useEffect, useRef } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import '../index.css';
import axios from 'axios';

const Map = ()=>{
     const [startloc,setStartLoc] = useState('') 
     const [ endloc, setEndLoc] = useState('')
     const [startLocResults, setstartLocResults] =  useState([]);
     const [endLocResults, setendLocResults] =  useState([]);

     const mapContainer = useRef(null);
     const map = useRef(null);
     const uaeCoordinates = { lng: 53.8478, lat: 23.4241 };
     const zoom = 9;
     let MAPTILER_API_KEY = 'CHu7tXAwNPfvbEFYVX60'
     maptilersdk.config.apiKey = MAPTILER_API_KEY;
     useEffect(() => {
        if (map.current) return; // stops map from intializing more than once
      
        map.current = new maptilersdk.Map({
          container: mapContainer.current,
          style: maptilersdk.MapStyle.STREETS,
          center: [uaeCoordinates.lng, uaeCoordinates.lat],
          zoom: zoom
        });      
      }, [uaeCoordinates.lng, uaeCoordinates.lat, zoom]);

    useEffect (()=>{
        if (startloc.length > 2){
        axios.get('https://api.maptiler.com/geocoding/'+startloc+'.json?key='+MAPTILER_API_KEY)
        .then(resp => {
            console.log("geo encoding start location: ",resp.data.features[0].geometry.coordinates)
            setstartLocResults(resp.data.features);
        })
        .catch(error => {
            console.error("Error fetching geocoding data: ", error);
        });
    }else {
        setendLocResults([]);
    }
    },[startloc])

    useEffect (()=>{
        if (endloc.length > 2){
        axios.get('https://api.maptiler.com/geocoding/'+endloc+'.json?key='+MAPTILER_API_KEY)
        .then(resp => {
            // console.log("geo encoding end location: ",resp.data.features);
            console.log("geo encoding end GEOM: ",resp.data.features[0].geometry.coordinates);
            setendLocResults(resp.data.features);
        })
        .catch(error => {
            console.error("Error fetching geocoding data: ", error);
        });}
        else {
            setendLocResults([]);
        }
    },[endloc])



      const handleSubmit = (e)=>{
        e.preventDefault();
      }

     return (
        <>
        <form onSubmit={handleSubmit}>
            <div>
            pickup location : <input onChange={(e)=>setStartLoc(e.target.value)} value={startloc}></input>
            <select value={startloc} onChange={(e) => setStartLoc(e.target.value)}>
                <option key="0" value="">Select start location</option>
                {startLocResults.map((option) => (
                <option key={option.idx} value={option.place_name_en}>
                {option.place_name_en}      {option.geometry.coordinates}    
                </option>))}
            </select>
            </div>
         
            <div>
            dropoff location : <input onChange={(e)=>setEndLoc(e.target.value)} value={endloc}></input>
            <select value={endloc} onChange={(e) => setEndLoc(e.target.value)}>
                <option key="0" value="">Select end location</option>
                {endLocResults.map((option) => (
                <option key={option.idx} value={option.place_name_en}>
                {option.place_name_en}      {option.geometry.coordinates}         
                </option>))}
            </select>
            </div>

            <button type='submit' >Go Search!</button>
        </form>
        
        <div className="map-wrap">
                <div ref={mapContainer} className="map" />
        </div>
        
        <div>
            <h3>Geocoding results: </h3>
            <ul>
                {startLocResults.map((res, idx)=>(
                    <li key={idx}>{res.place_name_en}</li>
                )
                )}
            </ul>
        </div>
        </>
     )
}

export default Map;
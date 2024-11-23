import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TripList = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    // Fetch the list of Trips
    axios.get('/api/trips')
      .then(response => setTrips(response.data))
      .catch(error => console.error('Error fetching Trips:', error));
  }, []);

  return (
    <div className="trip-list">
      <h2>Available trips</h2>
      <ul>
        {trips.map(trip => (
          <li key={trip.id}>{trip.origin} to {trip.destination}</li>
        ))}
      </ul>
    </div>
  );
};

export default TripList;

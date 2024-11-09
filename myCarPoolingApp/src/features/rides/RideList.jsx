import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RideList = () => {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    // Fetch the list of rides
    axios.get('/api/rides')
      .then(response => setRides(response.data))
      .catch(error => console.error('Error fetching rides:', error));
  }, []);

  return (
    <div className="ride-list">
      <h2>Available Rides</h2>
      <ul>
        {rides.map(ride => (
          <li key={ride.id}>{ride.origin} to {ride.destination}</li>
        ))}
      </ul>
    </div>
  );
};

export default RideList;

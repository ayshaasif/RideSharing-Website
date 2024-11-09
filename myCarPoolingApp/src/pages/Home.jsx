import React from 'react';
import Map from '../components/Map'
import '../index.css';

const Home = () => {
  return (
    <div className="home">
      <h1>Yalla!</h1>
      <h2>Where do you want to Go?</h2>
      {/* home  options go here */}
      <Map></Map>
    </div>
  );
};

export default Home;

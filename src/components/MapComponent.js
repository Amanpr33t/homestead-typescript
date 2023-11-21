import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent = ({ apiKey }) => {
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    // Get the user's current location using Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []); // Run once on component mount

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={{ height: '100%', width: '100%' }}
          zoom={currentLocation ? 15 : 8}
          center={currentLocation || { lat: 40.748817, lng: -73.985428 }}
        >
          {/* Show a marker at the current location */}
          {currentLocation && <Marker position={currentLocation} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapComponent;

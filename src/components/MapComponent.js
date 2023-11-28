import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, DrawingManager, Marker } from '@react-google-maps/api';

const libraries = ['drawing']; // Define libraries outside the component

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [polygon, setPolygon] = useState(null)
  console.log(selectedLocation, map,polygon)

  const handleMapClick = useCallback((event) => {
    setSelectedLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  }, []);

  const handleDrawingComplete = useCallback((polygon) => {
    setPolygon(polygon.getPath().getArray().map((point) => ({ lat: point.lat(), lng: point.lng() })));
  }, []);

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
      libraries={libraries} // Use the libraries constant here
    >
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '400px' }}
        center={selectedLocation || { lat: 0, lng: 0 }}
        zoom={15}
        onClick={handleMapClick}
        onLoad={(map) => setMap(map)}
      >
        {selectedLocation && <Marker position={selectedLocation} />}
        <DrawingManager
          drawingMode="polygon"
          onPolygonComplete={handleDrawingComplete}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent

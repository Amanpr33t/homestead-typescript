import React, { useState } from 'react';
import {
  GoogleMap,
  LoadScript,
  DrawingManager,
  Marker,
} from '@react-google-maps/api';

const MapComponent = () => {
  const [selectedArea, setSelectedArea] = useState(null);

  const mapStyles = {
    height: '50vh',
    width: '100%',
  };

  const defaultCenter = {
    lat: 40.748817,
    lng: -73.985428,
  };

  const handleOverlayComplete = (e) => {
    const polygonBounds = e.overlay.getPath().getArray();
    // You can use polygonBounds to get the selected area coordinates
    setSelectedArea(polygonBounds);
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyB-VNPvCcODoQdyoh0VwaBr-sRNdpraenw" libraries={['drawing']}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={defaultCenter}
      >
        {selectedArea && (
          <Marker position={selectedArea[0].toJSON()} />
        )}

        <DrawingManager
          drawingMode="polygon"
          onPolygonComplete={handleOverlayComplete}
        />

      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
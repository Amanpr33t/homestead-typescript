import React, { useState, useEffect } from 'react';
import {
    GoogleMap,
    LoadScript,
    DrawingManager,
    Marker,
} from '@react-google-maps/api';

const MapComponent = () => {
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        // Get current location using the browser's geolocation API
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
    }, []);

    console.log(currentLocation)

    const mapStyles = {
        height: '50vh',
        width: '100%',
    };

    const defaultCenter = currentLocation || {
        lat: 30.7333,
        lng: 76.7794,
    };

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY} libraries={['drawing']}  >
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={8}
                center={defaultCenter}
            >
                {currentLocation && (
                    <Marker position={currentLocation} />
                )}

                <DrawingManager
                    drawingMode="polygon"
                    onPolygonComplete={(e) => {
                        // Handle the completed polygon as needed
                        console.log('Polygon coordinates:', e.overlay.getPath().getArray());
                    }}
                />
            </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;
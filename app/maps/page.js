'use client';
import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Box, Typography } from '@mui/material';
import Nav from '../components/NavBar';
import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min';
import ReactMarkdown from 'react-markdown';

const containerStyle = {
  width: '100%',
  height: '440px'
};

export default function Maps() {
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  const handleMapLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  const searchClinics = (location) => {
    if (!map || !location) return;

    const request = {
      location: location,
      radius: '5000', // Search within 5km
      keyword: 'hospital clinic', // Using keyword to include both
    };

    const service = new window.google.maps.places.PlacesService(map);
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        console.log('Clinics and Hospitals:', results);
        setClinics(results);
        map.setCenter(location);
      } else {
        console.error('NearbySearch failed:', status);
      }
    });
  };

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
          FOG({
              el: vantaRef.current, // Attach Vanta effect to the container
              THREE, // Pass the THREE.js instance
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.00,
              minWidth: 200.00,
              highlightColor: 0x29ff,
              midtoneColor: 0x2382da,
              lowlightColor: 0xa1ff,
              baseColor: 0xa2ccd7,
              blurFactor: 0.72,
              speed: 1.40,
              zoom: 0.50,
          })
      );
    }

    return () => {
        if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setLocation(currentLocation);
        searchClinics(currentLocation); // Automatically search for clinics and hospitals
      },
      (error) => {
        console.error('Error getting location:', error);
        // Set a default location if location access is denied or fails
        const defaultLocation = { lat: 37.7749, lng: -122.4194 }; // San Francisco
        setLocation(defaultLocation);
        searchClinics(defaultLocation);
      }
    );
  }, [map]);

  return (
    <Box ref={vantaRef} sx={{ height: '120vh', color: 'white' }}>
      <Box>
        <Nav />
      </Box>

      <Typography variant="h4" sx={{ margin: '20px 0', marginLeft: '15px', color: "#E0E0E0", textAlign: "center"}}>
        Find Your Nearest Clinics and Hospitals
      </Typography>

      <Box sx={{ padding: '20px'}}>
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} libraries={['places']}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={location}
            zoom={15}
            onLoad={handleMapLoad}
          >
            {clinics.map((clinic, index) => (
              <Marker
                key={index}
                position={{
                  lat: clinic.geometry.location.lat(),
                  lng: clinic.geometry.location.lng(),
                }}
                title={clinic.name}
                onClick={() => setSelectedClinic(clinic)} // Set the selected clinic on marker click
              />
            ))}

            {selectedClinic && (
              <InfoWindow
                position={{
                  lat: selectedClinic.geometry.location.lat(),
                  lng: selectedClinic.geometry.location.lng(),
                }}
                onCloseClick={() => setSelectedClinic(null)} // Close the InfoWindow
              >
                <div style={{ padding: '5px', maxWidth: '200px', maxHeight: '100%' }}>
      <Typography variant="h6" color={'darkBlue'} gutterBottom>
        {selectedClinic.name}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {selectedClinic.vicinity}
      </Typography>
      {selectedClinic.rating && (
        <Typography variant="body2" color="textSecondary">
          Rating: {selectedClinic.rating} / 5
        </Typography>
      )}
      <Typography variant="body2" color="primary">
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedClinic.name)}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ textDecoration: 'none', color: '#1c68d4' }}
        >
          View on Google Maps
        </a>
      </Typography>

    </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </Box>
    </Box>
  );
}

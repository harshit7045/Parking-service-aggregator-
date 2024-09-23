import React, { useRef, useEffect, useState } from 'react';
import { SearchBox } from '@mapbox/search-js-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Cookies from 'js-cookie';

const MapWithSearch = ({ initialLocation }) => {
  const [mapToken, setMapToken] = useState(Cookies.get('mapToken') || '');
  const [inputValue, setInputValue] = useState('');
  const mapContainerRef = useRef();
  const mapInstanceRef = useRef();
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const initializeMap = async () => {
      // Set token if not available
      if (!mapToken) {
        const publicToken = "pk.eyJ1IjoiaGFyc2hpdDcwNDUiLCJhIjoiY2x6enFvOThqMWZ2NTJqczJoNXdkMjBudSJ9.Kc4hYzeCzu0OUY5uXM7TQA";
        Cookies.set('mapToken', publicToken, { expires: 7 });
        setMapToken(publicToken);
      }

      // Ensure mapToken is available before initializing the map
      if (mapToken) {
        mapboxgl.accessToken = mapToken;

        mapInstanceRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          center: initialLocation || [-74.5, 40],
          zoom: 9,
        });

        mapInstanceRef.current.on('load', () => {
          setMapLoaded(true);
        });
      }
    };

    initializeMap();

    // Cleanup function to remove the map on component unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [mapToken, initialLocation]);

  return (
    <>
      <div style={{ position: 'relative', height: '100%', width: '100%', margin: '0' }}>
        {mapLoaded && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
            <SearchBox
              accessToken={mapToken}
              map={mapInstanceRef.current}
              mapboxgl={mapboxgl}
              value={inputValue}
              onChange={(d) => setInputValue(d)}
              marker
            />
          </div>
        )}
        <div
          id="map-container"
          ref={mapContainerRef}
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </>
  );
};

export default MapWithSearch;

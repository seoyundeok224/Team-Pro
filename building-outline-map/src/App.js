import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Popup from './components/Popup/Popup';
import ScaleControl from './components/ScaleControl/ScaleControl';

const TILE_URLS = {
  base: `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Base/{z}/{y}/{x}.png`,
  satellite: `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Satellite/{z}/{y}/{x}.jpeg`,
  english: `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Base/English/{z}/{y}/{x}.png`,
};

const ATTRIBUTION = '© VWorld';

const KOREA_BOUNDS = [
  [33.0, 124.0],
  [39.5, 132.0],
];

function App() {
  const [showEmoji, setShowEmoji] = useState(true);
  const [mapStyle, setMapStyle] = useState('base');
  const [language, setLanguage] = useState('ko');
  const [geoData, setGeoData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [markerPosition, setMarkerPosition] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);


  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#222' : '#fff';
    document.body.style.color = darkMode ? '#fff' : '#000';
  }, [darkMode]);

  const tileUrl = TILE_URLS[mapStyle] || TILE_URLS.base;

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      <Popup />
      <Navbar darkMode={darkMode} />
      <div className="main-layout">
        <Sidebar
          showEmoji={showEmoji}
          setShowEmoji={setShowEmoji}
          mapStyle={mapStyle}
          setMapStyle={setMapStyle}
          language={language}
          setLanguage={setLanguage}
          setGeoData={setGeoData}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          user={user}
          setUser={setUser}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <div className="map-container">
          <MapContainer
            center={[36.5, 127.5]}
            zoom={7}
            minZoom={6}
            maxZoom={17}
            maxBounds={KOREA_BOUNDS}
            maxBoundsViscosity={1.0}
            scrollWheelZoom
            dragging
            zoomControl
            worldCopyJump={false}
            style={{ width: '100%', height: '100%' }}
            whenCreated={(instance) => {
              console.log("📍 Map instance created!", instance);
              setMapInstance(instance);
            }}
          >
            <TileLayer url={tileUrl} attribution={ATTRIBUTION} noWrap />
            {markerPosition && <Marker position={markerPosition} />}
            <ScaleControl />
          </MapContainer>
        </div>
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
}

export default App;

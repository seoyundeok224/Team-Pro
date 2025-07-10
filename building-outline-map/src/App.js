import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Popup from './components/Popup/Popup';
import ScaleControl from './components/ScaleControl/ScaleControl';
import WeatherBar from './components/Weather/WeatherBar';

const VWORLD_KEY = '2C432B0A-177E-319F-B4CD-ABBCEC8A9C9D';
const GEOCODER_KEY = 'E414852A-B728-3B7B-A2A1-0FA55C4DD7A3';
window.GEOCODER_KEY = GEOCODER_KEY;

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
    fetch('/vworld/test')
      .then((res) => res.text())
      .then((data) => console.log('✅ 프록시 동작 테스트 응답:', data))
      .catch((err) => console.error('❌ 프록시 동작 실패:', err));
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#222' : '#fff';
    document.body.style.color = darkMode ? '#fff' : '#000';
  }, [darkMode]);

  useEffect(() => {
    if (!searchQuery || !mapInstance) return;

    const fetchCoords = async () => {
      try {
        const res = await fetch(
          `/vworld/req/address?service=address&request=getcoord&version=2.0&crs=EPSG:4326&type=parcel&address=${encodeURIComponent(
            searchQuery
          )}&refine=true&format=json&key=${GEOCODER_KEY}`
        );

        const contentType = res.headers.get('Content-Type');
        if (!res.ok || !contentType?.includes('application/json')) {
          throw new Error(`Unexpected response: ${res.status} | ${contentType}`);
        }

        const data = await res.json();
        const item = data?.response?.result?.items?.[0];
        if (item) {
          const lat = parseFloat(item.point.y);
          const lng = parseFloat(item.point.x);
          setMarkerPosition([lat, lng]);
          mapInstance?.setView([lat, lng], 13);
        } else {
          alert('검색 결과가 없습니다.');
        }
      } catch (error) {
        console.error('검색 오류:', error);
        alert('검색 중 문제가 발생했습니다.');
      }
    };

    fetchCoords();
  }, [searchQuery, mapInstance]);

  useEffect(() => {
    setMapStyle(language === 'en' ? 'english' : 'base');
  }, [language]);

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

          <WeatherBar darkMode={darkMode}/> {/* ✅ 오른쪽 상단 날씨 상자 추가 */}
        </div>
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
}

export default App;
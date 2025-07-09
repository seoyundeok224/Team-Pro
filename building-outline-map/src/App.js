import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Popup from './components/Popup/Popup';
import ScaleControl from './components/ScaleControl/ScaleControl';


const VWORLD_KEY = '2C432B0A-177E-319F-B4CD-ABBCEC8A9C9D';
const SEARCH_KEY = '3078DF6E-3C1B-3B6A-8C30-169F6A11A51A';
const GEOCODER_KEY = 'E414852A-B728-3B7B-A2A1-0FA55C4DD7A3';
// 지오코드 API 전역사용 허용.
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


  // 프록시 서버로 연결이 되는지 확인용.
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


     // 기존 주소: 지번으로 받기 -> 수정함: 도로명 주소로 받기 -> 수정함: 도로명&지번 모두 검색허용.
        // &refine=true: 주소가 명확해야함 -> 수정: &refine=false: 주소가 명확하지 않아도 검색 가능.
  useEffect(() => {
  if (!searchQuery || !mapInstance) return;

  const fetchCoords = async () => {
    try {
      // 1️⃣ Geocoder 시도
      const geoRes = await fetch(`/vworld/req/address?service=address&request=getcoord&version=2.0&crs=EPSG:4326&type=both&address=${encodeURIComponent(searchQuery)}&refine=false&format=json&key=${GEOCODER_KEY}`);
      const geoData = await geoRes.json();
      const geoItem = geoData?.response?.result?.items?.[0];

      if (geoItem) {
        const lat = parseFloat(geoItem.point.y);
        const lng = parseFloat(geoItem.point.x);
        setMarkerPosition([lat, lng]);
        mapInstance.setView([lat, lng], 13);
        return;
      }

      // 2️⃣ Geocoder 실패 → Search API fallback
      const searchRes = await fetch(`/vworld/req/search?service=search&request=search&version=2.0&crs=EPSG:4326&type=place&query=${encodeURIComponent(searchQuery)}&format=json&size=1&key=${SEARCH_KEY}`);
      const searchData = await searchRes.json();
      const searchItem = searchData?.response?.result?.items?.[0];

      if (searchItem) {
        const lat = parseFloat(searchItem.point.y);
        const lng = parseFloat(searchItem.point.x);
        setMarkerPosition([lat, lng]);
        mapInstance.setView([lat, lng], 13);
        return;
      }

      alert('검색 결과가 없습니다.');

    } catch (error) {
      console.error('검색 오류:', error);
      alert('검색 중 오류가 발생했습니다.');
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
            whenCreated={setMapInstance}
            style={{ width: '100%', height: '100%' }}
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

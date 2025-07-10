import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Popup from './components/Popup/Popup';
import ScaleControl from './components/ScaleControl/ScaleControl';

// 🔑 브이월드 타일키
const VWORLD_KEY = '2C432B0A-177E-319F-B4CD-ABBCEC8A9C9D';

// ✅ 오픈웨더맵 API 키
const OPENWEATHER_API_KEY = '84a4cfe7ca79fc9b0120217a7d5a2028';

// 🌍 타일 서버 주소
const TILE_URLS = {
  base: `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Base/{z}/{y}/{x}.png`,
  satellite: `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Satellite/{z}/{y}/{x}.jpeg`,
  english: `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Base/English/{z}/{y}/{x}.png`,
};

// 📍 대한민국 지도 바운드
const KOREA_BOUNDS = [
  [33.0, 124.0],
  [39.5, 132.0],
];

// 📍 서울특별시청 좌표 (기본값)
const DEFAULT_LAT = 37.5665;
const DEFAULT_LNG = 126.9780;

// ✅ 초록 화살표 아이콘 넣음
const arrowDownIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;utf8,<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(180 20 20)"><polygon points="20,5 35,35 20,25 5,35" fill="limegreen" stroke="black" stroke-width="2"/></g></svg>',
  iconSize: [40, 40],
  iconAnchor: [20, 40], // 아래가 기준점
  popupAnchor: [0, -40],
});

function App() {
  const [showEmoji, setShowEmoji] = useState(true);
  const [mapStyle, setMapStyle] = useState('base');
  const [language, setLanguage] = useState('ko');
  const [geoData, setGeoData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [markerPosition, setMarkerPosition] = useState([DEFAULT_LAT, DEFAULT_LNG]);
  const [mapInstance, setMapInstance] = useState(null);
  const [weatherInfo, setWeatherInfo] = useState(null);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#222' : '#fff';
    document.body.style.color = darkMode ? '#fff' : '#000';
  }, [darkMode]);

  // ✅ 날씨 정보 불러오는 함수
  const fetchWeather = async (lat, lon) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=kr`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`OpenWeatherMap API Error: ${res.status}`);
      }

      const data = await res.json();
      setWeatherInfo({
        description: data.weather?.[0]?.description,
        temp: data.main?.temp,
      });
    } catch (error) {
      setWeatherInfo(null);
    }
  };

  // ✅ 앱 처음 켜질 때 → 서울시청 날씨 정보 불러오기
  useEffect(() => {
    fetchWeather(DEFAULT_LAT, DEFAULT_LNG);
  }, []);

  // ✅ 네이버 지오코드 검색 → 내 프록시 서버 호출
  useEffect(() => {
    if (!searchQuery || !mapInstance) return;

    const fetchCoords = async () => {
      try {
        const res = await fetch(`/naver/geocode?query=${encodeURIComponent(searchQuery)}`);
        const contentType = res.headers.get('Content-Type');
        if (!res.ok || !contentType?.includes('application/json')) {
          throw new Error(`Unexpected response: ${res.status} | Content-Type: ${contentType}`);
        }

        const data = await res.json();
        const item = data?.addresses?.[0];
        if (item) {
          const lat = parseFloat(item.y);
          const lng = parseFloat(item.x);
          setMarkerPosition([lat, lng]);
          mapInstance?.setView([lat, lng], 13);

          // ✅ 새 위치의 날씨 정보도 가져오기
          fetchWeather(lat, lng);
        } else {
          alert('검색 결과가 없습니다.');
        }
      } catch (error) {
        alert('검색 중 문제가 발생했습니다.');
      }
    };

    fetchCoords();
  }, [searchQuery, mapInstance]);

  // ✅ 언어 변경 시 지도 스타일 바꾸기
  useEffect(() => {
    setMapStyle(language === 'en' ? 'english' : 'base');
  }, [language]);

  // ✅ 선택한 타일 URL
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

        {/* ✅ 이 div가 날씨 정보까지 감쌈 */}
        <div className="map-container">
          <MapContainer
            center={[DEFAULT_LAT, DEFAULT_LNG]}
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
            whenCreated={(instance) => setMapInstance(instance)}
          >
            <TileLayer url={tileUrl} noWrap />
            {/* ✅ 아래향 화살표 아이콘으로 마커 표시 */}
            {markerPosition && (
              <Marker position={markerPosition} icon={arrowDownIcon} />
            )}
            <ScaleControl />
          </MapContainer>

          {/* ✅ 날씨 정보 오버레이 박스 (우측 상단 고정) */}
          {weatherInfo && (
            <div
              className="weather-info"
              style={{
                position: 'absolute',
                top: 80, // 박스 위치 아래로 내림(보시고 위치 맘에 드는곳으로 조정 가능)
                right: 40,
                background: '#0055ff',
                color: '#fff',
                padding: '24px 30px',
                borderRadius: '22px',
                fontSize: '2rem',
                boxShadow: '0 2px 15px rgba(0,0,0,0.15)',
                zIndex: 1200,
                fontWeight: 600,
                minWidth: 250,
                lineHeight: 1.6,
              }}
            >
              <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '1.6rem', marginRight: 12 }}>✅</span>
                날씨: {weatherInfo.description}
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '1.6rem', marginRight: 12 }}>✅</span>
                온도: {Number(weatherInfo.temp).toFixed(2)}°C
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
}

export default App;

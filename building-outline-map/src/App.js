import React, { useEffect, useState } from 'react';
import './App.css';

import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Popup from './components/Popup/Popup';
import NaverMap from './components/Map/NaverMap';


const ATTRIBUTION = '© Naver Maps, © NAVER Corp.';

function App() {
  const [showEmoji, setShowEmoji] = useState(true);
  const [mapStyle, setMapStyle] = useState('base');
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);


  const [searchQuery, setSearchQuery] = useState('');
  const [markerPosition, setMarkerPosition] = useState(null);


// 다크모드
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#222' : '#fff';
    document.body.style.color = darkMode ? '#fff' : '#000';
  }, [darkMode]);

//    useEffect(()=>{
//     const initMap = () => {
//       const map = new naver.maps.Map("map", {
//         center: new naver.maps.LatLng(37.5665, 126.9780), // 초기 위치
//         zoom: 18,
//       });
//       setMap(map);
//     }
//   initMap();
// },[]);

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
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          user={user}
          setUser={setUser}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="map_container">
          <NaverMap
            markerPosition={markerPosition}
            setMarkerPosition={setMarkerPosition}
          />
        </div>
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default App;

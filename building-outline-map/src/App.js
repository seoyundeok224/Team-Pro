import React, { useState, useEffect } from 'react';
import './App.css';

import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Popup from './components/Popup/Popup';
import NaverMap from './components/Map/NaverMap';
import WeatherBar from './components/Weather/WeatherBar';

function App() {
  const [showEmoji, setShowEmoji] = useState(true);
  const [mapStyle, setMapStyle] = useState('base');
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null); // 로그인 상태 관리


  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#222' : '#fff';
    document.body.style.color = darkMode ? '#fff' : '#000';
  }, [darkMode]);

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

        <div className="map-container">
          <NaverMap />
          <WeatherBar darkMode={darkMode} />
        </div>
      </div>
      <Footer darkMode={darkMode} />
    </div>
    
  );
}

export default App;

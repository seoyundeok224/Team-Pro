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
  const [user, setUser] = useState(null);
  const [searchResults, setSearchResults] = useState([]);       // ✅ 추가
  const [selectedPlace, setSelectedPlace] = useState(null);     // ✅ 추가
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
          setMapStyle={setMapStyle}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}            // ✅ 추가
          setSearchResults={setSearchResults}      // ✅ 추가
          setSelectedPlace={setSelectedPlace}      // ✅ 추가
        />

        <div className="map-container">
          <NaverMap
            searchQuery={searchQuery}
            selectedPlace={selectedPlace}           // ✅ 전달
          />
          <WeatherBar
            darkMode={darkMode}
            searchQuery={searchQuery}
          />
        </div>
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
}

export default App;

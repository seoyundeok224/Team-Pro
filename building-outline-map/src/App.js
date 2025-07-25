import React, { useState, useEffect, useRef } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Popup from "./components/Popup/Popup";
import NaverMap from "./components/Map/NaverMap";
import WeatherBar from "./components/Weather/WeatherBar";

function App() {
  const [showEmoji, setShowEmoji] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#222" : "#fff";
    document.body.style.color = darkMode ? "#fff" : "#000";
  }, [darkMode]);

  return (
    <div className={`App ${darkMode ? "dark" : ""}`}>
      <Popup />
      <Navbar darkMode={darkMode} />
      <div className="main-layout">
        <Sidebar
          showEmoji={showEmoji}
          setShowEmoji={setShowEmoji}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          selectedPlace={selectedPlace}
          setSelectedPlace={setSelectedPlace}
        />

        <div className="map-container">
          <NaverMap
            searchResults={searchResults}
            selectedPlace={selectedPlace}
          />
          <WeatherBar darkMode={darkMode} searchQuery={searchQuery} />
        </div>
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
}

export default App;

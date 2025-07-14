import React, { useEffect, useState } from 'react';
import './WeatherBar.css';

const API_KEY_1 = '84a4cfe7ca79fc9b0120217a7d5a2028'; // openweathermap API

function WeatherBar({darkMode, searchQuery}) {

  const [today, setToday] = useState(null);
  const [hourly, setHourly] = useState([]);
  const [locationName, setLocationName] = useState('지역 날씨 정보');

  
  // 주소 -> 좌표 변환
  const getCoordinates = async (query) => {
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${API_KEY_1}`
    );
    const data = await res.json();
    if (data.length === 0) {
      alert("해당 지역을 찾을 수 없습니다.");
      return null;
    }
    return {
      lat: data[0].lat,
      lon: data[0].lon,
      name: `${data[0].name}${data[0].state ? ', ' + data[0].state : ''}`,
    };
  };


  // 날씨 정보 요청
  const fetchWeather = async (coords) => {
    const resToday = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY_1}&units=metric&lang=kr`
    );
    
    const dataToday = await resToday.json();
    setToday(dataToday);

    const resHourly = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY_1}&units=metric&lang=kr`
    );

    const dataHourly = await resHourly.json();
    setHourly(dataHourly.list.slice(0,6));
  };


  // 검색어가 변경될 때마다 날씨 갱신
  useEffect(() => {
    const loadWeather = async () => {
      if (!searchQuery) return;
      const coords = await getCoordinates(searchQuery);
      if (coords) {
        setLocationName(searchQuery);
        fetchWeather(coords);
      }
    };
    loadWeather();
  }, [searchQuery]);
    
  return (
    <div className={`weather-placeBar ${darkMode ? 'dark' : 'light'}`}>
      <div className='weather-card'>
      <h3>🌤 {locationName}</h3>

      <div className='today-section'>
        <h4>오늘의 날씨</h4>
         
           {today ? (
            <div className='today-content'>
              <img
                src={`https://openweathermap.org/img/wn/${today.weather[0].icon}@2x.png`}
                alt="weather-icon"
              />
              <div>
              <p className='temp'>{today.main.temp.toFixed(1)}℃</p>
              <p>{today.weather[0].description}</p>
              </div>
              </div>
           ) : (
            <p>로딩 중...</p>
           )}
        </div>
        

        <div className='hourly-section'>
          <h4>시간대별 날씨</h4>
          <div className='hourly-scroll'>  
            {hourly.map((item, index) => (
              <div className='hourly-card' key={index}>
                <p>{item.dt_txt.split(' ')[1].slice(0, 5)}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                  alt="icon"
                />
                <p>{item.main.temp.toFixed(1)}℃</p>
                </div>
            ))}      
          </div>
        </div>            
      </div>
      </div>
  );
}



export default WeatherBar;
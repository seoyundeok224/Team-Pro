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
    if (data.length === 0) return null;
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
    setHourly(dataHourly.list.slice(0,7));
  };


  // 검색어가 변경될 때마다 날씨 갱신
  useEffect(() => {
    const loadWeather = async () => {
      const coords = await getCoordinates(searchQuery || '지역 날씨 정보');
      if (coords) {
        setLocationName(coords.name);
        fetchWeather(coords);
      }
    };
    loadWeather();
  }, [searchQuery]);
    

  return (
    
    <div className={`weather-placeBar ${darkMode ? 'whea-dark' : 'whea-light'}`}>
      
      <h3>🌤 {locationName}</h3>

      <div className='weather-section today-weather'>
        <h4>오늘의 날씨</h4>
        <div className='weather-content'>
           {today ? (
            <div>
              <p>{today.main.temp}℃</p>
              <p>{today.weather[0].description}</p>
              </div>
           ) : (
            <p>로딩 중...</p>
           )}
        </div>
        </div>
        

        <div className='weather-section hourly-weather'>
          <h4>시간대별 날씨</h4>
          <div className='weather-content'>
            {hourly.length > 0 ? (
              hourly.map((item, index) => (
                <div key={index}>
                  <p>시간 : {item.dt_txt.split(' ')[1].slice(0, 5)}</p>
                  <p>온도 : {item.main.temp}℃</p>
                  </div>
              ))
            ) : (
              <p>로딩 중 ...</p>
            )}
          </div>
        </div>            
      </div>
  );
}



export default WeatherBar;
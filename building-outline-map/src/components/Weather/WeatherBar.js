import React, { useEffect, useState } from 'react';
import './WeatherBar.css';

const API_KEY_1 = '84a4cfe7ca79fc9b0120217a7d5a2028';
const API_KEY_2 = '018a628cfd0dc32361eef05ce0722e2d';
const SUWON_COORDS ={
  lat: 37.2923,
  lon: 127.0089
};

function WeatherBar({darkMode}) {

  const [today, setToday] = useState(null);
  const [hourly, setHourly] = useState([]);
  // const [weekly, setWeekly] = useState([]);

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${SUWON_COORDS.lat}&lon=${SUWON_COORDS.lon}&appid=${API_KEY_1}&units=metric&lang=kr`
    )
    .then((res) => res.json())
      .then((data) => setToday(data));

    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${SUWON_COORDS.lat}&lon=${SUWON_COORDS.lon}&appid=${API_KEY_2}&units=metric&lang=kr`
    )  
    .then((res) => res.json())
    .then((data) => {
      setHourly(data.list.slice(0, 7));
    });
  }, []);

  return (
    
    <div className={`weather-placeBar ${darkMode ? 'whea-dark' : 'whea-light'}`}>
      
      <h3>🌤 수원시 장안구 영화동</h3>

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
        

        {/* <div className='weather-section weekly-weather'> 
          <h4>주간 날씨</h4>
          <div className='weather-content'>
          {weekly.length > 0 ? (
            weekly.map((item, index) => (
              <div key={index}>
                <p>
                  {new Date(item.dt * 1000).toLocaleDateString('ko-KR', {
                    weekday: 'short'
                  })}
                </p>
                <p>{item.temp.day}℃</p>
                </div>
            ))
          ) : (
            <p>로딩 중...</p>
          )}
        </div>
      </div> */}

      </div>
  );
}


export default WeatherBar;
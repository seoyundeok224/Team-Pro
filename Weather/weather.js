import React, { useState, useEffect} from "react";

const Weather = ({ lat, lon }) => {
  const [weather, setWeather] = useState(null);
  const API_KEY = '84a4cfe7ca79fc9b0120217a7d5a2028'; // OpenWeatherMap에서 받은 키

  useEffect(() => {
    if(!lat || !lon) return;

    const fetchWeather = async () => {
        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat= ${lat}&lon = ${lon}&appid = ${API_KEY}&units=metric&lang=kr`
            );
            const data = await res.json();
            setWeather(data);
        } catch (error) {
            console.error('날씨 정보 에러:', error);
        }
    };

    fetchWeather();

    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, [lat, lon]);

  if (!weather) return <div className="weather-box">날씨 로딩중...</div>;

  return (
    <div className="weather-box">
        <h4>현재 날씨</h4>
        <div>지역: {weather.name}</div>
        <div>온도: {weather.main.temp}°C</div>
        <div>상태: {weather.weather[0].description}</div>
        <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} alt="날씨 아이콘" />
    </div>
  );
};

export default Weather;
import React, { useEffect, useState } from 'react';
import './WeatherBar.css';

const API_KEY_1 = '84a4cfe7ca79fc9b0120217a7d5a2028'; // OpenWeatherMap API

function WeatherBar({ darkMode, searchQuery }) {
  const [today, setToday] = useState(null);
  const [hourly, setHourly] = useState([]);
  const [locationName, setLocationName] = useState('지역 날씨 정보');

  // ✅ Kakao 주소 → 좌표 변환 (프록시 사용)
  const getCoordinates = async (query) => {
    if (!query) return null;

    const refinedQuery = query
      .trim()
      .replace("서울시", "서울")
      .replace("경기도", "경기")
      .replace("부산시", "부산")
      .replace(/\s+/g, " ");

    try {
      const res = await fetch(`http://localhost:4000/kakao/address?query=${encodeURIComponent(refinedQuery)}`);
      const data = await res.json();

      if (!data.documents || data.documents.length === 0) return null;

      const { x, y, address_name } = data.documents[0];

      return {
        lat: y,
        lon: x,
        name: address_name,
      };
    } catch (err) {
      console.error('주소 → 좌표 변환 실패:', err);
      return null;
    }
  };

  // 날씨 정보 요청
  const fetchWeather = async ({ lat, lon }) => {
    const todayRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather` +
        `?lat=${lat}&lon=${lon}` +
        `&appid=${API_KEY_1}&units=metric&lang=kr`
    );
    const todayData = await todayRes.json();
    setToday(todayData);

    const hourlyRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast` +
        `?lat=${lat}&lon=${lon}` +
        `&appid=${API_KEY_1}&units=metric&lang=kr`
    );
    const hourlyData = await hourlyRes.json();
    setHourly(hourlyData.list.slice(0, 6));
  };

  // 검색어 변경 시 실행
  useEffect(() => {
    (async () => {
      if (!searchQuery) return;
      const coords = await getCoordinates(searchQuery);
      if (coords) {
        setLocationName(coords.name);
        fetchWeather(coords);
      }
    })();
  }, [searchQuery]);

  return (
    <div className={`weather-placeBar ${darkMode ? 'dark' : 'light'}`}>
      <div className="weather-card">
        <h3>🌤 {locationName}</h3>

        <div className="today-section">
          <h4>오늘의 날씨</h4>
          {today ? (
            <div className="today-content">
              <img
                src={`https://openweathermap.org/img/wn/${today.weather[0].icon}@2x.png`}
                alt="weather-icon"
              />
              <div>
                <p className="temp">{today.main.temp.toFixed(1)}℃</p>
                <p>{today.weather[0].description}</p>
              </div>
            </div>
          ) : (
            <p>로딩 중...</p>
          )}
        </div>

        <div className="hourly-section">
          <h4>시간대별 날씨</h4>
          <div className="hourly-scroll">
            {hourly.map((item, idx) => (
              <div className="hourly-card" key={idx}>
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

import React, { useEffect, useState } from 'react';
import './WeatherBar.css';

const API_KEY_1 = '84a4cfe7ca79fc9b0120217a7d5a2028'; // OpenWeatherMap API

function WeatherBar({ darkMode, searchQuery }) {
  const [today, setToday] = useState(null);
  const [hourly, setHourly] = useState([]);
  const [locationName, setLocationName] = useState('지역 날씨 정보');

  // 주소 -> 좌표 변환 (토큰별 fallback)
  const getCoordinates = async (query) => {
    if (!query) return null;
    const fetchGeo = async (q) => {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct` +
          `?q=${encodeURIComponent(q)}` +
          `&limit=1` +
          `&appid=${API_KEY_1}` +
          `&lang=kr`
      );
      return await res.json();
    };

    // 1) 원본 쿼리 시도
    let data = await fetchGeo(query);
    if (!data || data.length === 0) {
      // 2) 실패하면 토큰별로 역순으로 시도
      const parts = query.trim().split(/\s+/);
      for (let i = parts.length - 1; i >= 0; i--) {
        const part = parts[i];
        if (!part) continue;
        data = await fetchGeo(part);
        if (data && data.length > 0) {
          query = part;
          break;
        }
      }
    }

    if (!data || data.length === 0) {
      alert('해당 지역을 찾을 수 없습니다.');
      return null;
    }

    return {
      lat: data[0].lat,
      lon: data[0].lon,
      name: query,
    };
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

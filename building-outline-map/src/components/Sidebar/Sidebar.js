import React, { useState } from 'react';
import axios from 'axios'; // axios 불러오기

const Sidebar = ({
  showEmoji, setShowEmoji,
  mapStyle, setMapStyle,
  language, setLanguage,
  setGeoData,
  darkMode, setDarkMode,
  user, setUser,
  searchQuery, setSearchQuery
}) => {
  const [inputValue, setInputValue] = useState('');

  // 📌 Kakao REST API 키 (직접 코드에 하드코딩 가능하지만 보안상 .env 권장)
  const KAKAO_REST_API_KEY = '18e03817ba40474c211871cc79a337bc';

  // 🔍 검색 버튼 클릭 시 Kakao 주소 검색 API 호출
  const handleSearch = async () => {
    if (inputValue.trim() === '') return;

    try {
      const response = await axios.get(
        'https://dapi.kakao.com/v2/local/search/address.json',
        {
          params: { query: inputValue },
          headers: {
            Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`
          }
        }
      );

      const place = response.data.documents[0];
      if (!place) {
        alert('주소를 찾을 수 없습니다.');
        return;
      }

      const lat = parseFloat(place.y);
      const lon = parseFloat(place.x);

      // 지도 이동 및 날씨 API 호출용 정보 전달
      setSearchQuery({
        lat,
        lon,
        name: place.address_name
      });

      console.log(`✅ 검색 위치: ${place.address_name}`);
      console.log(`📍 위도: ${lat}, 경도: ${lon}`);
    } catch (error) {
      console.error('주소 검색 실패:', error);
      alert('검색 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={`sidebar ${darkMode ? 'dark' : ''}`}>
      <h2>🛠️ 기능 메뉴</h2>

      <h3>위치 검색</h3>
      <input
        type="text"
        className="search-input"
        placeholder="도시나 지역 이름을 입력하세요"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button className="search-button" onClick={handleSearch}>🔍 검색</button>

      <hr />

      <button onClick={() => setShowEmoji(!showEmoji)}>
        {showEmoji ? '🏢 마커 숨기기' : '🏢 마커 보이기'}
      </button>

      <h3>지도 스타일</h3>
      <button onClick={() => setMapStyle('base')}>일반 지도</button>
      <button onClick={() => setMapStyle('satellite')}>위성 지도</button>

      <h3>다크 모드</h3>
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '💡 라이트 모드' : '🌙 다크 모드'}
      </button>

      <h3>초기화</h3>
      <button onClick={() => window.location.reload()}>🔄 초기화</button>
    </div>
  );
};

export default Sidebar;
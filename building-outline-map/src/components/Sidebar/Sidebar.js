import React, { useState } from 'react';

// 📌 Sidebar 컴포넌트 정의
const Sidebar = ({

  showEmoji, setShowEmoji,         // 마커 보이기/숨기기 상태 및 설정 함수
  darkMode, setDarkMode,           // 다크 모드 상태 및 설정 함수
  searchQuery, setSearchQuery      // 검색어 상태 및 설정 함수

}) => {
  const [inputValue, setInputValue] = useState('');

  // 🔍 주소 검색 요청 함수 (Kakao 주소 검색 API 호출)
 const handleSearch = () => {
    if (inputValue.trim() !== '') {
      setSearchQuery(inputValue); 
    }
  };

  return (
    <div className={`sidebar ${darkMode ? 'dark' : ''}`}>
      <h2>🛠️ 기능 메뉴</h2>

      {/* 🔎 위치 검색 입력창 및 버튼 */}
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

      {/* 🌙 다크 모드 전환 */}
      <h3>다크 모드</h3>
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '💡 라이트 모드' : '🌙 다크 모드'}
      </button>

      {/* 🔄 초기화 버튼 */}
      <h3>초기화</h3>
      <button onClick={() => window.location.reload()}>🔄 초기화</button>
    </div>
  );
};

export default Sidebar;
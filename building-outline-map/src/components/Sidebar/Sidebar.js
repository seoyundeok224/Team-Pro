import React, { useState } from 'react';

// Sidebar 컴포넌트 정의
const Sidebar = ({
  showEmoji, setShowEmoji,         // 마커 보이기/숨기기 상태 및 설정 함수
  darkMode, setDarkMode,           // 다크 모드 상태 및 설정 함수
  searchQuery, setSearchQuery      // 검색어 상태 및 설정 함수
}) => {
  const [inputValue, setInputValue] = useState(''); // 내부 검색어 입력 상태

  // ⌨️ 검색 버튼 클릭 또는 Enter 입력 시 호출되는 함수
  // 도시나 지역 이름을 입력하고 검색하면 지도 중심이 해당 위치로 이동합니다.
  const handleSearch = () => {
    if (inputValue.trim() !== '') {
      setSearchQuery(inputValue);  // 검색어 상태 업데이트 (MainMap에서 처리)
    }
  };

  return (
    <div className={`sidebar ${darkMode ? 'dark' : ''}`}> {/* 다크 모드 적용 */}
      <h2>🛠️ 기능 메뉴</h2>

      {/* 🔍 위치 검색: 도시나 지역 이름을 입력하고 검색하면 지도 중심이 이동합니다 */}
      <h3>위치 검색</h3>
      <input
        type="text"
        className="search-input"
        placeholder="도시나 지역 이름을 입력하세요" // 예: 서울, 부산, 제주 등
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // 입력값 상태 업데이트
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Enter 시 검색 실행
      />
      <button className="search-button" onClick={handleSearch}>🔍 검색</button>

      <hr />

      {/* 🌙 다크 모드 전환 */}
      <h3>다크 모드</h3>
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '💡 라이트 모드' : '🌙 다크 모드'}
      </button>

      <h3>초기화</h3>
      {/* 🔄 초기화 (전체 페이지 새로고침) */}
      <button onClick={() => window.location.reload()}>🔄 초기화</button>
    </div>
  );
};

export default Sidebar;
import React, { useState } from 'react';

const Sidebar = ({
  onSearch,
  showEmoji,
  setShowEmoji,
  darkMode,
  setDarkMode,
  searchQuery, setSearchQuery
}) => {
  const [inputValue, setInputValue] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  // ⌨️ 검색 실행 함수
  const handleSearch = () => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput === '') return;

    // App으로 검색어 전달
    setSearchQuery(trimmedInput);

    // 🧠 중복 제거 + 최근 항목 추가
     setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item !== trimmedInput);
      return [trimmedInput, ...filtered].slice(0, 5);
    });

  setInputValue(''); // 입력창 초기화
};

// 🗑️ 검색 히스토리에서 개별 키워드 삭제
const handleDeleteKeyword = (keyword) => {
  setSearchHistory(prev => prev.filter((item) => item !== keyword));
};

return (
  <div className={`sidebar ${darkMode ? 'dark' : ''}`}>
    <h2>🛠️ 기능 메뉴</h2>

    {/* 🔍 위치 검색 */}
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

    {/* 📜 최근 검색어 표시 */}
    {searchHistory.length > 0 && (
      <>
        <h4>최근 검색어</h4>
        <ul className="search-history">
          {searchHistory.map((item, index) => (
            <li
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px'
              }}
            >
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setInputValue(item);
                  onSearch(item);     // 히스토리 클릭 시에도 onSearch 만 호출
                }}
              >
                - {item}
              </span>
              <button
                onClick={() => handleDeleteKeyword(item)} // 해당 검색어 삭제
                style={{
                  marginLeft: '10px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'red',
                  cursor: 'pointer'
                }}
                title="삭제"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
        {/* 🔄 전체 검색어 기록 삭제 */}
        <button
          onClick={() => setSearchHistory([])}
          style={{ marginTop: '10px' }}
        >
          🧹 전체 기록 삭제
        </button>
      </>
    )}

    <hr />

    {/* 🌙 다크 모드 */}
    <h3>다크 모드</h3>
    <button onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? '💡 라이트 모드' : '🌙 다크 모드'}
    </button>

    {/* 🔄 초기화 */}
    <h3>초기화</h3>
    <button onClick={() => window.location.reload()}>🔄 초기화</button>
  </div>
);
};

export default Sidebar;

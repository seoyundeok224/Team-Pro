import React, { useState, useRef, useEffect } from 'react';
import './Sidebar.css';
import LocationSearch from './LocationSearch';

const Sidebar = ({
  onSearch,
  showEmoji,
  setShowEmoji,
  darkMode,
  setDarkMode,
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  selectedPlace,
  setSelectedPlace,
}) => {

  // 입력값 상태
  const [inputValue, setInputValue] = useState('');

  // 최근 검색어 리스트 상태 (localStorage 초기화)
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // 즐겨찾기 리스트 상태
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // 최근 검색어 토글 상태
  const [showHistory, setShowHistory] = useState(true);

  // 오류 메시지 상태
  const [errorMessage, setErrorMessage] = useState('');

  // 사이드바 접힘 상태
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 자동완성 리스트 상태
  const [autocompleteList, setAutocompleteList] = useState([]);

  // 자동완성 영역 외부 클릭 감지를 위한 ref
  const autocompleteRef = useRef(null);

  // 검색 실행 함수
  const handleSearch = () => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput === '') {
      setErrorMessage('검색어를 입력하세요');
      return;
    }

    setErrorMessage('');
    setSearchQuery(trimmedInput);

    // 중복 제거 + 최대 5개 저장
    setSearchHistory((prevHistory) => {
      const updated = [trimmedInput, ...prevHistory.filter(item => item !== trimmedInput)];
      localStorage.setItem('searchHistory', JSON.stringify(updated.slice(0, 5)));
      return updated.slice(0, 5);
    });

    setInputValue('');
    setAutocompleteList([]);
  };

  // 입력값 변경 시 자동완성 업데이트
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    if (val.length === 0) {
      setAutocompleteList([]);
      setErrorMessage('');
      return;
    }

    const filtered = searchHistory.filter(item =>
      item.toLowerCase().includes(val.toLowerCase())
    );
    setAutocompleteList(filtered.slice(0, 5));
    setErrorMessage('');
  };

  // 즐겨찾기 추가/삭제
  const toggleFavorite = (keyword) => {
    const updated = favorites.includes(keyword)
      ? favorites.filter(item => item !== keyword)
      : [...favorites, keyword];

    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  // 특정 검색어 삭제
  const handleDeleteKeyword = (keyword) => {
    const updated = searchHistory.filter((item) => item !== keyword);
    setSearchHistory(updated);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
  };

  // 전체 검색 기록 삭제
  const clearAllHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // 사이드바 접기/펼치기 토글
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  // 자동완성 클릭 시 검색 실행
  const handleAutocompleteClick = (keyword) => {
    setInputValue(keyword);
    setSearchQuery(keyword);
    setAutocompleteList([]);
  };

  // 외부 클릭 시 자동완성 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target)
      ) {
        setAutocompleteList([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`sidebar ${darkMode ? 'dark' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
      
      {/* 사이드바 접기 버튼 */}
      <button
        className="collapse-button"
        onClick={toggleSidebar}
        aria-label={sidebarCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
      >
        {sidebarCollapsed ? '▶' : '◀'}
      </button>

      {/* 접혀있지 않을 때만 내용 표시 */}
      {!sidebarCollapsed && (
        <>
          <h2>🛠️ 기능 메뉴</h2>

          {/* 위치 검색 */}
          <h3>위치 검색</h3>
          <div className="input-wrapper" ref={autocompleteRef}>
            <input
              type="text"
              className="search-input"
              placeholder="도시나 지역 이름을 입력하세요"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              autoComplete="off"
              aria-label="위치 검색 입력창"
            />

            {/* 입력 클리어 버튼 */}
            {inputValue && (
              <button
                className="clear-input-btn"
                onClick={() => {
                  setInputValue('');
                  setErrorMessage('');
                  setAutocompleteList([]);
                }}
                aria-label="검색어 지우기"
              >
                ✕
              </button>
            )}

            {/* 자동완성 리스트 */}
            {autocompleteList.length > 0 && (
              <ul className="autocomplete-list" role="listbox">
                {autocompleteList.map((item, idx) => (
                  <li
                    key={idx}
                    role="option"
                    tabIndex={0}
                    className="autocomplete-item"
                    onClick={() => handleAutocompleteClick(item)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAutocompleteClick(item)}
                  >
                    {item}{favorites.includes(item) ? ' ⭐' : ''}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 검색 실행 버튼 */}
          <button className="search-button" onClick={handleSearch}>🔍 검색</button>

          {/* 오류 메시지 */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          {/* 최근 검색어 토글 */}
          <button
            className="toggle-history-btn"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? '최근 검색어 숨기기 ▲' : '최근 검색어 보기 ▼'}
          </button>

          {/* 최근 검색어 목록 */}
          {showHistory && searchHistory.length > 0 && (
            <>
              <h4>최근 검색어</h4>
              <ul className="search-history">
                {searchHistory.map((item, index) => (
                  <li key={index} className="search-item">
                    <span
                      className="search-keyword"
                      onClick={() => {
                        setInputValue(item);
                        setSearchQuery(item);
                      }}
                    >
                      🔁 {item}
                    </span>
                    <button
                      className="fav-btn"
                      onClick={() => toggleFavorite(item)}
                      aria-label={favorites.includes(item) ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                    >
                      {favorites.includes(item) ? '★' : '☆'}
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteKeyword(item)}
                      aria-label="검색어 삭제"
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>

              {/* 전체 검색 기록 삭제 버튼 */}
              <button
                className="clear-history-btn"
                onClick={clearAllHistory}
              >
                🧹 전체 기록 삭제
              </button>
            </>
          )}

          <hr />

          {/* 다크모드 & 초기화 버튼 (가로 배치) */}
          <h3>설정</h3>
          <div className="top-controls">
            <button
              className="toggle-darkmode-btn"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? '💡 라이트 모드' : '🌙 다크 모드'}
            </button>
            <button
              className="reset-page-btn"
              onClick={() => window.location.reload()}
            >
              🔄 초기화
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;

import React, { useState, useRef, useEffect } from 'react';
import './Sidebar.css';

const Sidebar = ({
  showEmoji, setShowEmoji,
  darkMode, setDarkMode,
  searchQuery, setSearchQuery
}) => {
  // 입력값 상태
  const [inputValue, setInputValue] = useState('');
  // 최근 검색어 리스트 상태 (localStorage에서 초기화)
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });
  // 즐겨찾기 리스트 상태 (localStorage에서 초기화)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  // 최근 검색어 영역 보이기/숨기기 토글 상태
  const [showHistory, setShowHistory] = useState(true);
  // 검색 오류 메시지 상태 (예: 빈 입력 등)
  const [errorMessage, setErrorMessage] = useState('');
  // 사이드바 접기/펼치기 상태
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // 자동완성 후보 리스트 상태
  const [autocompleteList, setAutocompleteList] = useState([]);
  // 자동완성 리스트 바깥 클릭 감지를 위한 ref
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

    // 중복 제거 및 최대 5개까지만 최근검색어 업데이트 + localStorage 저장
    setSearchHistory((prevHistory) => {
      const updated = [trimmedInput, ...prevHistory.filter(item => item !== trimmedInput)];
      localStorage.setItem('searchHistory', JSON.stringify(updated.slice(0, 5)));
      return updated.slice(0, 5);
    });

    setInputValue('');
    setAutocompleteList([]);
  };

  // 입력 변경시 자동완성 후보 필터링 및 오류 메시지 초기화
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    if (val.length === 0) {
      setAutocompleteList([]);
      setErrorMessage('');
      return;
    }
    // 최근 검색어 중 입력값 포함된 항목 최대 5개 필터링
    const filtered = searchHistory.filter(item =>
      item.toLowerCase().includes(val.toLowerCase())
    );
    setAutocompleteList(filtered.slice(0, 5));
    setErrorMessage('');
  };

  // 즐겨찾기 토글 함수 (추가/삭제)
  const toggleFavorite = (keyword) => {
    let updated;
    if (favorites.includes(keyword)) {
      updated = favorites.filter(item => item !== keyword);
    } else {
      updated = [...favorites, keyword];
    }
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  // 특정 검색어 삭제 함수
  const handleDeleteKeyword = (keyword) => {
    const updated = searchHistory.filter((item) => item !== keyword);
    setSearchHistory(updated);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
  };

  // 전체 검색 기록 삭제 함수
  const clearAllHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // 사이드바 접기/펼치기 토글 함수
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  // 자동완성 항목 클릭 시 검색 실행 및 리스트 닫기
  const handleAutocompleteClick = (keyword) => {
    setInputValue(keyword);
    setSearchQuery(keyword);
    setAutocompleteList([]);
  };

  // 자동완성 리스트 외부 클릭 시 닫기
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
      {/* 사이드바 접기/펼치기 버튼 */}
      <button
        className="collapse-button"
        onClick={toggleSidebar}
        aria-label={sidebarCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
      >
        {sidebarCollapsed ? '▶' : '◀'}
      </button>

      {/* 접혀있지 않은 경우만 내용 표시 */}
      {!sidebarCollapsed && (
        <>
          <h2>🛠️ 기능 메뉴</h2>

          {/* 위치 검색 입력창 */}
          <h3>위치 검색</h3>
          <div className="input-wrapper" ref={autocompleteRef}>
            <input
              type="text"
              className="search-input"
              placeholder="도시나 지역 이름을 입력하세요"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              aria-label="위치 검색 입력창"
              autoComplete="off"
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

            {/* 자동완성 후보 리스트 */}
            {autocompleteList.length > 0 && (
              <ul className="autocomplete-list" role="listbox">
                {autocompleteList.map((item, idx) => (
                  <li
                    key={idx}
                    role="option"
                    tabIndex={0}
                    onClick={() => handleAutocompleteClick(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAutocompleteClick(item);
                    }}
                    className="autocomplete-item"
                  >
                    {item}
                    {favorites.includes(item) ? ' ⭐' : ''}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 검색 버튼 */}
          <button className="search-button" onClick={handleSearch}>🔍 검색</button>

          {/* 오류 메시지 표시 */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          {/* 최근 검색어 토글 버튼 */}
          <button
            className="toggle-history-btn"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? '최근 검색어 숨기기 ▲' : '최근 검색어 보기 ▼'}
          </button>

          {/* 최근 검색어 및 즐겨찾기 리스트 */}
          {showHistory && searchHistory.length > 0 && (
            <>
              <h4>최근 검색어</h4>
              <ul className="search-history">
                {searchHistory.map((item, index) => (
                  <li key={index} className="search-item">
                    <span
                      onClick={() => {
                        setInputValue(item);
                        setSearchQuery(item);
                      }}
                      className="search-keyword"
                      title="검색 실행"
                    >
                      🔁 {item}
                    </span>
                    {/* 즐겨찾기 토글 버튼 */}
                    <button
                      className="fav-btn"
                      onClick={() => toggleFavorite(item)}
                      aria-label={favorites.includes(item) ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                    >
                      {favorites.includes(item) ? '★' : '☆'}
                    </button>
                    {/* 삭제 버튼 */}
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

              {/* 전체 기록 삭제 버튼 */}
              <button
                className="clear-history-btn"
                onClick={clearAllHistory}
              >
                🧹 전체 기록 삭제
              </button>
            </>
          )}

          <hr />

          {/* 다크 모드 토글 */}
          <h3>다크 모드</h3>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '💡 라이트 모드' : '🌙 다크 모드'}
          </button>

          {/* 페이지 초기화 버튼 */}
          <h3>초기화</h3>
          <button onClick={() => window.location.reload()}>🔄 초기화</button>
        </>
      )}
    </div>
  );
};

export default Sidebar;
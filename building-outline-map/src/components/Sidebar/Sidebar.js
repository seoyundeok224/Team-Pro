import React, { useState, useRef, useEffect } from 'react';
import './Sidebar.css';

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
  setSelectedPlace       
}) => {
  const [inputValue, setInputValue] = useState('');
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [autocompleteList, setAutocompleteList] = useState([]);
  const autocompleteRef = useRef(null);

  const handleSearch = () => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput === '') {
      setErrorMessage('검색어를 입력하세요');
      return;
    }

    setErrorMessage('');
    setSearchQuery(trimmedInput);

    setSearchHistory((prevHistory) => {
      const updated = [trimmedInput, ...prevHistory.filter(item => item !== trimmedInput)];
      localStorage.setItem('searchHistory', JSON.stringify(updated.slice(0, 5)));
      return updated.slice(0, 5);
    });

    fetch(`http://localhost:4000/kakao/address?query=${encodeURIComponent(trimmedInput)}`)
      .then(res => res.json())
      .then(data => {
        if (!data.documents || data.documents.length === 0) {
          alert('주소 검색 실패: 결과 없음');
          return;
        }
        setSearchResults(data.documents);
      })
      .catch(err => {
        console.error('Kakao 주소 검색 오류:', err);
        alert('주소 검색 중 오류 발생');
      });

    setInputValue('');
    setAutocompleteList([]);
  };

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

  const toggleFavorite = (keyword) => {
    const updated = favorites.includes(keyword)
      ? favorites.filter(item => item !== keyword)
      : [...favorites, keyword];

    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const handleDeleteKeyword = (keyword) => {
    const updated = searchHistory.filter((item) => item !== keyword);
    setSearchHistory(updated);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
  };

  const clearAllHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const handleAutocompleteClick = (keyword) => {
    setInputValue(keyword);
    setSearchQuery(keyword);
    setAutocompleteList([]);
  };

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
      <button
        className="collapse-button"
        onClick={toggleSidebar}
        aria-label={sidebarCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
      >
        {sidebarCollapsed ? '▶' : '◀'}
      </button>

      {!sidebarCollapsed && (
        <>
          <h2>🛠️ 기능 메뉴</h2>

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

          <button className="search-button" onClick={handleSearch}>🔍 검색</button>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          {searchResults.length > 0 && (
            <>
              <h4>검색 결과</h4>
              <ul className="search-results">
                {searchResults.map((place, idx) => (
                  <li
                    key={idx}
                    className="search-result-item"
                    onClick={() => {
                      setSelectedPlace({
                        name: place.place_name || place.address_name,
                        x: parseFloat(place.x),
                        y: parseFloat(place.y),
                      });
                      setSearchResults([]);
                    }}
                  >
                    📍 {place.address_name}
                  </li>
                ))}
              </ul>
            </>
          )}

          <button
            className="toggle-history-btn"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? '최근 검색어 숨기기 ▲' : '최근 검색어 보기 ▼'}
          </button>

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
              <button
                className="clear-history-btn"
                onClick={clearAllHistory}
              >
                🧹 전체 기록 삭제
              </button>
            </>
          )}

          <hr />

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

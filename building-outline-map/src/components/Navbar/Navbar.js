import React, { useEffect, useState } from 'react';
import './Navbar.css'; // CSS 스타일을 불러옴

// Navbar 컴포넌트 정의
const Navbar = ({ darkMode }) => {
  // 현재 시간을 저장할 상태
  const [time, setTime] = useState(new Date());

  // 선택한 날짜를 저장할 상태
  const [selectedDate, setSelectedDate] = useState('');

  // 컴포넌트가 마운트될 때 1초마다 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date()); // 새로운 시간으로 갱신
    }, 1000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(timer);
  }, []);

  // 시간 형식 (ex. 15:32:10)
  const formattedTime = time.toLocaleTimeString();

  return (
    // 다크모드 여부에 따라 클래스 적용
    <nav className={`navbar ${darkMode ? 'nav-dark' : 'nav-light'}`}>
      {/* 로고 영역 */}
      <div className="logo">🗺️ 내 지도 앱</div>

      {/* 시계 + 달력 우측 영역 */}
      <div className="right-section">
        {/* 실시간 시계 표시 */}
        <div className="clock">{formattedTime}</div>

        {/* 달력 입력창 (input type="date") */}
        <input
          type="date"
          className="calendar"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)} // 날짜 선택 시 상태 갱신
        />
      </div>
    </nav>
  );
};

export default Navbar;
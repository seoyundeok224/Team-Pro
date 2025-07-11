import React, { useEffect, useState } from 'react';
import './Navbar.css';

// Navbar 컴포넌트: 상단 바에 로고, 날짜, 시간 표시
const Navbar = ({ darkMode }) => {
  // 현재 시간 상태를 저장하는 state
  const [time, setTime] = useState(new Date());

  // 컴포넌트가 마운트될 때 타이머 시작, 언마운트될 때 타이머 정리
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date()); // 1초마다 현재 시간 갱신
    }, 1000);

    return () => clearInterval(timer); // 컴포넌트 종료 시 타이머 제거
  }, []);

  // 현재 시간을 문자열로 포맷 (예: 오후 3:15:42)
  const formattedTime = time.toLocaleTimeString();

  // 현재 날짜를 한국어로 포맷 (예: 2025년 7월 9일 수요일)
  const formattedDate = time.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <nav className={`navbar ${darkMode ? 'nav-dark' : 'nav-light'}`}>
      {/* 로고 영역 */}
      <div className="logo">🗺️ 내 지도 앱</div>

      {/* 날짜 및 시간 영역 */}
      <div className="date-time">
        <div className="date">{formattedDate}</div>
        <div className="clock">{formattedTime}</div>
      </div>
    </nav>
  );
};

export default Navbar;
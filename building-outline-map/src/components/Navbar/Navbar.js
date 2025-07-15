import React, { useEffect, useState } from 'react';
import './Navbar.css';

const Navbar = ({ darkMode }) => {
  // 현재 시간 상태 관리
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // 1초마다 현재 시간 업데이트
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(timer);
  }, []);

  // 시계용 시간 문자열 (예: 14:30:59)
  const formattedTime = time.toLocaleTimeString();

  // 달력용 날짜 문자열 (예: 2025년 7월 11일 금요일)
  const formattedDate = time.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <nav className={`navbar ${darkMode ? 'nav-dark' : 'nav-light'}`}>
      {/* 왼쪽 로고 영역 */}
      <div className="logo">🗺️ 내 지도 앱</div>

      {/* 오른쪽 시계 + 달력 묶음 */}
      <div className="right-section">
        {/* 달력 날짜 표시 */}
        <div className="date">{formattedDate}</div>

        {/* 시계 */}
        <div className="clock">{formattedTime}</div>
      </div>
    </nav>
  );
};

export default Navbar;
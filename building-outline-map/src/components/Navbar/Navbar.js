import React, { useEffect, useState } from 'react';
import './Navbar.css';

// 🔧 상단 내비게이션 바 컴포넌트
const Navbar = ({ darkMode }) => {
  // ⏲️ 현재 시간 상태 저장
  const [time, setTime] = useState(new Date());

  // ⏰ 매초마다 현재 시간을 업데이트
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer); // 💨 컴포넌트 종료 시 타이머 정리
  }, []);

  // 🗓️ 날짜 형식 변환 (예: 2025년 7월 14일 월요일)
  const formattedDate = time.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  // 🕒 시간 형식 변환 (예: 14:26:53)
  const formattedTime = time.toLocaleTimeString();

  return (
    <nav className={`navbar ${darkMode ? 'nav-dark' : 'nav-light'}`}>
      {/* ⬅️ 왼쪽 로고 영역 */}
      <div className="logo">🗺️ My Map</div>

      {/* ➡️ 오른쪽 날짜 + 시간 + 사용자 */}
      <div className="right-section">
        <div className="date">📅 {formattedDate}</div>
        <div className="clock">⏰ {formattedTime}</div>
      </div>
    </nav>
  );
};

export default Navbar;
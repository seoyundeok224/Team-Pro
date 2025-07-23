import React, { useEffect, useState, useRef } from 'react';
import './Navbar.css';
import CalendarPopup from './CalendarPopup/CalendarPopup'; // 📦 달력 + 메모 팝업 컴포넌트

// 🔧 상단 내비게이션 바 컴포넌트
const Navbar = ({ darkMode }) => {
  // ⏰ 현재 시간 상태 저장
  const [time, setTime] = useState(new Date());

  // 📅 달력 팝업 표시 여부
  const [showCalendar, setShowCalendar] = useState(false);

  // 🧭 팝업 외부 클릭 감지를 위한 ref
  const calendarRef = useRef(null);

  // 🕒 실시간 시간 업데이트 (1초마다 갱신)
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer); // 💨 컴포넌트 언마운트 시 타이머 정리
  }, []);

  // 📆 현재 날짜 포맷: 예) 2025년 7월 16일 수요일
  const formattedDate = time.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  // ⌚ 현재 시간 포맷: 예) 11:07:44
  const formattedTime = time.toLocaleTimeString();

  // ❌ 팝업 외부 클릭 시 자동 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={`navbar ${darkMode ? 'nav-dark' : 'nav-light'}`}>
      {/* ⬅️ 왼쪽: 로고 */}
      <div className="logo">🗺️ My Map</div>

      {/* ➡️ 오른쪽: 날짜 + 시간 + 달력 팝업 */}
      <div className="right-section">
        {/* 📅 날짜 클릭 시 달력 팝업 열기/닫기 */}
        <div className="date" onClick={() => setShowCalendar((prev) => !prev)}>
          📅 {formattedDate}
        </div>

        {/* ⏰ 현재 시간 */}
        <div className="clock">⏰ {formattedTime}</div>

        {/* 📌 달력 + 메모 팝업 (클릭 시 노출) */}
        {showCalendar && (
          <div ref={calendarRef} className="calendar-popup-wrapper">
            <CalendarPopup onClose={() => setShowCalendar(false)} />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
import React, { useEffect, useState } from 'react';
import './Navbar.css';


// 🧭 Navbar 컴포넌트 - 어플리케이션 상단 네비게이션 바를 표시
const Navbar = ({ darkMode }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString();

  return (
    // 🌙 다크 모드 여부에 따라 클래스 변경 (스타일 다르게 적용)
    <nav className={`navbar ${darkMode ? 'nav-dark' : 'nav-light'}`}>
     <div className='logo'> 🗺️ 내 지도 앱 </div>{/* 네비게이션 바에 표시될 제목 또는 로고 */}
     <div className='clock'> {formattedTime}</div>
    </nav>
  );
};

export default Navbar;
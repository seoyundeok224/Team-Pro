import React from 'react';

// 🧭 Navbar 컴포넌트 - 어플리케이션 상단 네비게이션 바를 표시
const Navbar = ({ darkMode }) => {
  return (
    // 🌙 다크 모드 여부에 따라 클래스 변경 (스타일 다르게 적용)
    <nav className={darkMode ? 'nav-dark' : 'nav-light'}>
      🗺️ 내 지도 앱 {/* 네비게이션 바에 표시될 제목 또는 로고 */}
    </nav>
  );
};

export default Navbar;
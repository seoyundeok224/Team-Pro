import React, { useEffect, useState } from 'react';
import './Navbar.css';

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
    <nav className={`navbar ${darkMode ? 'nav-dark' : 'nav-light'}`}>
      <div className="logo">🗺️ 내 지도 앱</div>
      <div className="clock">{formattedTime}</div>
    </nav>
  );
};

export default Navbar;
import React from 'react';
import youtubeIcon from '../../assets/youtube-icon.png';
import instagramIcon from '../../assets/Instagram_icon.png';
import facebookIcon from '../../assets/Facebook.icon.png';
import './Footer.css';

const Footer = ({ darkMode }) => {
  return (
    <footer className={darkMode ? 'footer-dark' : 'footer-light'}>
      <div className="footer-content">
        
        {/* SNS 아이콘 그룹 - 오른쪽 정렬 */}
        <div id="social-icons-right" className="icon-container">
          <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
            <img src={youtubeIcon} alt="YouTube" className="sns-icon" />
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
            <img src={instagramIcon} alt="Instagram" className="sns-icon" />
          </a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
            <img src={facebookIcon} alt="Facebook" className="sns-icon" />
          </a>
        </div>

        {/* 주소 텍스트 (가운데 정렬) */}
        <div className="footer-address">
          (우) 00000 서울특별시 강남구 OO대로 000길 00-00<br />
          Tel: 01-1234-5678 | Fax: 00-000-0000 <br />
          Email: www.building-outline-map.com
        </div>

        {/* 구분선 */}
        <div className="footer-divider" />

        {/* 저작권 텍스트 */}
        <p className="copyright">
          © 2025 Team Project. All rights reserved. Created by Team Project Members
        </p>
      </div>
    </footer>
  );
};

export default Footer;
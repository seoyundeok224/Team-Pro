import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import popupImage from '../../assets/popup-image.png';
import './Popup.css';

const Popup = () => {
  const [visible, setVisible] = useState(true);
  const nodeRef = useRef(null); // Draggable과 함께 사용할 ref

  const closePopup = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="popup-backdrop">
      {/* 팝업 전체를 드래그 가능하게 설정 */}
      <Draggable nodeRef={nodeRef}>
        <div className="popup-box" ref={nodeRef}>
          <div className="popup-header">
            <h3 style={{ margin: 0 }}>information(안내)</h3>
          </div>

          <img src={popupImage} alt="알림 이미지" className="popup-image" />

          <p id="Korea" className="popup-text">
            - 서울 및 수도권이 반영되었습니다.
          </p>
          <p id="English" className="popup-text">
            - Data on buildings in Seoul and the metropolitan area are reflected.
          </p>

          <div className="popup-buttons">
            <button onClick={closePopup}>닫기</button>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default Popup;

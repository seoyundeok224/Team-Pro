import React, { useState } from 'react';
import './CalendarPopup.css';

// 📅 달력 + 메모 팝업 컴포넌트
const CalendarPopup = ({ onClose }) => {
  // 선택된 날짜 상태
  const [selectedDate, setSelectedDate] = useState('');
  
  // 현재 메모 입력값
  const [memo, setMemo] = useState('');
  
  // 저장된 메모 (날짜별로 저장됨)
  const [savedMemos, setSavedMemos] = useState({});

  // 📆 날짜 변경 핸들러 (날짜 선택 시 메모를 불러옴)
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setMemo(savedMemos[date] || ''); // 이미 저장된 메모가 있다면 불러옴
  };

  // 💾 메모 저장 핸들러
  const handleSaveMemo = () => {
    if (!selectedDate) return; // 날짜가 선택되지 않으면 저장하지 않음

    // 날짜별 메모 저장
    setSavedMemos((prev) => ({
      ...prev,
      [selectedDate]: memo,
    }));

    // 저장 후 상태 초기화 (메모 입력창 비우기, 날짜 비우기)
    setMemo('');
    setSelectedDate('');
  };

  // 📅 저장된 메모를 날짜별로 목록으로 보여줌
  const handleSelectSavedDate = (date) => {
    setSelectedDate(date);
    setMemo(savedMemos[date]);
  };

  // 🗑️ 메모 삭제 핸들러
  const handleDeleteMemo = (date) => {
    const newSavedMemos = { ...savedMemos };
    delete newSavedMemos[date];  // 해당 날짜 메모 삭제
    setSavedMemos(newSavedMemos); // 삭제된 메모를 상태에 반영
  };

  return (
    <div className="calendar-box">
      {/* 📆 날짜 선택 필드 */}
      <input
        type="date"
        className="date-picker"
        onChange={handleDateChange}
        value={selectedDate}
      />

      {/* 📝 메모 입력창 (날짜를 선택했을 때만 표시) */}
      {selectedDate && (
        <div className="memo-box">
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="메모를 입력하세요"
          />
          <div className="memo-buttons">
            <button onClick={handleSaveMemo}>💾 저장</button>
            <button onClick={onClose}>❌ 닫기</button>
          </div>
        </div>
      )}

      {/* 📅 저장된 메모 목록 */}
      {Object.keys(savedMemos).length > 0 && (
        <div className="saved-memos-list">
          <h4>저장된 목록</h4>
          <ul>
            {Object.keys(savedMemos).map((date) => (
              <li key={date} onClick={() => handleSelectSavedDate(date)}>
                <div className="memo-date">{date}</div>
                <div className="memo-preview">{savedMemos[date]}</div>
                <button 
                  className="delete-btn" 
                  onClick={(e) => {
                    e.stopPropagation();  // 클릭 이벤트 전파를 막아 팝업의 날짜 선택 동작을 방지
                    handleDeleteMemo(date); // 메모 삭제
                  }}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CalendarPopup;
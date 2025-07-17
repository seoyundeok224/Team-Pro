import React, { useState, useEffect } from 'react';
import './CalendarPopup.css';

const LOCAL_STORAGE_KEY = 'calendarMemos'; // 로컬스토리지 key 정의

// 📅 달력 + 메모 팝업 컴포넌트
const CalendarPopup = ({ onClose }) => {
  // 🗓️ 시작일과 종료일 상태
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 📝 메모 입력값 상태
  const [memo, setMemo] = useState('');

  // 💾 저장된 메모 리스트 [{ startDate, endDate, content }]
  const [savedMemos, setSavedMemos] = useState([]);

  // ✅ 요일에 따라 날짜 색상 지정 함수
  const getDayColor = (dateStr) => {
    if (!dateStr) return 'inherit';
    const day = new Date(dateStr).getDay(); // 0 = 일, 6 = 토
    if (day === 0) return 'red';   // 일요일 → 빨강
    if (day === 6) return 'blue';  // 토요일 → 파랑
    return 'black';                // 평일 → 검정
  };

  // 📂 컴포넌트가 처음 렌더링 될 때 로컬스토리지에서 메모 불러오기
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setSavedMemos(JSON.parse(stored)); // 저장된 값이 있다면 적용
      } catch (err) {
        console.error('메모 불러오기 오류:', err);
      }
    }
  }, []);

  // 💾 메모 저장 버튼 클릭 시
  const handleSaveMemo = () => {
    // 유효성 검사: 날짜, 메모 모두 입력되었는지 확인
    if (!startDate || !endDate || !memo.trim()) return;

    const newMemo = { startDate, endDate, content: memo };
    const updated = [...savedMemos, newMemo];

    setSavedMemos(updated); // 화면 상태 업데이트
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated)); // 로컬스토리지에도 저장

    // 입력값 초기화
    setStartDate('');
    setEndDate('');
    setMemo('');
  };

  // 🗑️ 메모 삭제 핸들러
  const handleDeleteMemo = (index) => {
    const updated = [...savedMemos];
    updated.splice(index, 1); // index 번째 항목 삭제

    setSavedMemos(updated); // 상태 업데이트
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated)); // 로컬스토리지 동기화
  };

  // ✏ 저장된 메모를 클릭하면 해당 내용을 편집할 수 있도록 설정
  const handleSelectMemo = (memoObj) => {
    setStartDate(memoObj.startDate);
    setEndDate(memoObj.endDate);
    setMemo(memoObj.content);
  };

  return (
    <div className="calendar-box">
      {/* 📆 날짜 선택 필드 (시작일 & 종료일) */}
      <div className="date-range-picker">
        <label>
          시작일:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ color: getDayColor(startDate) }} // 요일에 따라 색 적용
          />
        </label>

        <label>
          종료일:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ color: getDayColor(endDate) }} // 요일에 따라 색 적용
          />
        </label>
      </div>

      {/* 📝 메모 입력 필드 (날짜가 모두 선택되었을 때만 보임) */}
      {startDate && endDate && (
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

      {/* 📋 저장된 메모 목록 영역 */}
      {savedMemos.length > 0 && (
        <div className="saved-memos-list">
          <h4>저장된 목록</h4>
          <ul>
            {savedMemos.map((memoObj, index) => (
              <li key={index} onClick={() => handleSelectMemo(memoObj)}>
                {/* 📅 날짜 범위 표시 (요일 색상 적용) */}
                <div className="memo-date">
                  <span style={{ color: getDayColor(memoObj.startDate) }}>
                    {memoObj.startDate}
                  </span>
                  {' ~ '}
                  <span style={{ color: getDayColor(memoObj.endDate) }}>
                    {memoObj.endDate}
                  </span>
                </div>

                {/* ✨ 메모 내용 미리보기 */}
                <div className="memo-preview">{memoObj.content}</div>

                {/* 🗑 삭제 버튼 */}
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // 상위 클릭 이벤트 방지
                    handleDeleteMemo(index);
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
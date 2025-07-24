import React, { useState, useEffect } from 'react';
import './CalendarPopup.css';

const LOCAL_STORAGE_KEY = 'calendarMemos'; // 로컬스토리지 키 상수

const CalendarPopup = ({ onClose }) => {
  // 📅 상태 정의: 날짜, 메모 내용, 저장 목록, 수정 인덱스
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [memo, setMemo] = useState('');
  const [savedMemos, setSavedMemos] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null); // 수정 중인지 여부

  // 📂 로컬스토리지에서 메모 불러오기 (초기 렌더링 시)
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setSavedMemos(JSON.parse(stored));
      } catch (err) {
        console.error('메모 불러오기 오류:', err);
      }
    }
  }, []);

  // ✅ 요일별 색상 반환 함수 (일: 빨강, 토: 파랑, 평일: 검정)
  const getDayColor = (dateStr) => {
    if (!dateStr) return 'inherit';
    const day = new Date(dateStr).getDay();
    return day === 0 ? 'red' : day === 6 ? 'blue' : 'black';
  };

  // 🔄 입력값 초기화 함수
  const resetForm = () => {
    setStartDate('');
    setEndDate('');
    setMemo('');
    setEditingIndex(null);
  };

  // 💾 메모 저장 또는 수정 처리
  const handleSaveMemo = () => {
    // 필수 항목이 빠졌으면 저장 중단
    if (!startDate || !endDate || !memo.trim()) return;

    // 🛑 종료일이 시작일보다 빠르면 경고 후 중단
    if (new Date(startDate) > new Date(endDate)) {
      alert('⛔ 종료일은 시작일 이후여야 합니다.');
      return;
    }

    const newMemo = { startDate, endDate, content: memo };
    let updated;

    if (editingIndex !== null) {
      // ✏️ 기존 메모 수정 중이면 해당 항목 업데이트
      updated = [...savedMemos];
      updated[editingIndex] = newMemo;
    } else {
      // 🔍 중복된 날짜 범위 확인
      const existingIndex = savedMemos.findIndex(
        (m) => m.startDate === startDate && m.endDate === endDate
      );

      if (existingIndex !== -1) {
        // ⚠️ 중복된 항목이 있으면 사용자에게 덮어쓰기 여부 확인
        const confirmOverwrite = window.confirm(
          '이미 같은 날짜 범위의 메모가 존재합니다. 덮어쓸까요?'
        );
        if (!confirmOverwrite) return;

        updated = [...savedMemos];
        updated[existingIndex] = newMemo;
      } else {
        // 새 항목 추가
        updated = [...savedMemos, newMemo];
      }
    }

    // 상태 및 로컬스토리지 동기화
    setSavedMemos(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    // 입력 초기화
    resetForm();
  };

  // 🗑️ 메모 삭제 처리
  const handleDeleteMemo = (index) => {
    const updated = [...savedMemos];
    updated.splice(index, 1); // 해당 인덱스 삭제
    setSavedMemos(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    resetForm(); // 혹시 수정 중이었을 경우 초기화
  };

  // ✏️ 저장된 메모 클릭 시 수정 가능하게 세팅
  const handleSelectMemo = (memoObj, index) => {
    setStartDate(memoObj.startDate);
    setEndDate(memoObj.endDate);
    setMemo(memoObj.content);
    setEditingIndex(index); // 수정 중 표시
  };

  return (
    <div className="calendar-box" role="dialog" aria-modal="true" aria-label="캘린더 메모 팝업">
      {/* 📆 날짜 입력 필드 */}
      <div className="date-range-picker">
        <label>
          시작일:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ color: getDayColor(startDate) }}
            aria-label="시작일 선택"
          />
        </label>

        <label>
          종료일:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ color: getDayColor(endDate) }}
            aria-label="종료일 선택"
          />
        </label>
      </div>

      {/* 📝 메모 입력 필드 */}
      {startDate && endDate && (
        <div className="memo-box">
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="메모를 입력하세요"
            aria-label="메모 입력"
          />
          <div className="memo-buttons">
            <button onClick={handleSaveMemo}>
              {editingIndex !== null ? '✏ 수정' : '💾 저장'}
            </button>
            <button onClick={resetForm}>🧹 초기화</button>
            <button onClick={onClose}>❌ 닫기</button>
          </div>
        </div>
      )}

      {/* 📋 저장된 메모 목록 */}
      {savedMemos.length > 0 && (
        <div className="saved-memos-list">
          <h4>저장된 목록</h4>
          <ul>
            {savedMemos.map((memoObj, index) => (
              <li
                key={`${memoObj.startDate}-${memoObj.endDate}`}
                onClick={() => handleSelectMemo(memoObj, index)}
                tabIndex="0"
              >
                {/* 날짜 범위 표시 */}
                <div className="memo-date">
                  <span style={{ color: getDayColor(memoObj.startDate) }}>{memoObj.startDate}</span>
                  {' ~ '}
                  <span style={{ color: getDayColor(memoObj.endDate) }}>{memoObj.endDate}</span>
                </div>

                {/* 메모 내용 표시 */}
                <div className="memo-preview">{memoObj.content}</div>

                {/* 삭제 버튼 */}
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // 메모 선택 이벤트 막기
                    handleDeleteMemo(index);
                  }}
                  aria-label="메모 삭제"
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
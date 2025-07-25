// 기존 Sidebar 에서 검색탭과 함께 관리하던 지도 검색관련 주소->좌표 변환하는 지오코딩 로직을 별도로 분리했습니다.
// Sidebar에 추가됐던 주소검색 로직은 이 js 컴포넌트로 모두 몲김(완료)
// 기존에 seo 브랜치에서 작업했던 내역만 남겨놨습니다.

// 기존 네이버 맵 API에서 한 키로 관리하던 기능들을 cors 오류 때문에 각각 새로 키 값을 발급받아 사용하는 방식으로 변경 됐습니다. 
// -> 기존에 작성된 코드에서 새 키값으로 바꾸는 부분만 수정되었습니다.
// -> 컴포넌트를 분리해 새로 작업 한 것으로 보일 수 있으나 크게 변경된 부분은 없습니다.

// lse 브랜치 기존작업: SideBar의 검색 탭 아래에 검색결과 5개 출력, 검색결과 선택시 해당 좌표로 맵 이동, 검색결과 5개 맵에 마커표시, 새 검색시 이전 검색의 마커 삭제(null)
// 작업내역 기록을 위해 주석은 정리하지 마세요.

import React, { useState } from 'react';
import { naverLocalSearch, naverGeocode } from '../utils/naverApi';

export default function LocationSearch({ onResults, onError, setSelectedPlace }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const q = input.trim();
    if (!q) {
      onError('검색어를 입력하세요');
      return;
    }

    onError('');        // 에러 리셋
    setLoading(true);

    try {
      const localResults = await naverLocalSearch(q);
      let places = [];

      if (!localResults || localResults.length === 0) {
        // Local Search 결과 없으면 직접 geocode
        const coords = await naverGeocode(q);
        if (coords) {
          places = [{ title: q, address: q, roadAddress: q, ...coords }];
        }
      } else {
        // Local Search 결과 있을 때
        const list = await Promise.all(
          localResults.map(async item => {
            const coords = await naverGeocode(item.roadAddress || item.address);
            return coords ? { ...item, ...coords } : null;
          })
        );
        places = list.filter(p => p && p.lat && p.lng);
      }

      onResults(places.slice(0,5));
      setSelectedPlace(null);
    } catch (e) {
      console.error(e);
      onError('검색된 지역이 없습니다.');
      onResults([]);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className="location-search">
      <input
        type="text"
        placeholder="도시나 지역 이름을 입력하세요"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key==='Enter' && handleSearch()}
        disabled={loading}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? '검색 중...' : '🔍 검색'}
      </button>
    </div>
  );
}

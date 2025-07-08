import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// 🔑 VWorld API 키
const VWORLD_KEY = '2C432B0A-177E-319F-B4CD-ABBCEC8A9C9D';

// 🌍 지도 타일 URL (기본 지도 / 위성 지도)
const TILE_URLS = {
  base: `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Base/{z}/{y}/{x}.png`,
  satellite: `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Satellite/{z}/{y}/{x}.jpeg`,
};

// ℹ️ 저작권 표시 텍스트
const ATTRIBUTION = '© VWorld';

// 📍 대한민국 지도 바운드 (지도 이동 제한 영역)
const KOREA_BOUNDS = [
  [33.0, 124.0], // 남서쪽
  [39.5, 132.0], // 북동쪽
];

// 📌 MainMap 컴포넌트
const MainMap = ({ mapStyle = 'base', darkMode = false, searchQuery }) => {
  const [markerPosition, setMarkerPosition] = useState(null);    // 마커 좌표 상태
  const [mapInstance, setMapInstance] = useState(null);          // Leaflet 지도 인스턴스

  // 🌙 다크모드 적용: body 배경 및 텍스트 색상 조정
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#222' : '#fff';
    document.body.style.color = darkMode ? '#fff' : '#000';
  }, [darkMode]);

  // 🔍 검색어(searchQuery)가 변경될 때 주소 검색 및 지도 이동 수행
  useEffect(() => {
    if (!searchQuery) return;

    const fetchCoords = async () => {
      try {
        // 📡 프록시를 통해 VWorld 주소 검색 API 호출
        const res = await fetch(
          `/req/search?service=search&request=search&version=2.0&crs=EPSG:4326&size=1&page=1&query=${encodeURIComponent(
            searchQuery
          )}&type=address&format=json&errorformat=json&key=${VWORLD_KEY}`
        );

        // 🔐 응답 타입 확인: JSON이 아니면 오류 처리
        const contentType = res.headers.get('Content-Type');
        if (!res.ok || !contentType?.includes('application/json')) {
          throw new Error(
            `Unexpected response: ${res.status} | Content-Type: ${contentType}`
          );
        }

        // 📦 JSON 응답 파싱
        const data = await res.json();
        console.log('📦 VWorld 응답:', data);

        // 📌 첫 번째 검색 결과 항목 가져오기
        const item = data?.response?.result?.items?.[0];

        if (item) {
          // 🧭 위도/경도 추출 및 마커 및 지도 중심 설정
          const lat = parseFloat(item.point.y);
          const lng = parseFloat(item.point.x);
          setMarkerPosition([lat, lng]);
          mapInstance?.setView([lat, lng], 13); // 줌 레벨 13으로 이동
        } else {
          alert('검색 결과가 없습니다.');
        }
      } catch (error) {
        console.error('❌ 검색 오류:', error);
        alert('검색 중 문제가 발생했습니다.');
      }
    };

    fetchCoords();
  }, [searchQuery, mapInstance]);

  // 🧱 선택된 지도 스타일에 맞는 타일 URL 반환
  const tileUrl = TILE_URLS[mapStyle] || TILE_URLS.base;

  // 🗺️ 지도 렌더링
  return (
    <MapContainer
      center={[36.5, 127.5]}              // 대한민국 중앙 좌표
      zoom={7}                            // 기본 줌 레벨
      minZoom={6}                         // 최소 줌 제한
      maxZoom={17}                        // 최대 줌 제한
      maxBounds={KOREA_BOUNDS}            // 바운드 범위 설정
      maxBoundsViscosity={1.0}            // 바운드 강제 이동 제한
      scrollWheelZoom={true}              // 마우스 휠 확대 허용
      dragging={true}                     // 드래그 허용
      zoomControl={true}                  // 확대/축소 버튼 표시
      worldCopyJump={false}               // 지도 반복 방지
      whenCreated={setMapInstance}        // map 객체 저장
      style={{ width: '100%', height: '100%' }} // 전체 화면 차지
    >
      {/* 🧱 타일 레이어 삽입 */}
      <TileLayer url={tileUrl} attribution={ATTRIBUTION} noWrap={true} />

      {/* 📍 검색된 위치에 마커 표시 */}
      {markerPosition && <Marker position={markerPosition} />}
    </MapContainer>
  );
};

export default MainMap;

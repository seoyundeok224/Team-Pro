// src/components/Map/NaverMap.jsx
import React, { useEffect, useRef } from 'react';

const NAVER_MAP_CLIENT_ID = '5elloxux3c';

function NaverMap({ markerPosition, setMarkerPosition }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_MAP_CLIENT_ID}`;
    script.async = true;
    script.onload = () => {
      const naver = window.naver;
      if (!naver) return;

      // 기본 중심 좌표: 대한민국 중심
      let centerLat = 36.5;
      let centerLng = 127.5;

      // 현재 위치 정보 가져오기
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            centerLat = position.coords.latitude;
            centerLng = position.coords.longitude;

            const map = new naver.maps.Map(mapRef.current, {
              center: new naver.maps.LatLng(centerLat, centerLng),
              zoom: 13,
              minZoom: 6,
              zoomControl: true,
              zoomControlOptions: {
                position: naver.maps.Position.TOP_RIGHT,
              },
            });

            // 현재 위치 마커 표시
            new naver.maps.Marker({
              position: new naver.maps.LatLng(centerLat, centerLng),
              map: map,
            });

            // 클릭 시 마커 업데이트
            naver.maps.Event.addListener(map, 'click', (e) => {
              const latlng = e.coord;
              setMarkerPosition([latlng.y, latlng.x]);

              new naver.maps.Marker({
                position: latlng,
                map: map,
              });
            });
          },
          (error) => {
            console.error('위치 정보를 가져올 수 없습니다:', error);
            createDefaultMap(); // 위치 접근 거부 시 기본 지도
          }
        );
      } else {
        createDefaultMap(); // geolocation 지원 안 함
      }

      function createDefaultMap() {
        const map = new naver.maps.Map(mapRef.current, {
          center: new naver.maps.LatLng(centerLat, centerLng),
          zoom: 7,
        });
      }
    };

    document.head.appendChild(script);
  }, [setMarkerPosition]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}

export default NaverMap;

// src/components/Map/NaverMap.jsx
import React, { useEffect, useRef } from 'react';

const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_ID;

function NaverMap({ markerPosition, setMarkerPosition }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_CLIENT_ID}`;
    script.async = true;

    script.onload = () => {
      const naver = window.naver;
      if (!naver) return;

      // 기본 중심 좌표
      const defaultCenter = new naver.maps.LatLng(36.5, 127.5);

      const createMap = (center) => {
        mapInstance.current = new naver.maps.Map(mapRef.current, {
          center,
          zoom: 13,
          minZoom: 6,
          zoomControl: true,
          zoomControlOptions: {
            position: naver.maps.Position.TOP_RIGHT,
          },
        });

        // 지도 클릭 시 마커 위치 업데이트
        naver.maps.Event.addListener(mapInstance.current, 'click', (e) => {
          const latlng = e.coord;
          setMarkerPosition([latlng.y, latlng.x]);
        });
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userCenter = new naver.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
            createMap(userCenter);
          },
          (err) => {
            console.warn('📛 위치 접근 실패:', err);
            createMap(defaultCenter);
          }
        );
      } else {
        createMap(defaultCenter);
      }
    };

    document.head.appendChild(script);
  }, [setMarkerPosition]);

  useEffect(() => {
    if (!window.naver || !markerPosition || !mapInstance.current) return;

    const naver = window.naver;
    const position = new naver.maps.LatLng(markerPosition[0], markerPosition[1]);

    new naver.maps.Marker({
      position,
      map: mapInstance.current,
    });

    mapInstance.current.setCenter(position);
  }, [markerPosition]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}

export default NaverMap;

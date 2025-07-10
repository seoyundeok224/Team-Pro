import React, { useEffect, useRef } from 'react';
import './NaverMap.css'; 

const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_ID;

const ATTRIBUTION = '© Naver';

function NaverMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_CLIENT_ID}`;
    script.async = true;

    console.log("✅ 네이버 클라이언트 ID:", process.env.REACT_APP_NAVER_ID);
    if (!NAVER_CLIENT_ID) {
      console.error("❌ NAVER_CLIENT_ID가 정의되지 않았습니다!");
      return;
    }

    script.onload = () => {
      const naver = window.naver;
      if (!naver) return;

      // 사용자 위치 중심 or 기본 좌표
      const defaultCenter = new naver.maps.LatLng(36.5, 127.5);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = new naver.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          createMap(userLocation);
        },
        () => {
          createMap(defaultCenter);
        }
      );

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
      };
    };

    document.head.appendChild(script);
  }, [markerPosition]);
  return (
    <div ref={mapRef} className="map-container"></div>
  );
}

export default NaverMap;

import React, { useEffect, useRef, useState } from 'react';

const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_ID;

function NaverMap({ searchQuery }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // 스크립트 로드 후 mapOptions를 안전하게 사용
  const loadNaverScript = () => {
    return new Promise((resolve, reject) => {
      if (window.naver && window.naver.maps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_CLIENT_ID}&submodules=geocoder`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.naver && window.naver.maps) {
          resolve();
        } else {
          reject(new Error('네이버 지도 API 로딩 실패'));
        }
      };
      script.onerror = reject;

      document.head.appendChild(script);
    });
  };

  // 최초 지도 로딩
  useEffect(() => {
    loadNaverScript().then(() => {
      const mapOptions = {
            center: new window.naver.maps.LatLng(37.5665, 126.978),
            zoom: 14,
            zoomControl: true,
            mapTypeControl: true,
            mapTypeId: window.naver.maps.MapTypeId.NORMAL,
            scaleControl: true,
            logoControl: true,
            padding: { top: 10, right: 10, bottom: 10, left: 10 },
            mapDataControl: false,
            zoomControlOptions: {
              position: window.naver.maps.Position.BOTTOM_LEFT,
              style: 2,
            },
          };


      if (mapRef.current) {
        mapInstance.current = new window.naver.maps.Map(mapRef.current, mapOptions);

        // 현재 위치
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            const currPos = new window.naver.maps.LatLng(
              pos.coords.latitude,
              pos.coords.longitude
            );
            mapInstance.current.setCenter(currPos);
            mapInstance.current.setZoom(13);
            new window.naver.maps.Marker({
              position: currPos,
              map: mapInstance.current,
            });
          });
        }

        setIsMapReady(true);
      }
    }).catch((err) => {
      console.error('지도 로드 실패:', err);
    });
  }, []);

  // 주소 검색 시 지도 이동 + 콘솔 출력
  useEffect(() => {
    if (!searchQuery || !isMapReady || !window.naver?.maps?.Service) return;

    window.naver.maps.Service.geocode(
      { query: searchQuery },
      (status, response) => {
        if (status !== window.naver.maps.Service.Status.OK) {
          alert('주소 검색 실패');
          return;
        }

        const result = response.v2.addresses[0];
        if (!result) {
          alert('검색 결과 없음');
          return;
        }

        const lat = parseFloat(result.y);
        const lng = parseFloat(result.x);
        const location = new window.naver.maps.LatLng(lat, lng);

        mapInstance.current.setCenter(location);
        mapInstance.current.setZoom(14);

        // 마커 초기화 및 다시 그리기
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }
        markerRef.current = new window.naver.maps.Marker({
          position: location,
          map: mapInstance.current,
        });

        // 콘솔 출력
        console.log('🔎 도로명:', result.roadAddress);
        console.log('지번:', result.jibunAddress);
        console.log('위도:', lat, '경도:', lng);
      }
    );
  }, [searchQuery, isMapReady]);

  return <div className="map-container" ref={mapRef} />;
}

export default NaverMap;

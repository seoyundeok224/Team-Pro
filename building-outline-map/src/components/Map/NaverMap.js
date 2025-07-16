import React, { useEffect, useRef, useState } from 'react';

const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_ID;

function NaverMap({ searchQuery }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const initMarkerRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [hasSearchedOnce, setHasSearchedOnce] = useState(false); // ✅ 검색 여부 플래그

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

  // 지도 로드 및 초기 마커 표시
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

        // ⛔ 검색된 적이 없을 때만 초기 마커 생성
        if (navigator.geolocation && !hasSearchedOnce) {
          navigator.geolocation.getCurrentPosition((pos) => {
            const currPos = new window.naver.maps.LatLng(
              pos.coords.latitude,
              pos.coords.longitude
            );
            mapInstance.current.setCenter(currPos);
            mapInstance.current.setZoom(13);
            initMarkerRef.current = new window.naver.maps.Marker({
              position: currPos,
              map: mapInstance.current,
            });
            console.log('1. 초기 위치 마커 생성');
          });
        }

        setIsMapReady(true);
      }
    }).catch((err) => {
      console.error('지도 로드 실패:', err);
    });
  }, [hasSearchedOnce]);

  // 주소 검색 시 지도 이동
  useEffect(() => {
    if (!searchQuery || !isMapReady || !window.naver?.maps?.Service) return;

    // 검색 시도 기록
    setHasSearchedOnce(true);

    window.naver.maps.Service.geocode(
      { query: searchQuery },
      (status, response) => {
        if (status !== window.naver.maps.Service.Status.OK) {
          alert('주소 검색 실패');
          return;
        }

        // 주소를 반환하여 지도에 표시 할 마커가 있는 경우 alert X.
        if (!response?.v2?.addresses || 
          response.v2.addresses.length === 0 || 
          !response.v2.addresses[0]) {
          alert('검색 결과 없음');
          return;
        }

        const result = response.v2.addresses[0];
        
        // 원본 코드: 검색 결과가 있음에도 alert가 발생
        // const result = response.v2.addresses[0];
        // if (!result) {
        //   alert('검색 결과 없음');
        //   return;
        // }
        
        const lat = parseFloat(result.y);
        const lng = parseFloat(result.x);
        const location = new window.naver.maps.LatLng(lat, lng);

        mapInstance.current.setCenter(location);
        mapInstance.current.setZoom(14);

        // 초기 마커 제거 (첫 검색 시점)
        if (initMarkerRef.current) {
          initMarkerRef.current.setMap(null);
          initMarkerRef.current = null;
          console.log('2. 초기 위치 마커 제거');
        }

        // 기존 검색 마커 제거
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        markerRef.current = new window.naver.maps.Marker({
          position: location,
          map: mapInstance.current,
        });

        console.log('3. 검색 마커 생성:', result.roadAddress || result.jibunAddress);
      }
    );
  }, [searchQuery, isMapReady]);

  return <div className="map-container" ref={mapRef} />;
}

export default NaverMap;

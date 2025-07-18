import React, { useEffect, useRef, useState } from 'react';

const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_ID;

function NaverMap({ searchResults = [], selectedPlace = null }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  // const markerRef = useRef(null); 이제 단일마커 필요 없음
  const initMarkerRef = useRef(null);
  // 검색결과 5개의 장소를 표시 할 복수마커
  const resultMarkersRef = useRef([]);

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

    // 검색이 한 번이라도 실행되면 초기 마커 제거
  useEffect(() => {
    if (hasSearchedOnce && initMarkerRef.current) {
      initMarkerRef.current.setMap(null);
      initMarkerRef.current = null;
      console.log('2. 초기 위치 마커 제거');
    }
  }, [hasSearchedOnce]);

  // 검색 결과 마커 복수로 표시
  useEffect(() => {
    if (!isMapReady || !window.naver || !mapInstance.current) return;

    // 기존 검색 마커 제거
    resultMarkersRef.current.forEach(marker => marker.setMap(null));
    resultMarkersRef.current = [];

    // 검색결과(복수) 마커 표시
    if (searchResults && searchResults.length > 0) {
      searchResults.forEach(place => {
        if (place.lat !== undefined && place.lng !== undefined) {
          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(place.lat, place.lng),
            map: mapInstance.current,
          });
          resultMarkersRef.current.push(marker);
        }
      });
      // 첫 번째 결과로 지도 중심 이동
      const first = searchResults[0];
      if (first && first.lat && first.lng) {
        mapInstance.current.setCenter(new window.naver.maps.LatLng(first.lat, first.lng));
        mapInstance.current.setZoom(14);
      }
    }
  }, [searchResults, isMapReady]);

   // 선택된 장소로 지도 확대/이동
  useEffect(() => {
    if (!isMapReady || !selectedPlace || !selectedPlace.lat || !selectedPlace.lng) return;
    mapInstance.current.setCenter(
      new window.naver.maps.LatLng(selectedPlace.lat, selectedPlace.lng)
    );
    mapInstance.current.setZoom(16);
  }, [selectedPlace, isMapReady]);

  // 검색이 한 번이라도 실행된 경우 기록
  useEffect(() => {
    if (searchResults && searchResults.length > 0 && !hasSearchedOnce) {
      setHasSearchedOnce(true);
    }
  }, [searchResults, hasSearchedOnce]);

  return <div className="map-container" ref={mapRef} />;
}

export default NaverMap;

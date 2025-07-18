import React, { useEffect, useRef, useState } from 'react';

const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_ID;

function NaverMap({ searchResults = [], selectedPlace = null, searchQuery = '' }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);  // ✅ Kakao 주소 검색용 단일 마커
  const initMarkerRef = useRef(null);  // ✅ 초기 위치 마커
  const resultMarkersRef = useRef([]); // ✅ 복수 마커

  const [isMapReady, setIsMapReady] = useState(false);
  const [hasSearchedOnce, setHasSearchedOnce] = useState(false);

  // 네이버 지도 스크립트 로드
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

  // 지도 초기화
  useEffect(() => {
    loadNaverScript()
      .then(() => {
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

          if (navigator.geolocation && !hasSearchedOnce) {
            navigator.geolocation.getCurrentPosition((pos) => {
              const currPos = new window.naver.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
              mapInstance.current.setCenter(currPos);
              mapInstance.current.setZoom(13);
              initMarkerRef.current = new window.naver.maps.Marker({
                position: currPos,
                map: mapInstance.current,
              });
            });
          }

          setIsMapReady(true);
        }
      })
      .catch((err) => {
        console.error('지도 로드 실패:', err);
      });
  }, [hasSearchedOnce]);

  //--------------------------카카오 주소 검색 기능-------------------------
  useEffect(() => {
    if (!searchQuery || !isMapReady) return;

    setHasSearchedOnce(true);

    let refinedAddress = searchQuery
      .trim()
      .replace("서울시", "서울")
      .replace("경기도", "경기")
      .replace("부산시", "부산")
      .replace(/\s+/g, " ");

    console.log("정제된 주소:", refinedAddress);

    fetch(`http://localhost:4000/kakao/address?query=${encodeURIComponent(refinedAddress)}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Kakao 응답:", data);

        if (!data.documents || data.documents.length === 0) {
          alert("주소 검색 실패: 해당 주소를 찾을 수 없습니다.");
          return;
        }

        const { x, y } = data.documents[0]; // x: 경도, y: 위도
        const location = new window.naver.maps.LatLng(y, x);

        mapInstance.current.setCenter(location);
        mapInstance.current.setZoom(16);

        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        markerRef.current = new window.naver.maps.Marker({
          position: location,
          map: mapInstance.current,
        });
      })
      .catch((err) => {
        console.error("Kakao 주소 검색 오류:", err);
        alert("주소 검색 중 오류 발생");
      });
  }, [searchQuery, isMapReady]);

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

    resultMarkersRef.current.forEach(marker => marker.setMap(null));
    resultMarkersRef.current = [];

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

      const first = searchResults[0];
      if (first && first.lat && first.lng) {
        mapInstance.current.setCenter(new window.naver.maps.LatLng(first.lat, first.lng));
        mapInstance.current.setZoom(14);
      }
    }
  }, [searchResults, isMapReady]);

  // 선택된 장소로 지도 이동
  useEffect(() => {
    if (!isMapReady || !selectedPlace || !selectedPlace.lat || !selectedPlace.lng) return;
    mapInstance.current.setCenter(
      new window.naver.maps.LatLng(selectedPlace.lat, selectedPlace.lng)
    );
    mapInstance.current.setZoom(16);
  }, [selectedPlace, isMapReady]);

  // 검색되었는지 체크
  useEffect(() => {
    if (searchResults && searchResults.length > 0 && !hasSearchedOnce) {
      setHasSearchedOnce(true);
    }
  }, [searchResults, hasSearchedOnce]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}

export default NaverMap;

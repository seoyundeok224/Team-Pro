import React, { useEffect, useRef } from 'react';

const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_MAP_KEY;

function NaverMap({ searchQuery }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const geocoderRef = useRef(null);

  useEffect(() => {
    const scriptId = 'naver-map-script';

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_CLIENT_ID}&submodules=geocoder`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    function initializeMap() {
  if (!window.naver || !mapRef.current) return;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const userLocation = new window.naver.maps.LatLng(latitude, longitude);

      const mapOptions = {
        center: userLocation,
        zoom: 14,
        zoomControl: true,
        mapTypeControl: true,
        mapTypeId: window.naver.maps.MapTypeId.NORMAL,
        scaleControl: true,
        logoControl: true,
        mapDataControl: false,
        zoomControlOptions: {
          position: window.naver.maps.Position.BOTTOM_LEFT,
          style: 2,
        },
      };

      const map = new window.naver.maps.Map(mapRef.current, mapOptions);
      mapInstance.current = map;

      new window.naver.maps.Marker({
        position: userLocation,
        map,
        title: '현재 위치',
      });

      // ✅ Geocoder 모듈 준비 확인 후 초기화
      const tryInitGeocoder = () => {
        if (
          window.naver &&
          window.naver.maps &&
          window.naver.maps.services &&
          typeof window.naver.maps.services.Geocoder === 'function'
        ) {
          geocoderRef.current = new window.naver.maps.services.Geocoder();

          // 첫 검색어가 이미 있다면 실행
          if (searchQuery) {
            handleGeocode(searchQuery);
          }
        } else {
          console.warn('Geocoder 아직 준비되지 않음. 재시도 예정...');
          setTimeout(tryInitGeocoder, 300); // 300ms 후 재시도
        }
      };

      tryInitGeocoder();
    },
    (error) => {
      console.error('위치 정보 가져오기 실패:', error);
    }
  );
}


  useEffect(() => {
    if (!searchQuery || !geocoderRef.current || !mapInstance.current) return;
    handleGeocode(searchQuery);
  }, [searchQuery]);

  function handleGeocode(query) {
    geocoderRef.current.addressSearch(query, (result, status) => {
      if (status === window.naver.maps.services.Status.OK && result[0]) {
        const { y, x } = result[0];
        const newLatLng = new window.naver.maps.LatLng(y, x);
        mapInstance.current.setCenter(newLatLng);

        new window.naver.maps.Marker({
          position: newLatLng,
          map: mapInstance.current,
          title: query,
        });
      } else {
        alert('해당 지역을 찾을 수 없습니다.');
        console.error('주소 검색 실패:', status, result);
      }
    });
  }

  return <div className="map-container" ref={mapRef} />;
}

export default NaverMap;

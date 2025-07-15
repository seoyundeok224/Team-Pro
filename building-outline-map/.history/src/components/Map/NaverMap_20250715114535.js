// ✅ 이 줄 반드시 필요!
import React, { useEffect, useRef } from 'react'; 

const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_ID;

function NaverMap({ searchQuery }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

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
            padding: { top: 10, right: 10, bottom: 10, left: 10 },
            mapDataControl: false,
            zoomControlOptions: {
              position: window.naver.maps.Position.BOTTOM_LEFT,
              style: 2,
            },
          };

          mapInstance.current = new window.naver.maps.Map(mapRef.current, mapOptions);

          new window.naver.maps.Marker({
            position: userLocation,
            map: mapInstance.current,
            title: '현재 위치',
          });
        },
        (error) => {
          console.error('위치 정보 가져오기 실패:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!searchQuery) return;

    const tryGeocode = () => {
      if (
        !window.naver ||
        !window.naver.maps ||
        !window.naver.maps.services ||
        typeof window.naver.maps.services.Geocoder !== 'function' ||
        !mapInstance.current
      ) {
        console.warn('Geocoder 또는 Map이 아직 준비되지 않음. 재시도 예정...');
        setTimeout(tryGeocode, 300);
        return;
      }

      const geocoder = new window.naver.maps.services.Geocoder();
      geocoder.addressSearch(searchQuery, (result, status) => {
        console.log('지오코딩 결과:', result);

        if (status === window.naver.maps.services.Status.OK && result[0]) {
          const { y, x } = result[0];
          const newLatLng = new window.naver.maps.LatLng(y, x);
          mapInstance.current.setCenter(newLatLng);

          new window.naver.maps.Marker({
            position: newLatLng,
            map: mapInstance.current,
            title: searchQuery,
          });
        } else {
          console.error('주소 검색 실패 또는 결과 없음:', status, result);
        }
      });
    };

    tryGeocode();
  }, [searchQuery]);

  return <div className="map-container" ref={mapRef} />;
}

// ✅ export 빠지면 App.js에서 인식 못 함
export default NaverMap;

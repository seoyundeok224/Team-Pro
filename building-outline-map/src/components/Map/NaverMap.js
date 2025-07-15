import React, { useEffect, useRef } from 'react';
import { useCallback } from 'react';
import { useEffect, useRef } from 'react';

const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_ID;

function NaverMap({ searchQuery }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    const scriptId = 'naver-map-script';

    if (document.getElementById(scriptId)) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_CLIENT_ID}`;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_CLIENT_ID}_ID&submodules=geocoder`
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;

    document.head.appendChild(script);

    function initializeMap() {
      if (!window.naver || !mapRef.current) return;

      const mapOptions = {
        center: new window.naver.maps.LatLng(37.5665, 126.9780), // 서울시청
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
    }
     if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_CLIENT_ID}`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, []);

  // 🧠 주소 검색 시 지도 이동
  useEffect(() => {
    if (!searchQuery || !window.naver || !mapInstance.current) return;

    const geocoder = new window.naver.maps.services.Geocoder();
    geocoder.addressSearch(searchQuery, function (result, status) {
      if (status === window.naver.maps.services.Status.OK) {
        const { y, x } = result[0];
        const newLatLng = new window.naver.maps.LatLng(y, x);
        mapInstance.current.setCenter(newLatLng);

        // 🎯 마커 추가 (선택)
        new window.naver.maps.Marker({
          position: newLatLng,
          map: mapInstance.current,
        });
      } else {
        console.error('주소 검색 실패:', status);
      }
    });
  }, [searchQuery]);



  return <div className="map-container" ref={mapRef} />;
}

export default NaverMap;

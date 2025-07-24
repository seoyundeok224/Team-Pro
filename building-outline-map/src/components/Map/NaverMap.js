import React, { useEffect, useRef, useState } from 'react';

const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_ID;

function NaverMap({ searchQuery, selectedPlace }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const initMarkerRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [hasSearchedOnce, setHasSearchedOnce] = useState(false);

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

  useEffect(() => {
    if (!selectedPlace || !isMapReady) return;
    const { x, y } = selectedPlace;
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
  }, [selectedPlace, isMapReady]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}

export default NaverMap;
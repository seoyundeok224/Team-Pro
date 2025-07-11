import React, { useEffect, useRef } from 'react';

const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_ID;

function NaverMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    const scriptId = 'naver-map-script';

    if (document.getElementById(scriptId)) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_CLIENT_ID}`;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_CLIENT_ID}&submodules=geocoder`;
    script.src =`http://code.jquery.com/jquery-latest.min.js`;
    script.src =`https://code.jquery.com/jquery-3.6.0.min.js`;
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

      new window.naver.maps.Map(mapRef.current, mapOptions);
    }
  }, []);

  return <div className="map-container" ref={mapRef} />;
}

export default NaverMap;

const MAP_CLIENT_ID = process.env.REACT_APP_NAVER_MAP_KEY;

function NaverMap({ searchQuery }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    const loadScript = (id, src) => {
      return new Promise((resolve) => {
        if (document.getElementById(id)) return resolve();
        const script = document.createElement('script');
        script.id = id;
        script.src = src;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        document.head.appendChild(script);
      });
    };

    Promise.all([
      loadScript('naver-map-script', `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${MAP_CLIENT_ID}`),
      loadScript('naver-geocoder-script', `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${MAP_CLIENT_ID}&submodules=geocoder`)
    ]).then(initializeMap);

    function initializeMap() {
      if (!window.naver || !mapRef.current) return;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLocation = new window.naver.maps.LatLng(latitude, longitude);
          const options = { center: userLocation, zoom: 14 };
          mapInstance.current = new window.naver.maps.Map(mapRef.current, options);

          new window.naver.maps.Marker({
            position: userLocation,
            map: mapInstance.current,
            title: '현재 위치',
          });
        },
        (error) => console.error('위치 정보 실패:', error)
      );
    }
  }, []);

  useEffect(() => {
    if (!searchQuery) return;

    const tryGeocode = () => {
      if (
        !window.naver ||
        !window.naver.maps.services ||
        typeof window.naver.maps.services.Geocoder !== 'function' ||
        !mapInstance.current
      ) {
        console.warn('Geocoder 또는 Map 준비 안됨. 재시도...');
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
          new window.naver.maps.Marker({ position: newLatLng, map: mapInstance.current });
        } else {
          console.error('주소 검색 실패:', status);
        }
      });
    };

    tryGeocode();
  }, [searchQuery]);

  return <div className="map-container" ref={mapRef} />;
}

// src/hooks/useGeolocation.js
import { useState, useEffect } from 'react';

const useGeolocation = () => {
  const [currentMyLocation, setCurrentMyLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const getCurPosition = () => {
    setLocationLoading(true);

    const success = (position) => {
      setCurrentMyLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setLocationLoading(false);
    };

    const error = () => {
      console.warn('위치 권한 거부 또는 오류 발생 – 서울 시청으로 fallback');
      setCurrentMyLocation({
        lat: 37.5666103,
        lng: 126.9783882,
      });
      setLocationLoading(false);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      error();
    }
  };

  useEffect(() => {
    getCurPosition();
  }, []);

  return { currentMyLocation, locationLoading, getCurPosition };
};

export default useGeolocation;

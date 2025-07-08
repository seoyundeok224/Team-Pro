// src/components/ScaleControl/ScaleControl.js
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

function ScaleControl() {
  const map = useMap();

  useEffect(() => {
    const scale = L.control.scale({ metric: true, imperial: false });
    scale.addTo(map);

    return () => {
      scale.remove(); // 언마운트 시 제거
    };
  }, [map]);

  return null;
}

export default ScaleControl;

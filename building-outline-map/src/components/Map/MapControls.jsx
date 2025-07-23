// src/components/Map/MapControls.jsx
import React from 'react';
import './MapControls.css';

function MapControls({ map }) {
  const zoomIn = () => map.setZoom(map.getZoom() + 1);
  const zoomOut = () => map.setZoom(map.getZoom() - 1);
  const moveToCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = new window.naver.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        map.setCenter(loc);
      },
      () => {
        alert('위치 정보를 가져올 수 없습니다.');
      }
    );
  };

  return (
    <div className="map-controls">
      <button className="control-btn location" onClick={moveToCurrentLocation} />
      <button className="control-btn zoom-in" onClick={zoomIn} />
      <button className="control-btn zoom-out" onClick={zoomOut} />
    </div>
  );
}

export default MapControls;

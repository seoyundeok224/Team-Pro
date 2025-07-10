import { useState } from 'react';

/** 사용자의 현재 위치를 가져옵니다  */
const useLocation = () => {
    const [location, setLocation] = useState(null);
  
    const setCurrentLocation = () => {

        // 위치 서비스 제공 x => 서울시청역으로 위치 설정
        if (!navigator.geolocation) {
            setLocation({latitude: 37.5665, longitude: 126.9780});
            return;
        };

        // 현재 위치를 가져옵니다
         navigator.geolocation.getCurrentPosition(
            // 성공 시 사용자 위치로 설정
            (position) => {
            setLocation({ longitude: position.coords.longitude, latitude: position.coords.latitude });
            }, 
            setLocation({latitude: 37.5665, longitude: 126.9780}) // error handling: 서울시청역으로 위치 설정
        );
    }


    return { location, setCurrentLocation }
}

export default useLocation;
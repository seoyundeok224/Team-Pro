// naverGeocode.js
// 네이버 주소 → 위경도 + 지번/도로명 주소 변환 함수

/**
 * @param {string} address - 검색할 주소 (도로명 or 지번)
 * @returns {Promise<{ roadAddress: string, jibunAddress: string, location: { lat: number, lng: number } }>}
 */
export function convertToJibun(address) {
  return new Promise((resolve, reject) => {
    if (!window.naver || !window.naver.maps || !window.naver.maps.Service) {
      reject(new Error('Naver Maps API가 로드되지 않았습니다.'));
      return;
    }

    window.naver.maps.Service.geocode(
      { query: address },
      (status, response) => {
        if (status !== window.naver.maps.Service.Status.OK) {
          reject(new Error('주소 검색 실패'));
          return;
        }

        const result = response.v2.addresses[0];
        if (!result) {
          reject(new Error('검색 결과 없음'));
          return;
        }

        resolve({
          roadAddress: result.roadAddress,     // 도로명 주소
          jibunAddress: result.jibunAddress,   // 지번 주소
          location: {
            lat: parseFloat(result.y),         // 위도
            lng: parseFloat(result.x),         // 경도
          },
        });
      }
    );
  });
}

/**
 * 네이버 지도 스크립트를 동적으로 로드하는 함수
 * (이미 로드되어 있다면 재로딩하지 않음)
 */
export function loadNaverMapScript(clientId) {
  return new Promise((resolve, reject) => {
    if (window.naver && window.naver.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&submodules=geocoder`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.naver && window.naver.maps) {
        resolve();
      } else {
        reject(new Error('Naver Maps API 로딩 실패'));
      }
    };

    script.onerror = () => reject(new Error('Naver Maps 스크립트 로딩 오류'));
    document.head.appendChild(script);
  });
}

// 1. 지역검색 (네이버 Local API) - (프록시 필요)
export async function naverLocalSearch(query) {
    const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_SEARCH_CLIENT_ID;
    const NAVER_CLIENT_SECRET = process.env.REACT_APP_NAVER_SEARCH_CLIENT_SECRET;
    // 개발용 프록시 적용(서비스 배포 불가, test 환경에서만 사용가능)
    // https://cors-anywhere.herokuapp.com/corsdemo 링크에서 버튼 1번 클릭 후 npm start로 앱 실행
    const url = `https://cors-anywhere.herokuapp.com/https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=5`;

    const res = await fetch(url, {
        headers: {
            'X-Naver-Client-Id': NAVER_CLIENT_ID,
            'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
        },
    });

    if (!res.ok) {
        throw new Error(`네이버 검색 API 요청 실패: ${res.status}`);
    }

    const data = await res.json();
    return data.items.map(item => ({
        title: item.title.replace(/<[^>]*>?/g, ''), // HTML 태그 제거
        address: item.address,
        roadAddress: item.roadAddress,
        link: item.link,
        category: item.category,
    }));
}

// 2. 주소 → 좌표 변환 (Geocode)
export async function naverGeocode(address) {
    const NAVER_ID = process.env.REACT_APP_NAVER_ID;
    const NAVER_ID_SECRET = process.env.REACT_APP_NAVER_ID_SECRET;
    // 프록시를 거쳐 실제 geocode API를 호출해야 함!
    const url = `https://cors-anywhere.herokuapp.com/https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(address)}`;

    const res = await fetch(url, {
        headers: {
            "X-NCP-APIGW-API-KEY-ID": NAVER_ID,
            "X-NCP-APIGW-API-KEY": NAVER_ID_SECRET,
        },
    });

    if (!res.ok) {
        const err = await res.json();
        console.error('Geocode API 에러:', err);
        return null;
    }

    const data = await res.json();
    if (data.addresses && data.addresses.length > 0) {
        return {
            lat: parseFloat(data.addresses[0].y),
            lng: parseFloat(data.addresses[0].x),
        };
    }
    return null;
}

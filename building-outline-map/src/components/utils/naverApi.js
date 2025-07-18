// 1. 지역검색 (네이버 Local API) - (프록시 O)
export async function naverLocalSearch(query) {
    const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_SEARCH_CLIENT_ID;
    const NAVER_CLIENT_SECRET = process.env.REACT_APP_NAVER_SEARCH_CLIENT_SECRET;

    const url = `/v1/search/local.json?query=${encodeURIComponent(query)}&display=5`;

    console.log('[🔍 LocalSearch 요청 URL]:', url);
    console.log('[🧾 LocalSearch 헤더]:', {
        headers: {
            'X-Naver-Client-Id': NAVER_CLIENT_ID,
            'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
        },
    });

    //
    try {
        const res = await fetch(url, {
            headers: {
                'X-Naver-Client-Id': NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
            },
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error('네이버 검색 API 요청 실패:', res.status, errText);
            return null;
        }

        //
        const data = await res.json();
        console.log('[검색 결과]', data);
        return data.items.map(item => ({
            title: item.title.replace(/<[^>]*>?/g, ''), // HTML 태그 제거
            address: item.address,
            roadAddress: item.roadAddress,
            link: item.link,
            category: item.category,
        }));
    } catch (err) {
        console.error('fetch 요청 중 예외 발생:', err);
        return null;
    }
}

// 2. 주소 → 좌표 변환 (Geocode)
export async function naverGeocode(address) {
    const url = `/map-geocode?query=${encodeURIComponent(address)}`;

    console.log('지오코딩 URL:', url);
    console.log('요청 헤더:', {
        'X-Ncp-Apigw-Api-Key-Id': process.env.REACT_APP_NAVER_ID,
        'X-Ncp-Apigw-Api-Key': process.env.REACT_APP_NAVER_ID_SECRET,
    });

    const res = await fetch(url, {
        headers: {
            'X-Ncp-Apigw-Api-Key-Id': process.env.REACT_APP_NAVER_ID,
            'X-Ncp-Apigw-Api-Key': process.env.REACT_APP_NAVER_ID_SECRET,
        },
    });
    // 로그 확인
    console.log('응답 상태:', res.status);
    const text = await res.text();
    console.log('응답 원문:', text);

    if (!res.ok) {
        const err = await res.json();
        console.error('Geocode API 에러:', err);
        return null;
    }

    const data = await res.json();
    if (data.addresses && data.addresses.length > 0) {
        const addr = data.addresses[0];
        return {
            lat: parseFloat(addr.y),
            lng: parseFloat(addr.x),
        };
    }

    return null;
}

// 3. 리버스 지오코딩
export async function naverReverseGeocode(lat, lng) {
    const url = `/map-reversegeocode?coords=${lng},${lat}&orders=roadaddr&output=json`;

    const res = await fetch(url, {
        headers: {
            'X-Ncp-Apigw-Api-Key-Id': process.env.REACT_APP_NAVER_ID,
            'X-Ncp-Apigw-Api-Key': process.env.REACT_APP_NAVER_ID_SECRET,
        },
    });

    if (!res.ok) {
        const err = await res.json();
        console.error('Reverse Geocode API 에러:', err);
        return null;
    }

    const data = await res.json();
    if (data.results && data.results.length > 0) {
        return data.results[0].region.area1.name; // 주소 일부 예시 반환
    }

    return null;
}

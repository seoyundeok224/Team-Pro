// 1. 지역검색 (네이버 Local API) - (프록시 O)
export async function naverLocalSearch(query) {
  const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_SEARCH_CLIENT_ID;
  const NAVER_CLIENT_SECRET = process.env.REACT_APP_NAVER_SEARCH_CLIENT_SECRET;

  const url = `/v1/search/local.json?query=${encodeURIComponent(query)}&display=5`;

  console.log('[ LocalSearch 요청 URL ]:', url);

  try {
    const res = await fetch(url, {
      headers: {
        'X-Naver-Client-Id': NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('요청 실패:', res.status, errorText);
      return [];
    }

    const data = await res.json(); 

    if (!data.items || !Array.isArray(data.items)) {
      console.error('응답에서 items가 존재하지 않음:', data);
      return [];
    }

    console.log('[ 응답성공 ]', data);

    return data.items.map(item => ({
      title: item.title.replace(/<[^>]*>?/g, ''),
      address: item.address,
      roadAddress: item.roadAddress,
      link: item.link,
      category: item.category,
    }));
  } catch (err) {
    console.error('LocalSearch 요청 중 에러 발생:', err);
    return [];
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

    try {
        const res = await fetch(url, {
            headers: {
                'X-Ncp-Apigw-Api-Key-Id': process.env.REACT_APP_NAVER_ID,
                'X-Ncp-Apigw-Api-Key': process.env.REACT_APP_NAVER_ID_SECRET,
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Geocode API 오류:', res.status, errorText);
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
    } catch (err) {
        console.error('Geocode 요청 중 에러:', err);
        return null;
    }
}

// 3. 리버스 지오코딩
export async function naverReverseGeocode(lat, lng) {
    const url = `/map-reversegeocode?coords=${lng},${lat}&orders=roadaddr&output=json`;

    try {
        const res = await fetch(url, {
            headers: {
                'X-Ncp-Apigw-Api-Key-Id': process.env.REACT_APP_NAVER_ID,
                'X-Ncp-Apigw-Api-Key': process.env.REACT_APP_NAVER_ID_SECRET,
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Reverse Geocode API 오류:', res.status, errorText);
            return null;
        }

        const data = await res.json();
        if (data.results && data.results.length > 0) {
            return data.results[0].region.area1.name;
        }

        return null;
    } catch (err) {
        console.error('ReverseGeocode 요청 중 에러:', err);
        return null;
    }
}

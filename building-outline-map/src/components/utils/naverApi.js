// 1. 지역검색 (네이버 Local API) - 프록시 서버를 통한 요청 삭제 후 OpenAPI에서 엔트포인트 직접 호출
export async function naverLocalSearch(query) {
  const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_SEARCH_CLIENT_ID;
  const NAVER_CLIENT_SECRET = process.env.REACT_APP_NAVER_SEARCH_CLIENT_SECRET;
  const url = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(
    query
  )}&display=5`;

  const res = await fetch(url, {
    headers: {
      "X-Naver-Client-Id": NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Local Search 오류 ${res.status}: ${text}`);
  }

  const data = await res.json();
  console.log("[ 응답성공 ]", data);
  return Array.isArray(data.items)
    ? data.items.map((item) => ({
        title: item.title.replace(/<[^>]*>?/g, ""),
        address: item.address,
        roadAddress: item.roadAddress,
        link: item.link,
        category: item.category,
      }))
    : [];
}

// 2. 주소 → 좌표 변환 (Geocode)
export async function naverGeocode(address) {
  const ID = process.env.REACT_APP_NAVER_GEOCODING_ID;
  const SECRET = process.env.REACT_APP_NAVER_GEOCODING_ID_SECRET;

  const url = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(
    address
  )}`;


    const res = await fetch(url, {
      headers: {
        "X-Ncp-Apigw-Api-Key-Id": ID,
        "X-Ncp-Apigw-Api-Key": SECRET,
      },
    });

    if (!res.ok) {
     const text = await res.text();
    throw new Error(`Geocode 오류 ${res.status}: ${text}`);
  }

     const data = await res.json();
  if (data.addresses && data.addresses.length > 0) {
    const addr = data.addresses[0];
    return { lat: parseFloat(addr.y), lng: parseFloat(addr.x) };
  }
  return null;
}

// 3. 리버스 지오코딩
export async function naverReverseGeocode(lat, lng) {
  const RE_ID = process.env.REACT_APP_NAVER_REVERSE_GEOCODING_ID;
  const RE_SECRET = process.env.REACT_APP_NAVER_REVERSE_GEOCODING_ID_SECRET;

  const url = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${lng},${lat}&orders=roadaddr&output=json`;

    const res = await fetch(url, {
      headers: {
        "X-Ncp-Apigw-Api-Key-Id": RE_ID,
        "X-Ncp-Apigw-Api-Key": RE_SECRET,
      },
    });

    if (!res.ok) {
    const text = await res.text();
    throw new Error(`Reverse Geocode 오류 ${res.status}: ${text}`);
  }
  const data = await res.json();
  if (data.results && data.results.length > 0) {
    return data.results[0].region.area1.name;
  }
  return null;
}

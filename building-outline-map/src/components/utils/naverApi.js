// 1. 지역검색 (네이버 Local API) - 프록시 서버를 통한 요청 삭제 후 OpenAPI에서 엔트포인트 직접 호출
export async function naverLocalSearch(query) {
  const CLIENT_ID = process.env.REACT_APP_NAVER_SEARCH_CLIENT_ID;
  const CLIENT_SECRET = process.env.REACT_APP_NAVER_SEARCH_CLIENT_SECRET;

  const url = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(
    query
  )}&display=5`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-Naver-Client-Id": CLIENT_ID,
        "X-Naver-Client-Secret": CLIENT_SECRET,
      },
    });

    if (!res.ok) {
      console.error("LocalSearch 요청 실패:", res.status, await res.text());
      return [];
    }

    const data = await res.json();
    if (!Array.isArray(data.items)) {
      console.error("LocalSearch 응답 형식 오류:", data);
      return [];
    }

    console.log("[ 응답성공 ]", data);

    return data.items.map((item) => ({
      title: item.title.replace(/<[^>]*>?/g, ""),
      address: item.address,
      roadAddress: item.roadAddress,
      link: item.link,
      category: item.category,
    }));
  } catch (err) {
    console.error("LocalSearch 에러:", err);
    return [];
  }
}

// 2. 주소 → 좌표 변환 (Geocode)
export async function naverGeocode(address) {
  const CLIENT_ID = process.env.REACT_APP_NAVER_GEOCODING_ID;
  const CLIENT_SECRET = process.env.REACT_APP_NAVER_GEOCODING_ID_SECRET;

  const url = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(
    address
  )}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-Ncp-Apigw-Api-Key-Id": CLIENT_ID,
        "X-Ncp-Apigw-Api-Key": CLIENT_SECRET,
      },
    });

    if (!res.ok) {
      console.error("Geocode 요청 실패:", res.status, await res.text());
      return null;
    }

    const data = await res.json();

    if (data.addresses?.length > 0) {
      const addr = data.addresses[0];
      return {
        lat: parseFloat(addr.y),
        lng: parseFloat(addr.x),
      };
    }

    return null;
  } catch (err) {
    console.error("Geocode 요청 중 에러:", err);
    return null;
  }
}

// 3. 리버스 지오코딩
export async function naverReverseGeocode(lat, lng) {
  const CLIENT_ID = process.env.REACT_APP_NAVER_REVERSE_GEOCODING_ID;
  const CLIENT_SECRET = process.env.REACT_APP_NAVER_REVERSE_GEOCODING_ID_SECRET;

  const url = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${lng},${lat}&orders=roadaddr&output=json`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-Ncp-Apigw-Api-Key-Id": CLIENT_ID,
        "X-Ncp-Apigw-Api-Key": CLIENT_SECRET,
      },
    });

    if (!res.ok) {
      console.error("ReverseGeocode 요청 실패:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const area = data.results?.[0]?.region?.area1?.name;
    return area || null;
  } catch (err) {
    console.error("ReverseGeocode 에러:", err);
    return null;
  }
}

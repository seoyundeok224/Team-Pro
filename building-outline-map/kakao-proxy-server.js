const express = require('express');
const cors = require('cors');
require('dotenv').config();

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));  // 🔥 핵심 수정

const app = express();
app.use(cors());

const KAKAO_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;

app.get('/kakao/address', async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: '주소 없음' });

  try {
    const kakaoUrl = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}`;
    console.log("🔍 요청 주소:", kakaoUrl);
    console.log("🗝️ API 키:", KAKAO_API_KEY);

    const response = await fetch(kakaoUrl, {
      headers: {
        Authorization: `KakaoAK ${KAKAO_API_KEY}`,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ 서버 오류:", err);
    res.status(500).json({ error: '서버 내부 오류', detail: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Kakao 프록시 서버 실행 중: http://localhost:${PORT}`);
});

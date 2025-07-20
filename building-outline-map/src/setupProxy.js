// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    // 1. 네이버 Local Search API 프록시
    app.use('/v1/search', createProxyMiddleware({
        target: 'https://openapi.naver.com',
        changeOrigin: true,
        onProxyReq(proxyReq, req, res) {
            console.log('[Proxy 요청]', req.url);
            console.log('Client ID:', process.env.REACT_APP_NAVER_SEARCH_CLIENT_ID); // 출력 확인
            console.log('Client SECRET:', process.env.REACT_APP_NAVER_SEARCH_CLIENT_SECRET);

            proxyReq.setHeader('X-Naver-Client-Id', process.env.REACT_APP_NAVER_SEARCH_CLIENT_ID);
            proxyReq.setHeader('X-Naver-Client-Secret', process.env.REACT_APP_NAVER_SEARCH_CLIENT_SECRET);
        },
    })
    );

    // 2. 네이버 Geocode API 프록시
    app.use('/map-geocode', createProxyMiddleware({
        target: 'https://naveropenapi.apigw.ntruss.com',
        changeOrigin: true,
        pathRewrite: {
            '^/map-geocode': '/map-geocode/v2/geocode',
        },
    })
    );

    // 3. 네이버 Reverse Geocode API 프록시
    app.use('/map-reversegeocode', createProxyMiddleware({
        target: 'https://naveropenapi.apigw.ntruss.com',
        changeOrigin: true,
        pathRewrite: {
            '^/map-reversegeocode': '/map-reversegeocode/v2/gc',
        },
    })
    );
};

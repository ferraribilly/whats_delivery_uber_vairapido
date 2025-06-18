const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/v1',
    createProxyMiddleware({
      target: 'https://corsbypass-xxxx.onrender.com/https://ferraribback-end-clone-whatsapp.onrender.com',
      changeOrigin: true,
    })
  );
};
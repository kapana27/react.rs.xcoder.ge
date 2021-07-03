const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use('/api', proxy({
    target: 'http://192.168.30.50:7777',
    debug: true,
  }));
/*
  app.use(proxy('/api', { target: 'http://api.xcoder.ge:7777',changeOrigin: true }))
*/

};

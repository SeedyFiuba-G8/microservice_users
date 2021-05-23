const express = require('express');

module.exports = function $app(router) {
  const app = express();

  app.use(router);

  return app;
};

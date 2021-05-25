const express = require('express');

module.exports = function $app(loggingMiddleware, router) {
  const app = express();

  app.use(loggingMiddleware);
  app.use(router);

  return app;
};

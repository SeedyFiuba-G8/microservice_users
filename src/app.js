const express = require('express');

module.exports = function $app(loggingMiddleware, docsRouter, apiRouter) {
  const app = express();

  // Middleware
  app.use(loggingMiddleware);

  // Routers
  app.use(docsRouter);
  app.use(apiRouter);

  return app;
};

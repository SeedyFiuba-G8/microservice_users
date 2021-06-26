const express = require('express');

module.exports = function $app(
  loggingMiddleware,
  errorHandlerMiddleware,
  docsRouter,
  apiRouter
) {
  const app = express();

  // Pre middleware
  app.use(loggingMiddleware);
  app.use(express.json());

  // Routers
  app.use(docsRouter);
  app.use(apiRouter);

  // Post middleware
  app.use(errorHandlerMiddleware);

  return app;
};

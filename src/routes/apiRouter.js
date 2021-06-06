const express = require('express');

module.exports = function apiRouter(
  apiValidatorMiddleware,
  statusController,
  usersController
) {
  return (
    express
      .Router()
      // Redirect root to api docs
      .get('/', (req, res) => res.redirect('/api-docs'))

      // DEBUG ROUTES
      .get('/user/all', usersController.getAll)

      // OpenAPI Validation Middleware
      .use(apiValidatorMiddleware)

      // STATUS
      .get('/ping', statusController.ping)
      .get('/health', statusController.health)

      // ROUTES
      .post('/user', usersController.register)
      .post('/user/session', usersController.login)
  );
};

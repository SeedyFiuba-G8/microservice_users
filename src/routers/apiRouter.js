const express = require('express');

module.exports = function apiRouter(
  apiValidatorMiddleware,
  adminsController,
  statusController,
  usersController
) {
  return (
    express
      .Router()
      // Redirect root to api docs
      .get('/', (req, res) => res.redirect('/api-docs'))

      // SPY ROUTES (debug only)
      .get('/user', usersController.getAll)
      .get('/admin', adminsController.getAll)

      // OpenAPI Validation Middleware
      .use(apiValidatorMiddleware)

      // STATUS
      .get('/ping', statusController.ping)
      .get('/health', statusController.health)

      // ROUTES

      // Users
      .post('/user', usersController.register)
      .post('/user/session', usersController.login)

      // Admins
      .post('/admin', adminsController.register)
      .post('/admin/session', adminsController.login)
  );
};

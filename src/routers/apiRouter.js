const express = require('express');

module.exports = function apiRouter(
  apiValidatorMiddleware,
  adminController,
  statusController,
  userController
) {
  return (
    express
      .Router()
      // Redirect root to api docs
      .get('/', (req, res) => res.redirect('/api-docs'))

      // OpenAPI Validation Middleware
      .use(apiValidatorMiddleware)

      // STATUS
      .get('/ping', statusController.ping)
      .get('/health', statusController.health)

      // ROUTES

      // Users
      .get('/users', userController.getAll)
      .post('/users', userController.register)
      .post('/users/session', userController.login)
      .get('/users/:userId', userController.getProfile)

      // Admins
      .post('/admins', adminController.register)
      .post('/admins/session', adminController.login)
  );
};

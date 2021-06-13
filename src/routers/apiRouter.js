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

      // SPY ROUTES (debug only)
      .get('/user', userController.getAll)
      .get('/admin', adminController.getAll)

      // OpenAPI Validation Middleware
      .use(apiValidatorMiddleware)

      // STATUS
      .get('/ping', statusController.ping)
      .get('/health', statusController.health)

      // ROUTES

      // Users
      .post('/user', userController.register)
      .post('/user/session', userController.login)

      // Admins
      .post('/admin', adminController.register)
      .post('/admin/session', adminController.login)
  );
};

const express = require('express');

module.exports = function apiRouter(
  apiValidatorMiddleware,
  adminController,
  metricController,
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
      .get('/users/:userId', userController.get)
      .patch('/users/:userId', userController.update)
      .post('/users/:userId/ban', userController.ban)
      .delete('/users/:userId/ban', userController.unban)

      // Admins
      .post('/admins', adminController.register)
      .post('/admins/session', adminController.login)

      // Metrics
      .get('/metrics', metricController.getBasic)
      .get('/metrics/events', metricController.getEvents)

      // Translation
      .post('/idtranslation', userController.translateIds)
      .post('/emailtranslation', userController.translateEmails)
  );
};

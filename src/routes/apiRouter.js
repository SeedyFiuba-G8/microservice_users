const express = require('express');

module.exports = function apiRouter(
  apiValidatorMiddleware,
  statusController,
  usersController
) {
  return (
    express
      .Router()
      // OpenAPI Validation Middleware
      .use(apiValidatorMiddleware)

      // Redirect root to api docs
      .get('/', (req, res) => res.redirect('/api-docs'))

      // Ping and Health
      .get('/ping', statusController.ping)

      .get('/health', statusController.health)

      // ROUTES

      .get('/users', usersController.getAll)

      // MOCK ROTUES JUST FOR DEV PURPOSES

      .post('/user/login', (req, res) => {
        const { email, password } = req.body;

        const response = {
          status: 'ok',
          msg: `You required to log in with email: ${email} and password: ${password}.`
        };

        res.status(200).json(response);
      })

      .get('/users/:userId', (req, res) => {
        const { userId } = req.params;
        res.send(`You required information about userid: ${userId}\n`);
      })
  );
};

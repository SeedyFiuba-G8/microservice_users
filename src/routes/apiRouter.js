const express = require('express');

module.exports = function apiRouter(statusController, usersController) {
  return (
    express
      .Router()
      // Example routes
      .get('/', (req, res) => res.send('Root\n'))

      // Ping and Health
      .get('/ping', statusController.ping)

      .get('/health', statusController.health)

      // ROUTES

      .get('/users', usersController.getAll)

      .get('/users/:userId', (req, res) => {
        const { userId } = req.params;
        res.send(`You required information about userid: ${userId}\n`);
      })
  );
};

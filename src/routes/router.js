const express = require('express');

module.exports = function router(statusController) {
  return (
    express
      .Router()

      // Ping and Health
      .get('/ping', statusController.ping)

      .get('/health', statusController.health)

      // Example routes
      .get('/', (req, res) => res.send('Root\n'))

      .get('/users', (req, res) => {
        res.send('Users\n');
      })

      .get('/users/:userId', (req, res) => {
        const { userId } = req.params;
        res.send(`You required information about userid: ${userId}\n`);
      })
  );
};

const express = require('express');

module.exports = function $app() {
  const app = express();

  app.get('/', (req, res) => res.send('Root!'));

  app.get('/ping', (req, res) => res.send('Pong!'));

  return app;
};

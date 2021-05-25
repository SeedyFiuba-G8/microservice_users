const express = require('express');
const path = require('path');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

module.exports = function docsRouter() {
  const swaggerDocument = YAML.load(
    path.join(__dirname, '../../assets/api.yml')
  );

  return express
    .Router()
    .use('/api-docs', swaggerUi.serve)
    .get('/api-docs', swaggerUi.setup(swaggerDocument));
};

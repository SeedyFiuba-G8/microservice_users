const express = require('express');
const swaggerUi = require('swagger-ui-express');

module.exports = function docsRouter(apiSpec) {
  return express
    .Router()
    .use('/api-docs', swaggerUi.serve)
    .get('/api-docs', swaggerUi.setup(apiSpec));
};

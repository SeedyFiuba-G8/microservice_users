const OpenApiValidator = require('express-openapi-validator');

module.exports = function $apiValidatorMiddleware(apiSpec) {
  return OpenApiValidator.middleware({
    apiSpec,
    validateRequests: true, // (default)
    validateResponses: true // false by default
  });
};

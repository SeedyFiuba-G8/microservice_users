module.exports = function $errorHandlerMiddleware() {
  // eslint-disable-next-line no-unused-vars
  return (err, req, res, next) => {
    const status = err.status || 500;
    const response = {
      error: {
        status,
        name: err.name || 'Error',
        message: err.message,
        data: err.data,
        errors: err.errors
      }
    };

    return res.status(status).json(response);
  };
};

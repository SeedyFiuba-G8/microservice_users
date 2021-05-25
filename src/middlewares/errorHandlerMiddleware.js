module.exports = function $errorHandlerMiddleware() {
  // eslint-disable-next-line no-unused-vars
  return (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      error: {
        name: err.name,
        message: err.message,
        data: err.data
      }
    });
  };
};

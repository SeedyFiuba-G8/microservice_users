module.exports = function $statusController(dbService) {
  return {
    health,
    ping
  };

  /**
   * @returns {Promise}
   */
  async function health(req, res) {
    const dbStatus = await dbService.getDatabaseHealth();

    const response = {
      database: dbStatus ? 'UP' : 'DOWN'
    };

    return res.status(200).json(response);
  }

  /**
   * @returns {Promise}
   */
  function ping(req, res) {
    const response = {
      status: 'ok'
    };

    return res.status(200).json(response);
  }
};

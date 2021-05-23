module.exports = function statusController(dbService) {
  async function health(req, res) {
    const dbStatus = await dbService.getDatabaseHealth();

    const response = {
      database: dbStatus ? 'UP' : 'DOWN'
    };

    return res.json(response);
  }

  function ping(req, res) {
    return res.json({ status: 'ok' });
  }

  return {
    health,
    ping
  };
};

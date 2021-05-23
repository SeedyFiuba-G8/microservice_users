module.exports = function statusController(usersRepository) {
  async function health(req, res) {
    const dbStatus = await usersRepository.getHealth();

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

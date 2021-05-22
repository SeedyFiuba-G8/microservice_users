module.exports = function statusController(usersRepository, config) {
  async function health(req, res) {
    console.log('config:', config);
    const status = await usersRepository.getHealth();

    return res.json(status);
  }

  function ping(req, res) {
    return res.json({ status: 'ok' });
  }

  return {
    health,
    ping
  };
};

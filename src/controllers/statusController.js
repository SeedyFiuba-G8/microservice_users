const expressify = require('expressify')();

module.exports = function statusController() {
  function health(req, res) {
    // check db and gateways health (with Promises)
    return res.send('health not implemented yet');
  }

  function ping(req, res) {
    return res.json({ status: 'ok' });
  }

  return expressify({
    health,
    ping
  });
};

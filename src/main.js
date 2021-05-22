const containerFactory = require('./containerFactory');

function main() {
  // eslint-disable-next-line prefer-arrow-callback
  containerFactory.createContainer().resolve(function start(app, config, log) {
    const { port, host } = config.express;

    app.listen(port, host, () => {
      log(`Listening on ${host}:${port} ...`);
    });
  });
}

if (require.main === module) {
  main();
}

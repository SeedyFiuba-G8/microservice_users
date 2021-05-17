const containerFactory = require('./containerFactory');

function main() {
  // eslint-disable-next-line prefer-arrow-callback
  containerFactory.createContainer().resolve(function start(app, log) {
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      log(`Listening on ${port} ...`);
    });
  });
}

if (require.main === module) {
  main();
}

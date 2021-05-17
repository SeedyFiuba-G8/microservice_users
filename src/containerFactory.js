const dependable = require('dependable');
const path = require('path');

function createContainer() {
  const container = dependable.container();
  const entries = [
    'app.js',
    'controllers',
    'middlewares',
    'routes',
    'services'
  ];

  // eslint-disable-next-line prefer-arrow-callback
  container.register('log', function log() {
    return (msg) => console.log(msg);
  });

  entries.forEach((entry) => container.load(path.join(__dirname, entry)));

  return container;
}

module.exports = {
  createContainer
};

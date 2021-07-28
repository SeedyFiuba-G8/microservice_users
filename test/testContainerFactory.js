const path = require('path');
const axios = require('axios');
const AxiosMockAdapter = require('axios-mock-adapter');
const containerFactory = require('../src/containerFactory');

function createContainer() {
  const container = containerFactory.createContainer();
  const entries = ['support'];

  container.register('serviceInfo', function $serverInfo() {
    return {
      creationDate: new Date('2021-07-28T20:41:20.022Z'),
      description:
        'Users microservice that manages users and admins accounts and sessions.'
    };
  });

  container.register('axiosMock', function $axiosMock() {
    return new AxiosMockAdapter(axios);
  });

  entries.forEach((entry) => container.load(path.join(__dirname, entry)));

  return container;
}

module.exports = {
  createContainer
};

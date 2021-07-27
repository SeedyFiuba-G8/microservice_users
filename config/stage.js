module.exports = {
  knex: {
    connection: {
      ssl: { rejectUnauthorized: false }
    }
  },
  services: {
    apikeys: {
      baseUrl: 'https://sf-tdp2-apikeys-dev.herokuapp.com/'
    }
  }
};

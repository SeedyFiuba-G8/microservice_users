const _ = require('lodash');

module.exports = {
  bcrypt: {
    saltRounds: 10
  },
  constraints: {
    fields: {
      email: {
        min: 4,
        max: 40
      },
      password: {
        min: 4,
        max: 20
      },
      firstName: {
        min: 1,
        max: 20
      },
      lastName: {
        min: 1,
        max: 20
      }
    }
  },
  express: {
    host: '0.0.0.0',
    port: _.get(process.env, 'PORT', 3000)
  },
  knex: {
    client: 'pg',
    connection: {
      connectionString: _.get(process.env, 'DATABASE_URL')
    }
  },
  log: {
    console: {
      enabled: true,
      level: 'info',
      timestamp: true,
      prettyPrint: true,
      json: false,
      colorize: true,
      stringify: false,
      label: 'microservice_users'
    }
  }
};

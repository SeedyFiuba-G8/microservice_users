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
        min: 2,
        max: 20
      },
      lastName: {
        min: 2,
        max: 20
      }
    }
  },
  default: {
    profilePicUrl:
      'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'
  },
  express: {
    host: '0.0.0.0',
    port: _.get(process.env, 'PORT', 3000)
  },
  gateways: {
    fb: {
      userByTokenBaseUrl:
        'https://graph.facebook.com/me?fields=email,first_name,last_name&access_token='
    }
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

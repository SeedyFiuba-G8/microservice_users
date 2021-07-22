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
      },
      city: {
        min: 1,
        max: 20
      },
      country: {
        min: 1,
        max: 20
      },
      interest: {
        min: 1,
        max: 20
      },
      interests: {
        max: 64
      },
      profilePicUrl: {
        min: 1,
        max: 255
      }
    }
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

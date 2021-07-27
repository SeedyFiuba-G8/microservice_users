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
    port: _.get(process.env, 'PORT', 3001)
  },
  events: {
    // Admins
    ADMIN_REGISTER: 'Admin Register',
    ADMIN_LOGIN: 'Admin Login',

    // Users
    NATIVE_USER_REGISTER: 'Native User Register',
    FEDERATE_USER_REGISTER: 'Federate User Register',
    NATIVE_USER_LOGIN: 'Native User Login',
    FEDERATE_USER_LOGIN: 'Federate User Login',
    PASSWORD_RECOVERY: 'Password Recovery',
    USER_BANNED: 'User Banned',
    USER_UNBANNED: 'User Unbanned'
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
  logger: {
    console: {
      enabled: true,
      level: _.get(process.env, 'LOGGER_LEVEL', 'info'),
      prettyPrint: true
    },
    http: {
      enabled: true,
      level: _.get(process.env, 'LOGGER_LEVEL', 'info'),
      host: _.get(process.env, 'SUMOLOGIC_HOST'),
      path: _.get(process.env, 'SUMOLOGIC_PATH'),
      ssl: true
    }
  },
  monitoring: true,
  services: {
    apikeys: {
      header: 'x-api-key',
      baseUrl: 'https://sf-tdp2-apikeys-main.herokuapp.com/',
      key: {
        name: 'apikeys-validation-key',
        value: _.get(process.env, 'APIKEYS_KEY', 'SeedyFiubaUsers')
      }
    }
  }
};

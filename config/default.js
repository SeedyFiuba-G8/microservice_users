const _ = require('lodash');

module.exports = {
  express: {
    host: '0.0.0.0',
    port: _.get(process.env, 'PORT', 3000)
  },
  knex: {
    client: 'pg',
    connection: {
      connectionString: _.get(process.env, 'DATABASE_URL')
    }
  }
  // logger: {
  //   console: {
  //     enabled: true,
  //     level: 'info',
  //     timestamp: true,
  //     prettyPrint: true
  //   },
  //   syslog: {
  //     enabled: false,
  //     protocol: 'udp4',
  //     path: '/dev/log',
  //     app_name: 'asset-portal-service',
  //     facility: 'local6'
  //   }
  // }
};

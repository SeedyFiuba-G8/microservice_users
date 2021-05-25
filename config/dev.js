module.exports = {
  knex: {
    connection: {
      ssl: { rejectUnauthorized: false }
    }
  },
  log: {
    console: {
      enabled: true,
      level: 'info'
    }
  }
};

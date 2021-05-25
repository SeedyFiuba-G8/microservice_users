module.exports = {
  knex: {
    connection: {
      ssl: { rejectUnauthorized: false }
    }
  },
  log: {
    console: {
      enabled: true, // In a future, we want to change this behaviour.
      level: 'error'
    }
  }
};

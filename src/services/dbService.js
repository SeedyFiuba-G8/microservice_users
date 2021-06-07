module.exports = function dbService(logger, knex) {
  /**
   * Health status
   *
   * @returns {Promise<boolean>}
   */
  function getDatabaseHealth(timeout = 1000) {
    return knex
      .raw('SELECT version()')
      .timeout(timeout)
      .then(() => true)
      .catch((err) => {
        logger.error('dbService:', err);
        return false;
      });
  }

  return {
    getDatabaseHealth
  };
};

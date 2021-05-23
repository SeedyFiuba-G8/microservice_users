module.exports = function usersRepository(knex) {
  /**
   * @returns {Promise<boolean>}
   */
  function getHealth(timeout = 1000) {
    return knex
      .raw('SELECT version()')
      .timeout(timeout)
      .then(() => true)
      .catch(() => false);
  }

  return {
    getHealth
  };
};

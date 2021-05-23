module.exports = function usersRepository(knex) {
  /**
   * Get all data from users table
   *
   * @returns {Promise}
   */
  function getAll() {
    return knex('users');
  }

  /**
   * Health status
   *
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
    getAll,
    getHealth
  };
};

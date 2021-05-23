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
   * Gets db version
   *
   * @returns {Promise}
   */
  function getVersion() {
    return knex.raw('SELECT version()');
  }

  return {
    getAll,
    getVersion
  };
};

module.exports = function usersRepository(knex) {
  /**
   * @returns {Promise<boolean>}
   */
  function getHealth(timeout = 1000) {
    return knex
      .raw('SELECT version()')
      .timeout(timeout)
      .then((log) => {
        console.log('then:', log);
        return true;
      })
      .catch((err) => {
        console.log('catch:', err);
        return false;
      });
  }

  return {
    getHealth
  };
};

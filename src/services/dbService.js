module.exports = function dbService(usersRepository) {
  /**
   * Health status
   *
   * @returns {Promise<boolean>}
   */
  function getDatabaseHealth(timeout = 1000) {
    return usersRepository
      .getVersion()
      .timeout(timeout)
      .then(() => true)
      .catch((err) => {
        console.log('err:', err);
        return false;
      });
  }

  return {
    getDatabaseHealth
  };
};

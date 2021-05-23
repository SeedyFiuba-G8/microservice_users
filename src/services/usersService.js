module.exports = function usersService(usersRepository) {
  /**
   * Fetchs all users data from db
   *
   * @returns {Promise}
   */
  async function getAll() {
    return usersRepository.getAll();
  }

  return {
    getAll
  };
};

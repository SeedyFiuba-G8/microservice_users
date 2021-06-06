const { v4: uuidv4 } = require('uuid');

module.exports = function usersService(errors, usersRepository) {
  return {
    getAll,
    login,
    register
  };

  /**
   *
   * @returns {Promise}
   */
  async function getAll() {
    return usersRepository.getAll();
  }

  /**
   * @returns {Promise<String>}
   */
  function login({ email, password }) {
    // TODO: Validar campos

    return usersRepository.login(email, password);
  }

  /**
   * @returns {undefined}
   */
  async function register(userData) {
    // TODO: Validar campos

    const uuid = uuidv4();
    await usersRepository.createUser({ id: uuid, ...userData });
  }
};

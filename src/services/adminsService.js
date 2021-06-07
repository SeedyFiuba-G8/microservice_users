const { v4: uuidv4 } = require('uuid');

module.exports = function usersService(adminsRepository) {
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
    return adminsRepository.getAll();
  }

  /**
   * @returns {Promise<String>}
   */
  function login({ email, password }) {
    // TODO: Validar campos

    return adminsRepository.login(email, password);
  }

  /**
   * @returns {undefined}
   */
  async function register(adminData) {
    // TODO: Validar campos

    const uuid = uuidv4();
    await adminsRepository.createAdmin({ id: uuid, ...adminData });
  }
};

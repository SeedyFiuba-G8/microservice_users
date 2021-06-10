const { v4: uuidv4 } = require('uuid');

module.exports = function usersService(bcrypt, errors, adminsRepository) {
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
  async function login({ email, password }) {
    // TODO: Validar campos

    const admin = adminsRepository.get(email)[0];
    if (!admin) throw errors.Conflict('Email not registered');

    const match = await bcrypt.compare(password, admin.password);
    if (!match) throw errors.Conflict('Invalid password');

    return admin.id;
  }

  /**
   * @returns {undefined}
   */
  async function register(adminData) {
    // TODO: Validar campos

    const uuid = uuidv4();
    const encryptedPassword = await bcrypt.hash(adminData.password);

    await adminsRepository.create({
      ...adminData,
      id: uuid,
      password: encryptedPassword
    });
  }
};

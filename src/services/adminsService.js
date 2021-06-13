const { v4: uuidv4 } = require('uuid');

module.exports = function usersService(
  bcrypt,
  errors,
  adminsRepository,
  validationUtils
) {
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
    validationUtils.validateLoginData({ email, password });

    const admins = await adminsRepository.get(email);
    if (!admins.length) throw errors.Conflict('Email not registered');
    const admin = admins[0];

    const match = await bcrypt.compare(password, admin.password);
    if (!match) throw errors.Conflict('Invalid password');

    return admin.id;
  }

  /**
   * @returns {undefined}
   */
  async function register(adminData) {
    validationUtils.validateAdminRegisterData(adminData);

    const uuid = uuidv4();
    const encryptedPassword = await bcrypt.hash(adminData.password);

    await adminsRepository.create({
      ...adminData,
      id: uuid,
      password: encryptedPassword
    });
  }
};

const { v4: uuidv4 } = require('uuid');

module.exports = function $adminService(
  bcrypt,
  errors,
  adminRepository,
  validationUtils
) {
  return {
    login,
    register
  };

  /**
   * @returns {Promise<String>}
   */
  async function login({ email, password }) {
    validationUtils.validateLoginData({ email, password });

    const admins = await adminRepository.get(email);
    if (!admins.length) throw errors.create(409, 'Email not registered');
    const admin = admins[0];

    const match = await bcrypt.compare(password, admin.password);
    if (!match) throw errors.create(409, 'Invalid password');

    return admin.id;
  }

  /**
   * @returns {undefined}
   */
  async function register(adminData) {
    validationUtils.validateAdminRegisterData(adminData);

    const uuid = uuidv4();
    const encryptedPassword = await bcrypt.hash(adminData.password);

    await adminRepository.create({
      ...adminData,
      id: uuid,
      password: encryptedPassword
    });
  }
};

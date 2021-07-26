const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');

module.exports = function $adminService(
  adminRepository,
  bcrypt,
  errors,
  events,
  eventRepository,
  logger,
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

    const admins = await adminRepository.get({ email });
    if (!admins.length)
      throw errors.create(409, 'Email or password is incorrect');
    const admin = admins[0];

    const match = await bcrypt.compare(password, admin.password);
    if (!match) throw errors.create(409, 'Email or password is incorrect');

    eventRepository.log(events.ADMIN_LOGIN);
    logger.info({
      message: 'Admin logged in',
      admin: _.pick(admin, ['id', 'email', 'firstName', 'lastName'])
    });

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

    eventRepository.log(events.ADMIN_REGISTER);
    logger.info({
      message: 'Admin registered',
      admin: {
        id: uuid,
        ..._.pick(adminData, ['email', 'firstName', 'lastName'])
      }
    });
  }
};

const { v4: uuidv4 } = require('uuid');

module.exports = function $userService(
  bcrypt,
  errors,
  fbGateway,
  userRepository,
  userUtils,
  validationUtils
) {
  return {
    getAll,
    fbLogin,
    login,
    register
  };

  /**
   *
   * @returns {Promise}
   */
  async function getAll() {
    const users = await userRepository.getAll();
    return users.map(userUtils.buildAllUsersObject);
  }

  /**
   * @returns {Promise<String>}
   */
  async function fbLogin({ fbToken }) {
    const fbUser = await fbGateway.fetchUser(fbToken);
    const users = await userRepository.getByFbId(fbUser.id);

    if (!users.length) {
      const uuid = uuidv4();
      await userRepository.create({
        id: uuid,
        email: fbUser.email,
        fbId: fbUser.id,
        firstName: fbUser.first_name,
        lastName: fbUser.last_name
      });

      return uuid;
    }

    const user = users[0];

    if (user.banned) throw errors.create(409, 'User is banned');

    return user.id;
  }

  /**
   * @returns {Promise<String>}
   */
  async function login({ email, password }) {
    validationUtils.validateLoginData({ email, password });

    const users = await userRepository.get(email);
    if (!users.length)
      throw errors.create(409, 'Invalid email and password combination');
    const user = users[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      throw errors.create(409, 'Invalid email and password combination');

    if (user.banned) throw errors.create(409, 'User is banned');

    return user.id;
  }

  /**
   * @returns {Promise<undefined>}
   */
  async function register(userData) {
    validationUtils.validateUserRegisterData(userData);

    const uuid = uuidv4();
    const encryptedPassword = await bcrypt.hash(userData.password);

    await userRepository.create({
      ...userData,
      id: uuid,
      password: encryptedPassword
    });
  }
};

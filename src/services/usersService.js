const { v4: uuidv4 } = require('uuid');

module.exports = function usersService(bcrypt, errors, usersRepository) {
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
  async function login({ email, password }) {
    // TODO: Validar campos

    const users = await usersRepository.get(email);
    if (!users.length) throw errors.Conflict('Email not registered');
    const user = users[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw errors.Conflict('Invalid password');

    return user.id;
  }

  /**
   * @returns {undefined}
   */
  async function register(userData) {
    // TODO: Validar campos

    const uuid = uuidv4();
    const encryptedPassword = await bcrypt.hash(userData.password);

    await usersRepository.create({
      ...userData,
      id: uuid,
      password: encryptedPassword
    });
  }
};

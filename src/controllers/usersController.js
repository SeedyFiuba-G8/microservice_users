module.exports = function usersController(usersService) {
  return {
    getAll,
    login,
    register
  };

  /**
   *
   * @returns {Promise}
   */
  async function getAll(req, res) {
    const users = await usersService.getAll();

    return res.status(200).json({ users });
  }

  /**
   * @returns {Promise}
   */
  async function login(req, res) {
    const credentials = req.body;
    let id;

    if (!credentials.fbToken) {
      id = await usersService.login(credentials);
    } else {
      id = await usersService.fbLogin(credentials);
    }

    return res.status(200).json({ id });
  }

  /**
   * @returns {Promise}
   */
  async function register(req, res) {
    const userData = req.body;
    await usersService.register(userData);

    return res.status(201).send();
  }
};

module.exports = function usersController(adminsService) {
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
    const admins = await adminsService.getAll();

    return res.status(200).json({ admins });
  }

  /**
   * @returns {Promise}
   */
  async function login(req, res) {
    const credentials = req.body;
    const id = await adminsService.login(credentials);

    return res.status(200).json({ id });
  }

  /**
   * @returns {Promise}
   */
  async function register(req, res) {
    const adminData = req.body;
    await adminsService.register(adminData);

    return res.status(201).send();
  }
};

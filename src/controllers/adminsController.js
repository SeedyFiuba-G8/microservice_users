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
  async function getAll(req, res, next) {
    let admins;
    try {
      admins = await adminsService.getAll();
    } catch (err) {
      return next(err);
    }

    return res.status(200).json({ admins });
  }

  /**
   * @returns {Promise}
   */
  async function login(req, res, next) {
    const credentials = req.body;
    let id;

    try {
      id = await adminsService.login(credentials);
    } catch (err) {
      return next(err);
    }

    return res.status(200).json({ id });
  }

  /**
   * @returns {Promise}
   */
  async function register(req, res, next) {
    const adminData = req.body;

    try {
      await adminsService.register(adminData);
    } catch (err) {
      return next(err);
    }

    return res.status(201).send();
  }
};

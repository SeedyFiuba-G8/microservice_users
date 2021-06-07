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
  async function getAll(req, res, next) {
    let users;
    try {
      users = await usersService.getAll();
    } catch (err) {
      return next(err);
    }

    return res.status(200).json({ users });
  }

  /**
   * @returns {Promise}
   */
  async function login(req, res, next) {
    const credentials = req.body;
    let id;

    try {
      id = await usersService.login(credentials);
    } catch (err) {
      return next(err);
    }

    return res.status(200).json({ id });
  }

  /**
   * @returns {Promise}
   */
  async function register(req, res, next) {
    const userData = req.body;

    try {
      await usersService.register(userData);
    } catch (err) {
      return next(err);
    }

    return res.status(201).send();
  }
};

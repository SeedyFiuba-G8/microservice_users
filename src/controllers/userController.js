module.exports = function $userController(userService) {
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
      users = await userService.getAll();
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
      if (!credentials.fbToken) {
        id = await userService.login(credentials);
      } else {
        id = await userService.fbLogin(credentials);
      }
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
      await userService.register(userData);
    } catch (err) {
      return next(err);
    }

    return res.status(201).send();
  }
};

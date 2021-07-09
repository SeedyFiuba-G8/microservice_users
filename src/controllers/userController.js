module.exports = function $userController(expressify, userService) {
  return expressify({
    get,
    getAll,
    login,
    register,
    update
  });

  async function get(req, res) {
    const { userId } = req.params;
    const profile = await userService.get(userId);

    return res.status(200).json(profile);
  }

  async function getAll(req, res) {
    const users = await userService.getAll();

    return res.status(200).json({ users });
  }

  async function login(req, res) {
    const credentials = req.body;
    const loginMethod = !credentials.fbToken
      ? userService.login
      : userService.fbLogin;

    const id = await loginMethod(credentials);

    return res.status(200).json({ id });
  }

  async function register(req, res) {
    const userData = req.body;
    await userService.register(userData);

    return res.status(201).send();
  }

  async function update(req, res) {
    const { userId } = req.params;
    const requester = req.headers.uid;
    const updatedUserData = req.body;

    await userService.update(requester, { userId, updatedUserData });

    return res.status(200).send();
  }
};

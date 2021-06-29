module.exports = function $userController(expressify, userService) {
  return expressify({
    getAll,
    getProfile,
    login,
    register
  });

  async function getAll(req, res) {
    const users = await userService.getAll();

    return res.status(200).json({ users });
  }

  async function getProfile(req, res) {
    const { userId } = req.params;
    const profile = await userService.getProfile(userId);

    return res.status(200).json(profile);
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
};

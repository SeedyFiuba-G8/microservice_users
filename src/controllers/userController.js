module.exports = function $userController(expressify, userService) {
  return expressify({
    get,
    getAll,
    login,
    register,
    translateEmails,
    translateIds,
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
    const id = await userService.register(userData);

    return res.status(201).json(id);
  }

  async function translateEmails(req, res) {
    const userEmails = req.body;
    const ids = await userService.translateEmails(userEmails);

    return res.status(200).json(ids);
  }

  async function translateIds(req, res) {
    const userIds = req.body;
    const names = await userService.translateIds(userIds);

    return res.status(200).json(names);
  }

  async function update(req, res) {
    const { userId } = req.params;
    const requester = req.headers.uid;
    const updatedUserData = req.body;

    await userService.update(requester, { userId, updatedUserData });

    return res.status(200).send();
  }
};

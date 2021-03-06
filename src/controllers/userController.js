const _ = require('lodash');

module.exports = function $userController(expressify, userService) {
  return expressify({
    ban,
    get,
    getAll,
    login,
    register,
    translateEmails,
    translateIds,
    unban,
    update
  });

  async function ban(req, res) {
    const { userId } = req.params;
    await userService.ban(userId);

    return res.status(204).send();
  }

  async function get(req, res) {
    const { userId } = req.params;
    const profile = await userService.get(userId);

    return res.status(200).json(profile);
  }

  async function getAll(req, res) {
    const { filters, limit, offset } = parseFilters(req.query);
    const users = await userService.getAllBy(filters, limit, offset);

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

    return res
      .status(201)
      .json({ id, ..._.pick(userData, ['email', 'firstName', 'lastName']) });
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

  async function unban(req, res) {
    const { userId } = req.params;
    await userService.unban(userId);

    return res.status(204).send();
  }

  async function update(req, res) {
    const { userId } = req.params;
    const requester = req.headers.uid;
    const updatedUserData = req.body;

    await userService.update(requester, { userId, updatedUserData });

    return res.status(200).send();
  }

  // Aux

  /**
   * Parse the filters and pick the valid ones
   *
   * @param {Object} filters
   *
   * @returns {Object}
   */
  function parseFilters(filters) {
    return {
      filters: _.pick(filters, ['firstName', 'lastName', 'banned']),
      limit: _.get(filters, 'limit'),
      offset: _.get(filters, 'offset')
    };
  }
};

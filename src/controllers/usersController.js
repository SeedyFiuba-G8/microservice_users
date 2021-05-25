module.exports = function usersController(usersService, usersUtils) {
  /**
   * Fetchs all users data from db
   *
   * @returns {Promise}
   */
  async function getAll(req, res) {
    let allUsers;

    try {
      allUsers = await usersService.getAll();
    } catch (err) {
      return res.status(409).json(err);
    }

    const response = {
      users: allUsers
    };

    response.users = response.users.map(usersUtils.buildUsersObject);

    return res.status(200).json(response);
  }

  return {
    getAll
  };
};

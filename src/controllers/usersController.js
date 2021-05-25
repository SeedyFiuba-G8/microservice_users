module.exports = function usersController(usersService) {
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
      res.status(409).json(err);
    }

    return res.status(200).json(allUsers);
  }

  return {
    getAll
  };
};

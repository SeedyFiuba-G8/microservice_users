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
      res.status(400).json(err);
    }

    return res.json(allUsers);
  }

  return {
    getAll
  };
};

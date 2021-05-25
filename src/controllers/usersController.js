module.exports = function usersController(usersService, usersUtils, logger) {
  /**
   * Fetchs all users data from db
   *
   * @returns {Promise}
   */
  async function getAll(req, res, next) {
    let allUsers;

    try {
      allUsers = await usersService.getAll();
    } catch (err) {
      logger.warn('usersService.getAll:', err);
      err.status = 409;
      err.name = 'Error in usersService.getAll';
      return next(err);
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

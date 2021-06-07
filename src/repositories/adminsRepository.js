module.exports = function usersRepository(errors, logger, knex) {
  return {
    createAdmin,
    getAll,
    login
  };

  /**
   * @returns {undefined}
   */
  async function createAdmin({ id, email, password }) {
    try {
      await knex('admins').insert({
        id,
        email,
        password
      });
    } catch (err) {
      if (err.code === '23505') throw errors.Conflict('Email already in use');

      logger.error(err);
      throw errors.InternalServerError();
    }
  }

  /**
   * @returns {Promise}
   */
  function getAll() {
    return knex('admins');
  }

  /**
   * @returns {String}
   */
  async function login(email, password) {
    const emailRows = await knex('admins').where({ email }).select('*');
    if (!emailRows.length) throw errors.Conflict('Email not registered');

    const userData = emailRows[0];
    if (password !== userData.password)
      throw errors.Conflict('Invalid password');

    return userData.id;
  }
};

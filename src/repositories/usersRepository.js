module.exports = function usersRepository(errors, logger, knex) {
  return {
    createUser,
    getAll,
    getVersion,
    login
  };

  /**
   * @returns {undefined}
   */
  async function createUser({ id, firstName, lastName, email, password }) {
    try {
      await knex('users').insert({
        id,
        first_name: firstName,
        last_name: lastName,
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
    return knex('users');
  }

  /**
   * @returns {Promise}
   */
  function getVersion() {
    return knex.raw('SELECT version()');
  }

  /**
   * @returns {String}
   */
  async function login(email, password) {
    const emailRows = await knex('users').where({ email }).select('*');
    if (!emailRows.length) throw errors.Conflict('Email not registered');

    const userData = emailRows[0];
    if (password !== userData.password)
      throw errors.Conflict('Invalid password');

    return userData.id;
  }
};

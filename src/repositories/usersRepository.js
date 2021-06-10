module.exports = function usersRepository(errors, logger, knex) {
  return {
    create,
    get,
    getAll
  };

  /**
   * @returns {undefined}
   */
  async function create({ id, firstName, lastName, email, password }) {
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
   * @returns {String}
   */
  function get(email) {
    return knex('users').where({ email }).select('*');
  }

  /**
   * @returns {Promise}
   */
  function getAll() {
    return knex('users');
  }
};

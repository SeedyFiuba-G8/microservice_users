module.exports = function usersRepository(errors, logger, knex) {
  return {
    create,
    fbCreate,
    get,
    getAll,
    getByFbId
  };

  /**
   * @returns {undefined}
   */
  async function create({ id, firstName, lastName, email, password }) {
    try {
      await knex('users').insert({
        id,
        email,
        password,
        first_name: firstName,
        last_name: lastName
      });
    } catch (err) {
      if (err.code === '23505') throw errors.Conflict('Email already in use');

      logger.error(err);
      throw errors.InternalServerError();
    }
  }

  /**
   * @returns {undefined}
   */
  async function fbCreate({ id, email, fbId, firstName, lastName }) {
    try {
      await knex('users').insert({
        id,
        email,
        fb_id: fbId,
        first_name: firstName,
        last_name: lastName
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

  /**
   * @returns {String}
   */
  function getByFbId(fbId) {
    return knex('users').where({ fb_id: fbId }).select('*');
  }
};

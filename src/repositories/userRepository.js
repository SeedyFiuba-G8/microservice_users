module.exports = function $userRepository(errors, logger, knex) {
  return {
    create,
    get,
    getAll,
    getByFbId
  };

  /**
   * @returns {Promise<undefined>}
   */
  async function create({ id, email, password, fbId, firstName, lastName }) {
    const userData = {
      id,
      email,
      first_name: firstName,
      last_name: lastName
    };

    if (password) userData.password = password;
    if (fbId) userData.fb_id = fbId;

    try {
      await knex('users').insert(userData);
    } catch (err) {
      if (err.code === '23505')
        throw errors.create(409, 'Email already in use');

      logger.error(err);
      throw errors.UnknownError;
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

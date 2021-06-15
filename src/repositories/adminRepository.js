module.exports = function $adminRepository(errors, logger, knex) {
  return {
    create,
    get,
    getAll
  };

  /**
   * @returns {undefined}
   */
  async function create({ id, email, password }) {
    try {
      await knex('admins').insert({
        id,
        email,
        password
      });
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
    return knex('admins').where({ email }).select('*');
  }

  /**
   * @returns {Promise}
   */
  function getAll() {
    return knex('admins');
  }
};

const _ = require('lodash');

module.exports = function $adminRepository(errors, logger, knex) {
  return {
    create,
    get
  };

  function create({ id, email, password }) {
    return knex('admins')
      .insert({
        id,
        email,
        password
      })
      .catch((err) => {
        if (err.code === '23505')
          throw errors.create(409, 'Email already in use');

        logger.error(err);
        throw errors.UnknownError;
      });
  }

  function get(filters = {}) {
    const parsedFilters = _.omitBy({ email: filters.email }, _.isUndefined);

    return knex('admins').where(parsedFilters).select('*');
  }
};

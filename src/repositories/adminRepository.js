const _ = require('lodash');

module.exports = function $adminRepository(dbUtils, errors, logger, knex) {
  return {
    count,
    create,
    get
  };

  function count({ filters = {} } = {}) {
    return knex('admins')
      .where(dbUtils.mapToDb(filters))
      .count('id')
      .then((result) => Number(result[0].count));
  }

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

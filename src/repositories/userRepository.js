const _ = require('lodash');

module.exports = function $userRepository(dbUtils, errors, logger, knex) {
  return {
    count,
    create,
    get,
    translateEmails,
    translateIds,
    update
  };

  function count({ filters = {} } = {}) {
    return knex('users')
      .where(dbUtils.mapToDb(filters))
      .count('id')
      .then((result) => Number(result[0].count));
  }

  function create({ id, email, password, fbId, firstName, lastName }) {
    const userData = {
      id,
      email,
      first_name: firstName,
      last_name: lastName
    };

    if (password) userData.password = password;
    if (fbId) userData.fb_id = fbId;

    return knex('users')
      .insert(userData)
      .catch((err) => {
        if (err.code === '23505')
          throw errors.create(409, 'Email already in use');

        logger.error(err);
        throw errors.UnknownError;
      });
  }

  function get({ select, filters = {}, limit, offset } = {}) {
    const query = knex('users')
      .select(_.isArray(select) ? dbUtils.mapToDb(select) : '*')
      .where(dbUtils.mapToDb(filters))
      .orderBy('signup_date', 'desc');

    if (limit) query.limit(limit);
    if (offset) query.offset(offset);

    return query.then(dbUtils.mapFromDb);
  }

  function translateEmails(userEmails) {
    return knex('users').whereIn('email', userEmails).select(['id']);
  }

  function translateIds(userIds) {
    return knex('users')
      .whereIn('id', userIds)
      .select(['id', 'email', 'first_name', 'last_name']);
  }

  async function update(userId, updatedUserData, where) {
    let query = knex('users')
      .update(dbUtils.mapToDb(updatedUserData))
      .where('id', userId);

    if (where) query = query.where(where);

    const result = await query;
    if (!result) throw errors.create(404, 'User not found');
  }
};

const _ = require('lodash');

module.exports = function $userRepository(dbUtils, errors, logger, knex) {
  return {
    create,
    get,
    translateEmails,
    translateIds,
    update
  };

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

  async function update(userId, updatedUserData) {
    const updateData = _.omitBy(
      {
        ..._.pick(updatedUserData, ['city', 'country', 'interests']),
        profile_pic_url: updatedUserData.profilePicUrl
      },
      _.isUndefined
    );

    if (!(await knex('users').update(updateData).where('id', userId)))
      throw errors.create(404, 'User not found');
  }
};

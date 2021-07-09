const _ = require('lodash');

module.exports = function $userRepository(errors, logger, knex) {
  return {
    create,
    get,
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

  function get(filters = {}) {
    const parsedFilters = _.omitBy(
      { id: filters.id, email: filters.email, fb_id: filters.fbId },
      _.isUndefined
    );

    return knex('users').where(parsedFilters).select('*');
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

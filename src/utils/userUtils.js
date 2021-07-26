const _ = require('lodash');

module.exports = function $userUtils() {
  return {
    buildProfile
  };

  function buildProfile(user) {
    return _.omitBy(
      {
        ...user,
        city: user.city || '',
        country: user.country || '',
        interests: user.interests || []
      },
      _.isNull
    );
  }
};

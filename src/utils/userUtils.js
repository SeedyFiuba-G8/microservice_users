const _ = require('lodash');

module.exports = function $userUtils() {
  return {
    buildProfile
  };

  function buildProfile(user) {
    return _.omitBy(
      {
        firstName: user.first_name,
        lastName: user.last_name,
        banned: user.banned,
        signupDate: user.signup_date,
        city: user.city || '',
        country: user.country || '',
        interests: user.interests || [],
        profilePicUrl: user.profile_pic_url
      },
      _.isNull
    );
  }
};

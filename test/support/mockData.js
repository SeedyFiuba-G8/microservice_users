const _ = require('lodash');

module.exports = function $mockData() {
  const users = [
    {
      id: 'ca718a21-a126-484f-bc50-145126a6f75b',
      email: 'user@user.com',
      banned: false,
      firstName: 'user',
      lastName: 'user',
      signupDate: '2021-06-13T21:29:29.330Z'
    },
    {
      id: 'f5c43d00-91d7-4ff8-9ecb-8087e67a5ffd',
      email: 'banned@banned.com',
      banned: true,
      firstName: 'banned',
      lastName: 'banned',
      signupDate: '2021-06-13T21:29:29.340Z'
    }
  ];

  const buildUser = ({
    id,
    email,
    hashedPassword,
    banned,
    firstName,
    lastName,
    signUpDate,
    city,
    country,
    interests,
    profilePicUrl
  } = {}) => ({
    id: id || 'a1c22d00-91d7-4ff8-9ecb-8087e67a5ffd',
    email: email || 'default@email.com',
    password:
      hashedPassword ||
      '$2b$10$R3YT8/4SxWGfajHg6lSJ3eLw2ASxqeO8kOhtN2t3h2RzBUln3YjEa',
    fb_id: null,
    banned: banned || false,
    first_name: firstName || 'First',
    last_name: lastName || 'Last',
    signup_date: signUpDate || new Date('2021-06-13T21:29:29.330Z'),
    city: city || 'Buenos Aires',
    country: country || 'Argentina',
    interests: interests || ['music', 'productivity'],
    profile_pic_url: profilePicUrl || null
  });

  const buildProfile = (user) =>
    _.omitBy(
      {
        firstName: user.first_name,
        lastName: user.last_name,
        banned: user.banned,
        signupDate: user.signup_date.toJSON(),
        city: user.city,
        country: user.country,
        interests: user.interests,
        profilePicUrl: user.profile_pic_url || null
      },
      _.isNull
    );

  return { buildProfile, buildUser, users };
};

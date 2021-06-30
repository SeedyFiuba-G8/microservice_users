module.exports = function $userUtils() {
  return {
    buildAllUsersObject
  };

  function buildAllUsersObject(user) {
    return {
      id: user.id,
      email: user.email,
      banned: user.banned,
      firstName: user.first_name,
      lastName: user.last_name,
      signupDate: user.signup_date.toString()
    };
  }
};

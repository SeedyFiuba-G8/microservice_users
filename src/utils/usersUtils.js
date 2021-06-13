module.exports = function $usersUtils() {
  return {
    buildUsersObject
  };

  function buildUsersObject(userInfo) {
    return {
      id: userInfo.id,
      first_name: userInfo.first_name,
      last_name: userInfo.last_name
    };
  }
};

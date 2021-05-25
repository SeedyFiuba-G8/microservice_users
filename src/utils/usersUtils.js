module.exports = function usersUtils() {
  function buildUsersObject(userInfo) {
    return {
      id: userInfo.id,
      first_name: userInfo.first_name,
      last_name: userInfo.last_name
    };
  }

  return {
    buildUsersObject
  };
};

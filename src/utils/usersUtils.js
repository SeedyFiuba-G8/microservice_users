module.exports = function usersUtils() {
  function buildUsersObject(userInfo) {
    return {
      id: '670b9562-b30d-52d5-b827-655787665500', // mock
      first_name: userInfo.first_name,
      last_name: userInfo.last_name
    };
  }

  return {
    buildUsersObject
  };
};

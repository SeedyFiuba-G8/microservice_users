const axios = require('axios');

module.exports = function fbGateway(errors) {
  return {
    fetchUser
  };

  /**
   * @returns {undefined}
   */
  async function fetchUser(token) {
    const url = `https://graph.facebook.com/me?fields=email,first_name,last_name&access_token=${token}`;
    let response;

    try {
      response = await axios.get(url);
    } catch (err) {
      throw errors.FromAxios(err);
    }

    return response.data;
  }
};

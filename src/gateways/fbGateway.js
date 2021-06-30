const axios = require('axios');

module.exports = function fbGateway(config, errors) {
  return {
    fetchUser
  };

  /**
   * @returns {undefined}
   */
  async function fetchUser(token) {
    const { userByTokenBaseUrl } = config.gateways.fb;
    const url = userByTokenBaseUrl + token;

    return axios
      .get(url)
      .then((res) => res.data)
      .catch((err) => Promise.reject(errors.FromAxios(err)));
  }
};

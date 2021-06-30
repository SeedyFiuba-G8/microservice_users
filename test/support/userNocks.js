module.exports = function $userNocks(axiosMock, config) {
  return { nockFbUserInfo };

  function nockFbUserInfo(fbToken, userInfo) {
    const { userByTokenBaseUrl } = config.gateways.fb;
    const url = userByTokenBaseUrl + fbToken;

    axiosMock.onGet(url).reply(200, userInfo);
  }
};

const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');

module.exports = function $userService(
  bcrypt,
  errors,
  fbGateway,
  userRepository,
  userUtils,
  validationUtils
) {
  return {
    get,
    getAll,
    fbLogin,
    login,
    register,
    translateEmails,
    translateIds,
    update
  };

  async function get(userId) {
    const users = await userRepository.get({ id: userId });
    if (!users.length) throw errors.create(404, 'User not found');

    const user = users[0];
    return userUtils.buildProfile(user);
  }

  async function getAll() {
    const users = await userRepository.get();
    return users.map(userUtils.buildAllUsersObject);
  }

  async function fbLogin({ fbToken }) {
    const fbUser = await fbGateway.fetchUser(fbToken);
    const users = await userRepository.get({ fbId: fbUser.id });

    if (!users.length) {
      const uuid = uuidv4();
      await userRepository.create({
        id: uuid,
        email: fbUser.email,
        fbId: fbUser.id,
        firstName: fbUser.first_name,
        lastName: fbUser.last_name
      });

      return uuid;
    }

    const user = users[0];
    if (user.banned) throw errors.create(409, 'User is banned');

    return user.id;
  }

  async function login({ email, password }) {
    validationUtils.validateLoginData({ email, password });

    const users = await userRepository.get({ email });
    if (!users.length)
      throw errors.create(409, 'Email or password is incorrect');
    const user = users[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw errors.create(409, 'Email or password is incorrect');

    if (user.banned) throw errors.create(409, 'User is banned');

    return user.id;
  }

  async function register(userData) {
    validationUtils.validateUserRegisterData(userData);

    const uuid = uuidv4();
    const encryptedPassword = await bcrypt.hash(userData.password);

    await userRepository.create({
      ...userData,
      id: uuid,
      password: encryptedPassword
    });
  }

  async function translateEmails(userEmails) {
    if (!userEmails.length)
      throw errors.create(409, 'Empty userEmails requested');

    const ids = await userRepository.translateEmails(userEmails);
    if (ids.length !== userEmails.length)
      throw errors.create(404, 'Some user does not exist');

    // Flatten before return
    return ids.map((idObject) => idObject.id);
  }

  async function translateIds(userIds) {
    if (!userIds.length) throw errors.create(409, 'Empty userIds requested');

    const names = {};
    const rawNames = await userRepository.translateIds(userIds);
    if (rawNames.length !== userIds.length)
      throw errors.create(404, 'Some user does not exist');

    rawNames.forEach((name) => {
      names[name.id] = {
        email: name.email,
        firstName: name.first_name,
        lastName: name.last_name
      };
    });

    return names;
  }

  async function update(requester, { userId, updatedUserData }) {
    if (userId !== requester)
      throw errors.create(403, 'Only the user can modify its information');

    const validFields = ['city', 'country', 'interests', 'profilePicUrl'];
    const parsedData = _.pick(updatedUserData, validFields);

    if (_.isEmpty(parsedData))
      throw errors.create(
        400,
        `At least should have one valid field. Valid fields: [${validFields}]`
      );

    validationUtils.validateUpdatedUserData(updatedUserData);

    await userRepository.update(userId, updatedUserData);
  }
};

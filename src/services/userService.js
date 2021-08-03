const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');

module.exports = function $userService(
  bcrypt,
  errors,
  events,
  eventRepository,
  fbGateway,
  logger,
  userRepository,
  userUtils,
  validationUtils
) {
  return {
    ban,
    get,
    getAllBy,
    fbLogin,
    login,
    register,
    translateEmails,
    translateIds,
    unban,
    update
  };

  async function ban(userId) {
    await userRepository.update(
      userId,
      {
        banned: true
      },
      {
        banned: false
      }
    );

    eventRepository.log(events.USER_BANNED);
    logger.info({
      message: 'User banned',
      user: {
        id: userId
      }
    });
  }

  async function get(userId) {
    const selectFields = [
      'firstName',
      'lastName',
      'banned',
      'signupDate',
      'city',
      'country',
      'interests',
      'profilePicUrl'
    ];

    const users = await userRepository.get({
      filters: {
        id: userId
      },
      select: selectFields
    });

    if (!users.length) throw errors.create(404, 'User not found');
    const user = users[0];
    const profile = userUtils.buildProfile(user);

    logger.info({
      message: 'User info retrieved',
      user: {
        ...profile,
        id: userId
      }
    });

    return profile;
  }

  async function getAllBy(filters, limit, offset) {
    const selectFields = [
      'id',
      'email',
      'banned',
      'firstName',
      'lastName',
      'signupDate'
    ];

    const result = await userRepository.get({
      filters,
      select: selectFields,
      limit,
      offset
    });

    logger.info({
      message: 'User list retrieved',
      length: result.length
    });

    return result;
  }

  async function fbLogin({ fbToken }) {
    const fbUser = await fbGateway.fetchUser(fbToken);
    const users = await userRepository.get({ filters: { fbId: fbUser.id } });

    if (!users.length) {
      const uuid = uuidv4();
      await userRepository.create({
        id: uuid,
        email: fbUser.email,
        fbId: fbUser.id,
        firstName: fbUser.first_name,
        lastName: fbUser.last_name
      });

      eventRepository.log(events.FEDERATE_USER_REGISTER);
      logger.info({
        message: 'Federate user registered',
        user: {
          id: uuid,
          email: fbUser.email,
          firstName: fbUser.first_name,
          lastName: fbUser.last_name
        }
      });

      eventRepository.log(events.FEDERATE_USER_LOGIN);
      logger.info({
        message: 'Federate user logged in',
        user: {
          id: uuid,
          email: fbUser.email,
          firstName: fbUser.first_name,
          lastName: fbUser.last_name
        }
      });

      return uuid;
    }

    const user = users[0];
    if (user.banned) throw errors.create(409, 'User is banned');

    eventRepository.log(events.FEDERATE_USER_LOGIN);
    logger.info({
      message: 'Federate user logged in',
      user: _.pick(user, ['id', 'email', 'firstName', 'lastName'])
    });

    return user.id;
  }

  async function login({ email, password }) {
    validationUtils.validateLoginData({ email, password });

    const users = await userRepository.get({ filters: { email } });
    if (!users.length)
      throw errors.create(409, 'Email or password is incorrect');
    const user = users[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw errors.create(409, 'Email or password is incorrect');

    if (user.banned) throw errors.create(409, 'User is banned');

    eventRepository.log(events.NATIVE_USER_LOGIN);
    logger.info({
      message: 'Native user logged in',
      user: _.pick(user, ['id', 'email', 'firstName', 'lastName'])
    });

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

    eventRepository.log(events.NATIVE_USER_REGISTER);
    logger.info({
      message: 'Native user registered',
      user: {
        id: uuid,
        ..._.pick(userData, ['email', 'firstName', 'lastName'])
      }
    });

    return uuid;
  }

  async function translateEmails(userEmails) {
    if (!userEmails.length)
      throw errors.create(409, 'Empty userEmails requested');

    const ids = await userRepository.translateEmails(userEmails);
    if (ids.length !== userEmails.length)
      throw errors.create(404, 'Some user does not exist');

    // Flatten before return
    const flatten = ids.map((idObject) => idObject.id);

    logger.debug({
      message: 'Emails translated to ids',
      emails: userEmails,
      ids: flatten
    });

    return flatten;
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

    logger.debug({
      message: 'Ids translated to names',
      names
    });

    return names;
  }

  async function unban(userId) {
    await userRepository.update(
      userId,
      {
        banned: false
      },
      {
        banned: true
      }
    );

    eventRepository.log(events.USER_UNBANNED);
    logger.info({
      message: 'User unbanned',
      user: {
        id: userId
      }
    });
  }

  async function update(requester, { userId, updatedUserData }) {
    if (userId !== requester)
      throw errors.create(403, 'Only the user can modify its information');

    const validFields = ['city', 'country', 'interests', 'profilePicUrl'];
    const parsedData = _.pick(updatedUserData, validFields);
    validationUtils.validateUpdatedUserData(parsedData);

    if (_.isEmpty(parsedData))
      throw errors.create(
        400,
        `At least should have one valid field. Valid fields: [${validFields}]`
      );

    await userRepository.update(userId, parsedData);

    logger.info({
      message: 'User info updated',
      user: {
        id: userId,
        ...parsedData
      }
    });
  }
};

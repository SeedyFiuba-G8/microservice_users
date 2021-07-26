module.exports = function $metricService(
  adminRepository,
  errors,
  events,
  eventRepository,
  metricUtils,
  userRepository
) {
  return {
    getBasic,
    getEventsBetween
  };

  async function getBasic() {
    const [totalAdmins, totalUsers, bannedUsers] = await Promise.all([
      adminRepository.count(),
      userRepository.count(),
      userRepository.count({
        filters: {
          banned: true
        }
      })
    ]);

    return metricUtils.buildBasicMetrics({
      totalAdmins,
      totalUsers,
      bannedUsers
    });
  }

  async function getEventsBetween(rawInitialDate, rawFinalDate) {
    const { initialDate, finalDate } = parseDates(rawInitialDate, rawFinalDate);

    const eventNames = [
      'ADMIN_REGISTER',
      'ADMIN_LOGIN',
      'NATIVE_USER_REGISTER',
      'FEDERATE_USER_REGISTER',
      'NATIVE_USER_LOGIN',
      'FEDERATE_USER_LOGIN',
      'PASSWORD_RECOVERY',
      'USER_BANNED',
      'USER_UNBANNED'
    ];

    const [
      // Admins
      adminRegisters,
      adminLogins,

      // Users
      nativeUserRegisters,
      nativeUserLogins,
      federateUserRegisers,
      federateUserLogins,
      passwordRecoveries,
      newBannedUsers,
      newUnbannedUsers
    ] = await Promise.all(
      eventNames.map((event) =>
        eventRepository.count(events[event], initialDate, finalDate)
      )
    );

    return metricUtils.buildEventMetrics({
      // Admins
      adminRegisters,
      adminLogins,
      newBannedUsers,
      newUnbannedUsers,

      // Users
      nativeUserRegisters,
      nativeUserLogins,
      federateUserRegisers,
      federateUserLogins,
      passwordRecoveries
    });
  }

  // Aux
  function parseDates(rawInitialDate, rawFinalDate) {
    if (rawInitialDate === undefined || rawFinalDate === undefined)
      throw errors.create(400, 'Invalid dates');

    const initialDate = new Date(rawInitialDate);
    const finalDate = new Date(rawFinalDate);

    if (
      !isValidDate(initialDate) ||
      !isValidDate(finalDate) ||
      initialDate > finalDate ||
      finalDate > new Date()
    )
      throw errors.create(400, 'Invalid dates');

    return { initialDate, finalDate };
  }

  function isValidDate(d) {
    // eslint-disable-next-line
    return d instanceof Date && !isNaN(d);
  }
};

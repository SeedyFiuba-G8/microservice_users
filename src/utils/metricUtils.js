module.exports = function $metricUtils() {
  return {
    buildBasicMetrics,
    buildEventMetrics
  };

  function buildBasicMetrics({ totalAdmins, totalUsers, bannedUsers }) {
    return {
      admins: {
        total: totalAdmins
      },
      users: {
        total: totalUsers,
        banned: bannedUsers
      }
    };
  }

  function buildEventMetrics({
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
  }) {
    return {
      admins: {
        register: adminRegisters,
        login: adminLogins,
        ban: newBannedUsers,
        unban: newUnbannedUsers
      },
      users: {
        register: {
          native: nativeUserRegisters,
          federate: federateUserRegisers
        },
        login: {
          native: nativeUserLogins,
          federate: federateUserLogins
        },
        passwordRecovery: passwordRecoveries
      }
    };
  }
};

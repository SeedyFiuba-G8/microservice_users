const bcrypt = require('bcrypt');

module.exports = function $bcrypt(config) {
  return { compare, hash };

  /**
   * @param {String} plainTextPassword
   * @returns {Promise<Boolean>}
   */
  function compare(plainTextPassword, encryptedPassword) {
    return bcrypt.compare(plainTextPassword, encryptedPassword);
  }

  /**
   * @param {String} plainTextPassword
   * @returns {Promise<String>}
   */
  function hash(plainTextPassword) {
    const { saltRounds } = config.bcrypt;

    return bcrypt.hash(plainTextPassword, saltRounds);
  }
};

const emailValidator = require('email-validator');

module.exports = function $validationUtils(config, errors) {
  return {
    // Wrappers
    validateAdminRegisterData,
    validateLoginData,
    validateUpdatedUserData,
    validateUserRegisterData,

    // Validators
    validateByLength,
    validateEmail,
    validateInterests
  };

  function validateAdminRegisterData({ email, password }) {
    validateEmail(email);
    validateByLength('password', password);
  }

  function validateLoginData({ email, password }) {
    validateEmail(email);
    validateByLength('password', password);
  }

  function validateUpdatedUserData({
    city,
    country,
    interests,
    profilePicUrl
  }) {
    if (city) validateByLength('city', city);
    if (country) validateByLength('country', country);
    if (interests) validateInterests(interests);
    if (profilePicUrl) validateByLength('profilePicUrl', profilePicUrl);
  }

  function validateUserRegisterData({ email, password, firstName, lastName }) {
    validateEmail(email);
    validateByLength('password', password);
    validateByLength('firstName', firstName);
    validateByLength('lastName', lastName);
  }

  // Validators

  function validateByLength(field, value) {
    const minLength = config.constraints.fields[field].min;
    const maxLength = config.constraints.fields[field].max;

    if (!validLength({ field: value, minLength, maxLength }))
      throw errors.create(
        409,
        `Field ${field} is invalid: its length must be within ${minLength} and ${maxLength} chars.`
      );
  }

  function validateEmail(email) {
    validateByLength('email', email);

    if (!emailValidator.validate(email)) {
      throw errors.create(409, 'Email is invalid');
    }
  }

  function validateInterests(interests) {
    const maxInterests = config.constraints.fields.interests.max;

    if (interests.length > maxInterests)
      throw errors.create(
        409,
        `Any user may have up to ${maxInterests} interests.`
      );

    interests.forEach((interest) => {
      validateByLength('interest', interest);
    });
  }

  // Aux

  function validLength({ field, minLength, maxLength }) {
    let valid = true;
    if (minLength !== undefined) valid = valid && field.length >= minLength;
    if (maxLength !== undefined) valid = valid && field.length <= maxLength;

    return valid;
  }
};

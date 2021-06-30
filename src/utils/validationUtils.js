const emailValidator = require('email-validator');

module.exports = function $validationUtils(config, errors) {
  return {
    // Wrappers
    validateAdminRegisterData,
    validateLoginData,
    validateUserRegisterData,

    // Validators
    validateEmail,
    validateName,
    validatePassword
  };

  function validateAdminRegisterData({ email, password }) {
    validateEmail(email);
    validatePassword(password);
  }

  function validateLoginData({ email, password }) {
    validateEmail(email);
    validatePassword(password);
  }

  function validateUserRegisterData({ email, password, firstName, lastName }) {
    validateEmail(email);
    validatePassword(password);
    validateName(firstName, lastName);
  }

  // Validators

  function validateEmail(email) {
    const minLength = config.constraints.fields.email.min;
    const maxLength = config.constraints.fields.email.max;

    if (!validLength({ field: email, minLength, maxLength }))
      throw errors.create(
        409,
        `Email is invalid: its length must be within ${minLength} and ${maxLength} chars.`
      );

    if (!emailValidator.validate(email)) {
      throw errors.create(409, 'Email is invalid');
    }
  }

  function validateName(firstName, lastName) {
    let minLength = config.constraints.fields.firstName.min;
    let maxLength = config.constraints.fields.firstName.max;

    if (!validLength({ field: firstName, minLength, maxLength }))
      throw errors.create(
        409,
        `First name is invalid: its length must be within ${minLength} and ${maxLength} chars.`
      );

    minLength = config.constraints.fields.lastName.min;
    maxLength = config.constraints.fields.lastName.max;

    if (!validLength({ field: lastName, minLength, maxLength }))
      throw errors.create(
        409,
        `Last name is invalid: its length must be within ${minLength} and ${maxLength} chars.`
      );
  }

  function validatePassword(password) {
    const minLength = config.constraints.fields.password.min;
    const maxLength = config.constraints.fields.password.max;

    if (!validLength({ field: password, minLength, maxLength }))
      throw errors.create(
        409,
        `Password is invalid: its length must be within ${minLength} and ${maxLength} chars.`
      );
  }

  // Aux

  function validLength({ field, minLength, maxLength }) {
    let valid = true;
    if (minLength !== undefined) valid = valid && field.length >= minLength;
    if (maxLength !== undefined) valid = valid && field.length <= maxLength;

    return valid;
  }
};

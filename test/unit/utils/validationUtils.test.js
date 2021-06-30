const containerFactory = require('../../testContainerFactory');

const container = containerFactory.createContainer();

describe('validationUtils', () => {
  let validationUtils;

  beforeEach(() => {
    validationUtils = container.get('validationUtils');
  });

  describe('function validateEmail', () => {
    describe('when email is too short', () => {
      it('should throw error', () =>
        expect(() => validationUtils.validateEmail('a')).toThrow());
    });

    describe('when email is too long', () => {
      it('should throw error', () =>
        expect(() =>
          validationUtils.validateEmail(
            'veryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryverylong@email.com'
          )
        ).toThrow());
    });

    describe('when email is invalid', () => {
      it('should throw error', () =>
        expect(() => validationUtils.validateEmail('invalid')).toThrow());
    });

    describe('when email is valid', () => {
      it('should succeed silently', () =>
        expect(validationUtils.validateEmail('memis@pomofot.com')).toBe(
          undefined
        ));
    });
  });

  describe('function validateName', () => {
    describe('when firstName is too short', () => {
      it('should throw error', () =>
        expect(() => validationUtils.validateName('a', 'Pomofot')).toThrow());
    });

    describe('when lastName is too short', () => {
      it('should throw error', () =>
        expect(() => validationUtils.validateName('Memis', 'a')).toThrow());
    });

    describe('when firstName is too long', () => {
      it('should throw error', () =>
        expect(() =>
          validationUtils.validateName(
            'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            'Pomofot'
          )
        ).toThrow());
    });

    describe('when lastName is too long', () => {
      it('should throw error', () =>
        expect(() =>
          validationUtils.validateName(
            'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            'a'
          )
        ).toThrow());
    });

    describe('when name is valid', () => {
      it('should succeed silently', () =>
        expect(validationUtils.validateName('Memis', 'Pomofot')).toBe(
          undefined
        ));
    });
  });

  describe('function validatePassword', () => {
    describe('when password is too short', () => {
      it('should throw error', () =>
        expect(() => validationUtils.validatePassword('123')).toThrow());
    });

    describe('when password is too long', () => {
      it('should throw error', () =>
        expect(() =>
          validationUtils.validatePassword(
            'veryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryverylongpassword'
          )
        ).toThrow());
    });

    describe('when password is valid', () => {
      it('should succeed silently', () =>
        expect(validationUtils.validatePassword('UnaPassword123')).toBe(
          undefined
        ));
    });
  });
});

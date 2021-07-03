const containerFactory = require('../../testContainerFactory');

const container = containerFactory.createContainer();

describe('validationUtils', () => {
  let config;
  let validationUtils;

  beforeEach(() => {
    config = container.get('config');
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

  describe('function validateInterests', () => {
    let interests;
    beforeEach(() => {
      interests = ['music', 'movies', 'productivity'];
    });

    describe('when there are too many interests', () => {
      beforeEach(() => {
        const { max } = config.constraints.fields.interests;
        for (let i = 0; i < max + 1; i += 1) {
          interests.push(`interest ${i}`);
        }
      });

      it('should throw error', () =>
        expect(() => validationUtils.validateInterests(interests)).toThrow());
    });

    describe('when any interest is too long', () => {
      it('should throw error', () =>
        expect(() =>
          validationUtils.validateInterests([
            ...interests,
            'reallylonginterestbutreaaaaaaallylongliketoomuch'
          ])
        ).toThrow());
    });

    describe('when interests are valid', () => {
      it('should succeed silently', () =>
        expect(validationUtils.validateInterests(interests)).toBe(undefined));
    });
  });
});

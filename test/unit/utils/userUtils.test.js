const containerFactory = require('../../testContainerFactory');

const container = containerFactory.createContainer();

describe('userUtils', () => {
  let mockData;
  let user;
  let userUtils;

  beforeEach(() => {
    mockData = container.get('mockData');
    userUtils = container.get('userUtils');
    user = mockData.buildUser();
  });

  describe('function buildProfile', () => {
    const fields = [
      'firstName',
      'lastName',
      'banned',
      'signupDate',
      'city',
      'country',
      'interests'
    ];

    describe('when default user is passed', () => {
      it('should contain correct fields', () => {
        const result = userUtils.buildProfile(user);
        fields.forEach((field) => expect(result).toHaveProperty(field));
      });
    });

    describe('when full user is passed', () => {
      beforeEach(() => {
        user = mockData.buildUser({
          country: 'Brazil',
          city: 'Sao Paulo',
          interests: ['programming']
        });
      });

      it('should contain correct fields', () => {
        const result = userUtils.buildProfile(user);
        fields.forEach((field) => expect(result).toHaveProperty(field));
      });
    });
  });
});

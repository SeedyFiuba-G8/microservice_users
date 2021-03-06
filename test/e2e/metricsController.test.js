const supertest = require('supertest');
const containerFactory = require('../testContainerFactory');

const container = containerFactory.createContainer();

describe('metricsController', () => {
  let config;
  let request;
  let adminRepository;
  let eventRepository;
  let userRepository;
  let spyAdminRepository;
  let spyEventRepository;
  let spyUserRepository;

  // API Keys
  let fakeApikey;
  let apikeyHeader;

  beforeEach(() => {
    spyAdminRepository = {};
    spyEventRepository = {};
    spyUserRepository = {};
    config = container.get('config');
    adminRepository = container.get('adminRepository');
    eventRepository = container.get('eventRepository');
    userRepository = container.get('userRepository');
    request = supertest(container.get('app'));

    // API Keys
    fakeApikey = 'fake-apikey';
    apikeyHeader = config.services.apikeys.header;
  });

  beforeEach(() => {
    // Mock values for events
    jest.spyOn(eventRepository, 'log').mockImplementationOnce(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('/metrics', () => {
    const path = '/metrics';
    const values = {
      admins: {
        total: 5
      },
      users: {
        total: 400,
        banned: 50
      }
    };

    describe('GET', () => {
      describe('when get metrics is called', () => {
        beforeEach(() => {
          spyUserRepository.count = jest
            .spyOn(userRepository, 'count')
            .mockImplementation(({ filters = {} } = {}) => {
              if (filters && filters.banned) return values.users.banned;
              return values.users.total;
            });
          spyAdminRepository.count = jest
            .spyOn(adminRepository, 'count')
            .mockImplementationOnce(() => values.admins.total);
        });

        it('returns expected status 200 and metrics body', () =>
          request
            .get(path)
            .set(apikeyHeader, fakeApikey)
            .expect('Content-Type', /json/)
            .expect(200, values));

        it('should have called userRepository.count and adminRepository.count once (each)', async () => {
          await request.get(path).set(apikeyHeader, fakeApikey);

          expect(spyUserRepository.count).toHaveBeenCalledTimes(2);
          expect(spyAdminRepository.count).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe('/metrics/events', () => {
    const path = '/metrics/events';

    describe('GET', () => {
      describe('when query params are invalid (not date-time)', () => {
        it('should return error code 400', () =>
          request
            .get(path)
            .set(apikeyHeader, fakeApikey)
            .query({
              initialDate: 'anInvalidInitialDate',
              finalDate: 'anotherInvalidDate'
            })
            .expect('Content-Type', /json/)
            .expect(400));
      });

      describe('when date values are invalid', () => {
        it('should return error code 400', () =>
          request
            .get(path)
            .set(apikeyHeader, fakeApikey)
            .query({
              initialDate: '2020-06-13T21:29:29.330Z',
              finalDate: '2040-06-13T21:29:29.330Z'
            })
            .expect('Content-Type', /json/)
            .expect(400));
      });

      describe('when dates values are valid', () => {
        const validInitialDate = '2020-06-13T21:29:29.330Z';
        const validFinalDate = '2021-03-13T21:29:29.330Z';

        beforeEach(() => {
          const eventValues = 10;
          spyEventRepository.count = jest
            .spyOn(eventRepository, 'count')
            .mockReturnValue(eventValues);
        });

        it('should return code 200 and 10 for every value', () =>
          request
            .get(path)
            .set(apikeyHeader, fakeApikey)
            .query({
              initialDate: validInitialDate,
              finalDate: validFinalDate
            })
            .expect('Content-Type', /json/)
            .expect(200, {
              admins: {
                register: 10,
                login: 10,
                ban: 10,
                unban: 10
              },
              users: {
                register: {
                  native: 10,
                  federate: 10
                },
                login: {
                  native: 10,
                  federate: 10
                },
                passwordRecovery: 10
              }
            }));

        it('should have called eventRepository.count events.lenght times', async () => {
          await request.get(path).set(apikeyHeader, fakeApikey).query({
            initialDate: validInitialDate,
            finalDate: validFinalDate
          });

          expect(spyEventRepository.count).toHaveBeenCalledTimes(
            Object.keys(config.events).length
          );
        });
      });
    });
  });
});

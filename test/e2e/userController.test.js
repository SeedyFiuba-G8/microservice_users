const _ = require('lodash');
const supertest = require('supertest');
const containerFactory = require('../testContainerFactory');

const container = containerFactory.createContainer();

describe('userController', () => {
  let errors;
  let mockData;
  let request;
  let res;
  let userNocks;
  let userRepository;

  const spyUserRepository = {};

  beforeEach(() => {
    errors = container.get('errors');
    mockData = container.get('mockData');
    userNocks = container.get('userNocks');
    userRepository = container.get('userRepository');
    request = supertest(container.get('app'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users', () => {
    describe('when there are users', () => {
      beforeEach(async () => {
        spyUserRepository.getAll = jest
          .spyOn(userRepository, 'getAll')
          .mockReturnValue(mockData.users);

        res = await request.get('/users');
      });

      it('should respond with correct status and body', () => {
        expect(res.status).toEqual(200);
        expect(res.header['content-type']).toMatch(/json/);
        expect(res.body).toEqual({ users: mockData.parsedUsers });
      });

      it('should have called userRepository once', () =>
        expect(spyUserRepository.getAll).toHaveBeenCalledTimes(1));
    });

    describe('when there are no users', () => {
      beforeEach(async () => {
        spyUserRepository.getAll = jest
          .spyOn(userRepository, 'getAll')
          .mockReturnValue([]);

        res = await request.get('/users');
      });

      it('should respond with correct status and body', () => {
        expect(res.status).toEqual(200);
        expect(res.header['content-type']).toMatch(/json/);
        expect(res.body).toEqual({ users: [] });
      });

      it('should have called userRepository once', () =>
        expect(spyUserRepository.getAll).toHaveBeenCalledTimes(1));
    });
  });

  describe('POST /users', () => {
    let registerData;

    beforeEach(() => {
      registerData = {
        email: 'memispomofot@gmail.com',
        password: 'UnaPassword123',
        firstName: 'Memis',
        lastName: 'Pomofot'
      };
    });

    describe('when no body is provided', () => {
      it('should fail with status 415', () =>
        request.post('/users').expect(415));
    });

    describe('when body is invalid', () => {
      it('should fail with status 400', () =>
        request
          .post('/users')
          .send({
            faltan: 'cosas'
          })
          .expect(400));
    });

    describe('when registration data is valid', () => {
      describe('when email is already used', () => {
        beforeEach(async () => {
          spyUserRepository.create = jest
            .spyOn(userRepository, 'create')
            .mockImplementation(() => {
              throw errors.create(409, 'Email already in use');
            });

          res = await request.post('/users').send(registerData);
        });

        it('should fail with status 409', () =>
          expect(res.status).toEqual(409));

        it('should have called userRepository.create correctly', () => {
          expect(spyUserRepository.create).toHaveBeenCalledTimes(1);
          expect(spyUserRepository.create).toHaveBeenCalledWith(
            expect.objectContaining(_.omit(registerData, 'password'))
          );
        });
      });

      describe('when email is not used', () => {
        beforeEach(async () => {
          spyUserRepository.create = jest
            .spyOn(userRepository, 'create')
            .mockReturnValue(undefined);

          res = await request.post('/users').send(registerData);
        });

        it('should succeed with status 201', () =>
          expect(res.status).toEqual(201));

        it('should have called userRepository.create correctly', () => {
          expect(spyUserRepository.create).toHaveBeenCalledTimes(1);
          expect(spyUserRepository.create).toHaveBeenCalledWith(
            expect.objectContaining(_.omit(registerData, 'password'))
          );
        });
      });
    });
  });

  describe('POST /users/session', () => {
    let loginData;
    let user;

    describe('when no body is provided', () => {
      it('should fail with status 415', () =>
        request.post('/users/session').expect(415));
    });

    describe('when body is invalid', () => {
      it('should fail with status 400', () =>
        request
          .post('/users/session')
          .send({
            faltan: 'cosas'
          })
          .expect(400));
    });

    describe('when logging with native credentials', () => {
      beforeEach(() => {
        loginData = {
          email: 'user@user.com',
          password: 'user'
        };

        user = {
          id: 'ca718a21-a126-484f-bc50-145126a6f75b',
          email: 'user@user.com',
          password:
            '$2b$10$R3YT8/4SxWGfajHg6lSJ3eLw2ASxqeO8kOhtN2t3h2RzBUln3YjEa',
          banned: false
        };
      });

      describe('when email is not registered', () => {
        beforeEach(async () => {
          spyUserRepository.get = jest
            .spyOn(userRepository, 'get')
            .mockReturnValue([]);

          res = await request.post('/users/session').send(loginData);
        });

        it('should fail with status 409', () =>
          expect(res.status).toEqual(409));

        it('should have called userRepository.get correctly', () => {
          expect(spyUserRepository.get).toHaveBeenCalledTimes(1);
          expect(spyUserRepository.get).toHaveBeenCalledWith(loginData.email);
        });
      });

      describe('when email is registered', () => {
        beforeEach(() => {
          spyUserRepository.get = jest
            .spyOn(userRepository, 'get')
            .mockReturnValue([user]);
        });

        describe('when password is incorrect', () => {
          beforeEach(async () => {
            res = await request
              .post('/users/session')
              .send({ ...loginData, password: 'incorrect' });
          });

          it('should fail with status 409', () =>
            expect(res.status).toEqual(409));

          it('should have called userRepository.get correctly', () => {
            expect(spyUserRepository.get).toHaveBeenCalledTimes(1);
            expect(spyUserRepository.get).toHaveBeenCalledWith(loginData.email);
          });
        });

        describe('when password is correct', () => {
          describe('when user is banned', () => {
            beforeEach(async () => {
              spyUserRepository.get = jest
                .spyOn(userRepository, 'get')
                .mockReturnValue([{ ...user, banned: true }]);

              res = await request.post('/users/session').send(loginData);
            });

            it('should fail with status 409', () =>
              expect(res.status).toEqual(409));

            it('should have called userRepository.get correctly', () => {
              expect(spyUserRepository.get).toHaveBeenCalledTimes(1);
              expect(spyUserRepository.get).toHaveBeenCalledWith(
                loginData.email
              );
            });
          });

          describe('when user is not banned', () => {
            it('should respond with correct status and body', () =>
              request
                .post('/users/session')
                .send(loginData)
                .expect('Content-Type', /json/)
                .expect(200, { id: user.id }));

            it('should have called userRepository.get correctly', async () => {
              await request.post('/users/session').send(loginData);

              expect(spyUserRepository.get).toHaveBeenCalledTimes(1);
              expect(spyUserRepository.get).toHaveBeenCalledWith(
                loginData.email
              );
            });
          });
        });
      });
    });

    describe('when logging with facebook token', () => {
      let fbUserInfo;

      beforeEach(() => {
        fbUserInfo = {
          email: 'mauris@boke.com',
          id: '234234234253154',
          first_name: 'Mauro',
          last_name: 'ElMasCapo'
        };

        loginData = {
          fbToken: 'ElTokenDeMaurisElMasCapo'
        };

        user = {
          id: 'ca718a21-a126-484f-bc50-145126a6f75b',
          email: 'mauris@boke.com',
          firstName: 'Mauro',
          lastName: 'ElMasCapo',
          banned: false
        };

        userNocks.nockFbUserInfo(loginData.fbToken, fbUserInfo);
      });

      describe('when user fbId is not registered (register)', () => {
        beforeEach(async () => {
          spyUserRepository.getByFbId = jest
            .spyOn(userRepository, 'getByFbId')
            .mockReturnValue([]);

          spyUserRepository.create = jest
            .spyOn(userRepository, 'create')
            .mockReturnValue(undefined);

          res = await request.post('/users/session').send(loginData);
        });

        it('should respond with correct status and body', () => {
          expect(res.status).toEqual(200);
          expect(res.body).toEqual({
            id: expect.any(String)
          });
        });

        it('should have called userRepository.getByFbId correctly', () => {
          expect(spyUserRepository.getByFbId).toHaveBeenCalledTimes(1);
          expect(spyUserRepository.getByFbId).toHaveBeenCalledWith(
            fbUserInfo.id
          );
        });

        it('should have called userRepository.create correctly', () => {
          expect(spyUserRepository.create).toHaveBeenCalledTimes(1);
          expect(spyUserRepository.create).toHaveBeenCalledWith({
            email: fbUserInfo.email,
            id: expect.any(String),
            fbId: fbUserInfo.id,
            firstName: fbUserInfo.first_name,
            lastName: fbUserInfo.last_name
          });
        });
      });

      describe('when user fbId is already registered (login)', () => {
        describe('when user is banned', () => {
          beforeEach(async () => {
            spyUserRepository.getByFbId = jest
              .spyOn(userRepository, 'getByFbId')
              .mockReturnValue([{ ...user, banned: true }]);

            res = await request.post('/users/session').send(loginData);
          });

          it('should fail with status 409', () =>
            expect(res.status).toEqual(409));

          it('should have called userRepository.getByFbId correctly', () => {
            expect(spyUserRepository.getByFbId).toHaveBeenCalledTimes(1);
            expect(spyUserRepository.getByFbId).toHaveBeenCalledWith(
              fbUserInfo.id
            );
          });
        });

        describe('when user is not banned', () => {
          beforeEach(() => {
            spyUserRepository.getByFbId = jest
              .spyOn(userRepository, 'getByFbId')
              .mockReturnValue([user]);
          });

          it('should respond with correct status and body', () =>
            request
              .post('/users/session')
              .send(loginData)
              .expect('Content-Type', /json/)
              .expect(200, { id: user.id }));

          it('should have called userRepository.getByFbId correctly', async () => {
            await request.post('/users/session').send(loginData);

            expect(spyUserRepository.getByFbId).toHaveBeenCalledTimes(1);
            expect(spyUserRepository.getByFbId).toHaveBeenCalledWith(
              fbUserInfo.id
            );
          });
        });
      });
    });
  });
});

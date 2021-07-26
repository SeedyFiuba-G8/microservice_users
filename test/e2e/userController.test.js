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
  let eventRepository;

  const spyUserRepository = {};

  beforeEach(() => {
    errors = container.get('errors');
    mockData = container.get('mockData');
    userNocks = container.get('userNocks');
    userRepository = container.get('userRepository');
    eventRepository = container.get('eventRepository');
    request = supertest(container.get('app'));
  });

  beforeEach(() => {
    // Mock values for events
    jest.spyOn(eventRepository, 'log').mockImplementationOnce(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('/users', () => {
    const path = '/users';

    describe('GET', () => {
      describe('when there are users', () => {
        beforeEach(async () => {
          spyUserRepository.get = jest
            .spyOn(userRepository, 'get')
            .mockReturnValueOnce(mockData.users);

          res = await request.get(path);
        });

        it('should respond with correct status and body', () => {
          expect(res.status).toEqual(200);
          expect(res.header['content-type']).toMatch(/json/);
          expect(res.body).toEqual({ users: mockData.users });
        });

        it('should have called userRepository once', () => {
          expect(spyUserRepository.get).toHaveBeenCalledTimes(1);
          expect(spyUserRepository.get).toHaveBeenCalledWith({
            filters: {},
            limit: undefined,
            offset: undefined,
            select: [
              'id',
              'email',
              'banned',
              'firstName',
              'lastName',
              'signupDate'
            ]
          });
        });
      });

      describe('when there are no users', () => {
        beforeEach(async () => {
          spyUserRepository.get = jest
            .spyOn(userRepository, 'get')
            .mockReturnValueOnce([]);

          res = await request.get(path);
        });

        it('should respond with correct status and body', () => {
          expect(res.status).toEqual(200);
          expect(res.header['content-type']).toMatch(/json/);
          expect(res.body).toEqual({ users: [] });
        });

        it('should have called userRepository once', () => {
          expect(spyUserRepository.get).toHaveBeenCalledTimes(1);
          expect(spyUserRepository.get).toHaveBeenCalledWith({
            filters: {},
            limit: undefined,
            offset: undefined,
            select: [
              'id',
              'email',
              'banned',
              'firstName',
              'lastName',
              'signupDate'
            ]
          });
        });
      });
    });

    describe('POST', () => {
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
        it('should fail with status 415', () => request.post(path).expect(415));
      });

      describe('when body is invalid', () => {
        it('should fail with status 400', () =>
          request
            .post(path)
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
              .mockImplementationOnce(() => {
                throw errors.create(409, 'Email already in use');
              });

            res = await request.post(path).send(registerData);
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
              .mockReturnValueOnce(undefined);

            res = await request.post(path).send(registerData);
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
  });

  describe('/users/session', () => {
    const path = '/users/session';

    describe('POST', () => {
      let loginData;
      let user;

      describe('when no body is provided', () => {
        it('should fail with status 415', () => request.post(path).expect(415));
      });

      describe('when body is invalid', () => {
        it('should fail with status 400', () =>
          request
            .post(path)
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
              .mockReturnValueOnce([]);

            res = await request.post(path).send(loginData);
          });

          it('should fail with status 409', () =>
            expect(res.status).toEqual(409));

          it('should have called userRepository.get correctly', () => {
            expect(spyUserRepository.get).toHaveBeenCalledTimes(1);
            expect(spyUserRepository.get).toHaveBeenCalledWith({
              filters: {
                email: loginData.email
              }
            });
          });
        });

        describe('when email is registered', () => {
          describe('when password is incorrect', () => {
            beforeEach(async () => {
              spyUserRepository.get = jest
                .spyOn(userRepository, 'get')
                .mockReturnValueOnce([user]);

              res = await request
                .post(path)
                .send({ ...loginData, password: 'incorrect' });
            });

            it('should fail with status 409', () =>
              expect(res.status).toEqual(409));

            it('should have called userRepository.get correctly', () => {
              expect(spyUserRepository.get).toHaveBeenCalledTimes(1);
              expect(spyUserRepository.get).toHaveBeenCalledWith({
                filters: {
                  email: loginData.email
                }
              });
            });
          });

          describe('when password is correct', () => {
            describe('when user is banned', () => {
              beforeEach(async () => {
                spyUserRepository.get = jest
                  .spyOn(userRepository, 'get')
                  .mockReturnValueOnce([{ ...user, banned: true }]);

                res = await request.post(path).send(loginData);
              });

              it('should fail with status 409', () =>
                expect(res.status).toEqual(409));

              it('should have called userRepository.get correctly', () => {
                expect(spyUserRepository.get).toHaveBeenCalledTimes(1);
                expect(spyUserRepository.get).toHaveBeenCalledWith({
                  filters: {
                    email: loginData.email
                  }
                });
              });
            });

            describe('when user is not banned', () => {
              beforeEach(async () => {
                spyUserRepository.get = jest
                  .spyOn(userRepository, 'get')
                  .mockReturnValueOnce([user]);
              });

              it('should respond with correct status and body', () =>
                request
                  .post(path)
                  .send(loginData)
                  .expect('Content-Type', /json/)
                  .expect(200, { id: user.id }));

              it('should have called userRepository.get correctly', async () => {
                await request.post(path).send(loginData);

                expect(spyUserRepository.get).toHaveBeenCalledTimes(1);
                expect(spyUserRepository.get).toHaveBeenCalledWith({
                  filters: {
                    email: loginData.email
                  }
                });
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
            spyUserRepository.get = jest
              .spyOn(userRepository, 'get')
              .mockReturnValueOnce([]);

            spyUserRepository.create = jest
              .spyOn(userRepository, 'create')
              .mockReturnValueOnce(undefined);

            res = await request.post(path).send(loginData);
          });

          it('should respond with correct status and body', () => {
            expect(res.status).toEqual(200);
            expect(res.body).toEqual({
              id: expect.any(String)
            });
          });

          it('should have called userRepository.get correctly', () => {
            expect(spyUserRepository.get).toHaveBeenCalledTimes(1);
            expect(spyUserRepository.get).toHaveBeenCalledWith({
              filters: {
                fbId: fbUserInfo.id
              }
            });
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
              spyUserRepository.get = jest
                .spyOn(userRepository, 'get')
                .mockReturnValueOnce([{ ...user, banned: true }]);

              res = await request.post(path).send(loginData);
            });

            it('should fail with status 409', () =>
              expect(res.status).toEqual(409));

            it('should have called userRepository.getByFbId correctly', () => {
              expect(spyUserRepository.get).toHaveBeenCalledTimes(1);
              expect(spyUserRepository.get).toHaveBeenCalledWith({
                filters: {
                  fbId: fbUserInfo.id
                }
              });
            });
          });

          describe('when user is not banned', () => {
            beforeEach(() => {
              spyUserRepository.get = jest
                .spyOn(userRepository, 'get')
                .mockReturnValueOnce([user]);
            });

            it('should respond with correct status and body', () =>
              request
                .post(path)
                .send(loginData)
                .expect('Content-Type', /json/)
                .expect(200, { id: user.id }));

            it('should have called userRepository.get correctly', async () => {
              await request.post(path).send(loginData);

              expect(spyUserRepository.get).toHaveBeenCalledTimes(1);
              expect(spyUserRepository.get).toHaveBeenCalledWith({
                filters: {
                  fbId: fbUserInfo.id
                }
              });
            });
          });
        });
      });
    });
  });

  describe('/users/:userId', () => {
    const pathForUserId = (userId) => `/users/${userId}`;
    const validUUID = '123e4567-e89b-12d3-a456-426614174000';
    const path = pathForUserId(validUUID);

    describe('GET', () => {
      describe('when :userId param format is invalid', () => {
        it('should fail with 400', () =>
          request
            .get(pathForUserId('invalidUUID'))
            .expect('Content-Type', /json/)
            .expect(400));
      });

      describe('when :userId param is valid', () => {
        describe('when user does not exist', () => {
          beforeEach(
            () =>
              (spyUserRepository.get = jest
                .spyOn(userRepository, 'get')
                .mockReturnValueOnce([]))
          );

          it('should fail with 404', () =>
            request.get(path).expect('Content-Type', /json/).expect(404));

          it('should have called userRepository once', async () => {
            await request.get(path);

            expect(spyUserRepository.get).toHaveBeenCalledTimes(1);
            expect(spyUserRepository.get).toHaveBeenCalledWith({
              filters: {
                id: validUUID
              },
              select: [
                'firstName',
                'lastName',
                'banned',
                'signupDate',
                'city',
                'country',
                'interests',
                'profilePicUrl'
              ]
            });
          });
        });

        describe('when user exists', () => {
          let profile;

          beforeEach(() => {
            const user = mockData.buildUser({ id: validUUID });
            profile = mockData.buildProfile(user);

            spyUserRepository.get = jest
              .spyOn(userRepository, 'get')
              .mockReturnValueOnce([
                _.pick(user, [
                  'firstName',
                  'lastName',
                  'banned',
                  'signupDate',
                  'city',
                  'country',
                  'interests',
                  'profilePicUrl'
                ])
              ]);
          });

          it('should respond with correct status and body', () =>
            request
              .get(path)
              .expect('Content-Type', /json/)
              .expect(200, profile));

          it('should have called userRepository once', async () => {
            await request.get(path);

            expect(spyUserRepository.get).toHaveBeenCalledTimes(1);
            expect(spyUserRepository.get).toHaveBeenCalledWith({
              filters: {
                id: validUUID
              },
              select: [
                'firstName',
                'lastName',
                'banned',
                'signupDate',
                'city',
                'country',
                'interests',
                'profilePicUrl'
              ]
            });
          });
        });
      });
    });

    describe('PATCH', () => {
      describe('when :userId param format is invalid', () => {
        it('should fail with 400', () =>
          request
            .patch(pathForUserId('invalidUUID'))
            .set('uid', validUUID)
            .send({ country: 'Argentina' })
            .expect('Content-Type', /json/)
            .expect(400));
      });

      describe('when no body is provided', () => {
        it('should fail with status 415', () =>
          request.patch(path).set('uid', validUUID).send().expect(415));
      });

      describe('when body is invalid', () => {
        it('should fail with status 400', () =>
          request
            .patch(path)
            .set('uid', validUUID)
            .send({
              faltan: 'cosas'
            })
            .expect(400));
      });

      describe('when no uid header is provided', () => {
        it('should fail with status 400', () =>
          request.patch(path).send({ country: 'Argentina' }).expect(400));
      });

      describe('when request is valid', () => {
        const body = {
          city: 'Buenos Aires',
          country: 'Argentina',
          interests: ['movies', 'pictures'],
          profilePicUrl:
            'https://cdn.computerhoy.com/sites/navi.axelspringer.es/public/styles/1200/public/media/image/2018/08/fotos-perfil-whatsapp_16.jpg?itok=fl2H3Opv'
        };

        describe('when requester is not the user', () => {
          it('should fail with status 403', () =>
            request
              .patch(path)
              .set('uid', validUUID.replace('1', '3'))
              .send(body)
              .expect(403));
        });

        describe('when user does not exist', () => {
          beforeEach(
            () =>
              (spyUserRepository.update = jest
                .spyOn(userRepository, 'update')
                .mockImplementationOnce(() => {
                  throw errors.create(404, 'User not found');
                }))
          );

          it('should fail with 404', () =>
            request.patch(path).set('uid', validUUID).send(body).expect(404));

          it('should have called userRepository once', async () => {
            await request.patch(path).set('uid', validUUID).send(body);

            expect(spyUserRepository.update).toHaveBeenCalledTimes(1);
            expect(spyUserRepository.update).toHaveBeenCalledWith(
              validUUID,
              body
            );
          });
        });

        describe('when user exists', () => {
          beforeEach(
            () =>
              (spyUserRepository.update = jest
                .spyOn(userRepository, 'update')
                .mockReturnValueOnce(undefined))
          );

          it('should respond with correct status and body', () =>
            request.patch(path).set('uid', validUUID).send(body).expect(200));

          it('should have called userRepository once', async () => {
            await request.patch(path).set('uid', validUUID).send(body);

            expect(spyUserRepository.update).toHaveBeenCalledTimes(1);
            expect(spyUserRepository.update).toHaveBeenCalledWith(
              validUUID,
              body
            );
          });
        });
      });
    });
  });
});

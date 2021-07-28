const _ = require('lodash');
const supertest = require('supertest');
const containerFactory = require('../testContainerFactory');

const container = containerFactory.createContainer();

describe('userController', () => {
  let config;
  let errors;
  let mockData;
  let request;
  let res;
  let userNocks;
  let userRepository;
  let eventRepository;
  let spyUserRepository;

  // API Keys
  let fakeApikey;
  let apikeyHeader;

  beforeEach(() => {
    spyUserRepository = {};
    config = container.get('config');
    errors = container.get('errors');
    mockData = container.get('mockData');
    userNocks = container.get('userNocks');
    userRepository = container.get('userRepository');
    eventRepository = container.get('eventRepository');
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

  describe('/users', () => {
    const path = '/users';

    describe('GET', () => {
      describe('when there are users', () => {
        beforeEach(async () => {
          spyUserRepository.get = jest
            .spyOn(userRepository, 'get')
            .mockReturnValueOnce(mockData.users);

          res = await request.get(path).set(apikeyHeader, fakeApikey);
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

          res = await request.get(path).set(apikeyHeader, fakeApikey);
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
        it('should fail with status 415', () =>
          request.post(path).set(apikeyHeader, fakeApikey).expect(415));
      });

      describe('when body is invalid', () => {
        it('should fail with status 400', () =>
          request
            .post(path)
            .set(apikeyHeader, fakeApikey)
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

            res = await request
              .post(path)
              .set(apikeyHeader, fakeApikey)
              .send(registerData);
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

            res = await request
              .post(path)
              .set(apikeyHeader, fakeApikey)
              .send(registerData);
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
        it('should fail with status 415', () =>
          request.post(path).set(apikeyHeader, fakeApikey).expect(415));
      });

      describe('when body is invalid', () => {
        it('should fail with status 400', () =>
          request
            .post(path)
            .set(apikeyHeader, fakeApikey)
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

            res = await request
              .post(path)
              .set(apikeyHeader, fakeApikey)
              .send(loginData);
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
                .set(apikeyHeader, fakeApikey)
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

                res = await request
                  .post(path)
                  .set(apikeyHeader, fakeApikey)
                  .send(loginData);
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
                  .set(apikeyHeader, fakeApikey)
                  .send(loginData)
                  .expect('Content-Type', /json/)
                  .expect(200, { id: user.id }));

              it('should have called userRepository.get correctly', async () => {
                await request
                  .post(path)
                  .set(apikeyHeader, fakeApikey)
                  .send(loginData);

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

            res = await request
              .post(path)
              .set(apikeyHeader, fakeApikey)
              .send(loginData);
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

              res = await request
                .post(path)
                .set(apikeyHeader, fakeApikey)
                .send(loginData);
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
                .set(apikeyHeader, fakeApikey)
                .send(loginData)
                .expect('Content-Type', /json/)
                .expect(200, { id: user.id }));

            it('should have called userRepository.get correctly', async () => {
              await request
                .post(path)
                .set(apikeyHeader, fakeApikey)
                .send(loginData);

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
            .set(apikeyHeader, fakeApikey)
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
            request
              .get(path)
              .set(apikeyHeader, fakeApikey)
              .expect('Content-Type', /json/)
              .expect(404));

          it('should have called userRepository once', async () => {
            await request.get(path).set(apikeyHeader, fakeApikey);

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
              .set(apikeyHeader, fakeApikey)
              .expect('Content-Type', /json/)
              .expect(200, profile));

          it('should have called userRepository once', async () => {
            await request.get(path).set(apikeyHeader, fakeApikey);

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
            .set(apikeyHeader, fakeApikey)
            .set('uid', validUUID)
            .send({ country: 'Argentina' })
            .expect('Content-Type', /json/)
            .expect(400));
      });

      describe('when no body is provided', () => {
        it('should fail with status 415', () =>
          request
            .patch(path)
            .set(apikeyHeader, fakeApikey)
            .set('uid', validUUID)
            .send()
            .expect(415));
      });

      describe('when body is invalid', () => {
        it('should fail with status 400', () =>
          request
            .patch(path)
            .set(apikeyHeader, fakeApikey)
            .set('uid', validUUID)
            .send({
              faltan: 'cosas'
            })
            .expect(400));
      });

      describe('when no uid header is provided', () => {
        it('should fail with status 400', () =>
          request
            .patch(path)
            .set(apikeyHeader, fakeApikey)
            .send({ country: 'Argentina' })
            .expect(400));
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
              .set(apikeyHeader, fakeApikey)
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
            request
              .patch(path)
              .set(apikeyHeader, fakeApikey)
              .set('uid', validUUID)
              .send(body)
              .expect(404));

          it('should have called userRepository once', async () => {
            await request
              .patch(path)
              .set(apikeyHeader, fakeApikey)
              .set('uid', validUUID)
              .send(body);

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
            request
              .patch(path)
              .set(apikeyHeader, fakeApikey)
              .set('uid', validUUID)
              .send(body)
              .expect(200));

          it('should have called userRepository once', async () => {
            await request
              .patch(path)
              .set(apikeyHeader, fakeApikey)
              .set('uid', validUUID)
              .send(body);

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

  describe('/users/:userId/ban', () => {
    const pathForUserId = (userId) => `/users/${userId}/ban`;
    const validUUID = '123e4567-e89b-12d3-a456-426614174000';
    const path = pathForUserId(validUUID);

    describe('POST', () => {
      describe('when :userId param format is invalid', () => {
        it('should fail with 400', () =>
          request
            .post(pathForUserId('invalidUUID'))
            .set(apikeyHeader, fakeApikey)
            .expect('Content-Type', /json/)
            .expect(400));
      });

      describe('when :userId param is valid, and unbanned user exists', () => {
        beforeEach(
          () =>
            (spyUserRepository.update = jest
              .spyOn(userRepository, 'update')
              .mockReturnValueOnce(undefined))
        );

        it('should respond with correct status (and empty body)', () => {
          request
            .post(path)
            .set(apikeyHeader, fakeApikey)
            .expect('Content-Type', /json/)
            .expect(204, {});
        });

        it('should have called userRespository once with ban = True', async () => {
          await request.post(path).set(apikeyHeader, fakeApikey);

          expect(spyUserRepository.update).toHaveBeenCalledTimes(1);
          expect(spyUserRepository.update).toHaveBeenCalledWith(
            validUUID,
            { banned: true },
            { banned: false }
          );
        });
      });
    });

    describe('DELETE', () => {
      describe('when :userId para is valid, and banned user exists', () => {
        beforeEach(
          () =>
            (spyUserRepository.update = jest
              .spyOn(userRepository, 'update')
              .mockReturnValueOnce(undefined))
        );

        it('should respond with correct status (and empty body)', () => {
          request
            .delete(path)
            .set(apikeyHeader, fakeApikey)
            .expect('Content-Type', /json/)
            .expect(204, {});
        });

        it('should have called userRespository once with ban = True', async () => {
          await request.delete(path).set(apikeyHeader, fakeApikey);

          expect(spyUserRepository.update).toHaveBeenCalledTimes(1);
          expect(spyUserRepository.update).toHaveBeenCalledWith(
            validUUID,
            { banned: false },
            { banned: true }
          );
        });
      });
    });
  });

  describe('/idtranslation', () => {
    const path = '/idtranslation';

    describe('POST', () => {
      describe('when no body is provided', () => {
        it('should fail with status 415', () =>
          request.post(path).set(apikeyHeader, fakeApikey).expect(415));
      });

      describe('when body is invalid', () => {
        it('should fail with status 400', () =>
          request
            .post(path)
            .set(apikeyHeader, fakeApikey)
            .send(['hello', 'world'])
            .expect(400));
      });

      describe('when body is valid, and one translation is requested', () => {
        beforeEach(() => {
          spyUserRepository.translateIds = jest
            .spyOn(userRepository, 'translateIds')
            .mockImplementationOnce((idsList) => {
              if (idsList[0] === '123e4567-e89b-12d3-a456-426614174000') {
                return [
                  {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    email: 'mail@mail.org',
                    first_name: 'FirstName',
                    last_name: 'LastName'
                  }
                ];
              }
              return [];
            });
        });

        describe('when requested UUID exists', () => {
          it('should return with code 200 and that user´s information', () =>
            request
              .post(path)
              .set(apikeyHeader, fakeApikey)
              .send(['123e4567-e89b-12d3-a456-426614174000'])
              .expect('Content-Type', /json/)
              .expect(200, {
                '123e4567-e89b-12d3-a456-426614174000': {
                  email: 'mail@mail.org',
                  firstName: 'FirstName',
                  lastName: 'LastName'
                }
              }));

          it('should have called usersRespository once', async () => {
            await request
              .post(path)
              .set(apikeyHeader, fakeApikey)
              .send(['123e4567-e89b-12d3-a456-000000000000']);

            expect(spyUserRepository.translateIds).toHaveBeenCalledTimes(1);
          });
        });

        describe('when requested UUID does not exist', () => {
          it('should return with code 200 and an empty array', () => {
            request
              .post(path)
              .set(apikeyHeader, fakeApikey)
              .send(['123e4567-e89b-12d3-a456-000000000000'])
              .expect('Content-Type', /json/)
              .expect(200, {});
          });

          it('should have called usersRespository once', async () => {
            await request
              .post(path)
              .set(apikeyHeader, fakeApikey)
              .send(['123e4567-e89b-12d3-a456-000000000000']);

            expect(spyUserRepository.translateIds).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });

  describe('/emailtranslation', () => {
    const path = '/emailtranslation';
    const validemail = 'mail@mail.com';

    describe('POST', () => {
      beforeEach(() => {
        spyUserRepository.translateEmails = jest
          .spyOn(userRepository, 'translateEmails')
          .mockImplementationOnce((idsList) => {
            if (idsList[0] === validemail) {
              return [{ id: '123e4567-e89b-12d3-a456-426614174000' }];
            }
            return [];
          });
      });

      describe('when given email exists', () => {
        it('should return with code 200 and one UUID', () => {
          request
            .post(path)
            .set(apikeyHeader, fakeApikey)
            .send([validemail])
            .expect('Content-Type', /json/)
            .expect(200, ['123e4567-e89b-12d3-a456-426614174000']);
        });

        it('should have called usersRespository once', async () => {
          await request
            .post(path)
            .set(apikeyHeader, fakeApikey)
            .send([validemail]);

          expect(spyUserRepository.translateEmails).toHaveBeenCalledTimes(1);
        });
      });

      describe('when given email doesn´t exist', () => {
        it('should return with code 200 and an empty list', () => {
          request
            .post(path)
            .set(apikeyHeader, fakeApikey)
            .send(['some@invalid.email'])
            .expect('Content-Type', /json/)
            .expect(200, []);
        });

        it('should have called usersRespository once', async() => {
          await request
            .post(path)
            .set(apikeyHeader, fakeApikey)
            .send(['some@invalid.email']);

          expect(spyUserRepository.translateEmails).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});

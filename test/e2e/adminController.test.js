const _ = require('lodash');
const supertest = require('supertest');
const containerFactory = require('../testContainerFactory');

const container = containerFactory.createContainer();

describe('adminController', () => {
  let adminRepository;
  let errors;
  let request;
  let res;

  const spyAdminRepository = {};

  beforeEach(() => {
    adminRepository = container.get('adminRepository');
    errors = container.get('errors');
    request = supertest(container.get('app'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /admins', () => {
    const path = '/admins';
    let registerData;

    beforeEach(() => {
      registerData = {
        email: 'memisadmin@gmail.com',
        password: 'PasswordDeAdmin123 '
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
          spyAdminRepository.create = jest
            .spyOn(adminRepository, 'create')
            .mockImplementation(() => {
              throw errors.create(409, 'Email already in use');
            });

          res = await request.post(path).send(registerData);
        });

        it('should fail with status 409', () =>
          expect(res.status).toEqual(409));

        it('should have called adminRepository.create correctly', () => {
          expect(spyAdminRepository.create).toHaveBeenCalledTimes(1);
          expect(spyAdminRepository.create).toHaveBeenCalledWith(
            expect.objectContaining(_.omit(registerData, 'password'))
          );
        });
      });

      describe('when email is not used', () => {
        beforeEach(async () => {
          spyAdminRepository.create = jest
            .spyOn(adminRepository, 'create')
            .mockReturnValue(undefined);

          res = await request.post(path).send(registerData);
        });

        it('should succeed with status 201', () =>
          expect(res.status).toEqual(201));

        it('should have called adminRepository.create correctly', () => {
          expect(spyAdminRepository.create).toHaveBeenCalledTimes(1);
          expect(spyAdminRepository.create).toHaveBeenCalledWith(
            expect.objectContaining(_.omit(registerData, 'password'))
          );
        });
      });
    });
  });

  describe('POST /admins/session', () => {
    const path = '/admins/session';

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

    describe('when logging data is valid', () => {
      let loginData;
      let admin;

      beforeEach(() => {
        loginData = {
          email: 'admin@admin.com',
          password: 'admin'
        };

        admin = {
          id: 'f84683c1-2d00-47a6-9335-df0dd2718aee',
          email: 'admin@admin.com',
          password:
            '$2b$10$Vg1ZosjDBfxF4zfHly2QjuLh2AX/tqOOXLtHOxy8eJGzhG29pFkXy'
        };
      });

      describe('when email is not registered', () => {
        beforeEach(async () => {
          spyAdminRepository.get = jest
            .spyOn(adminRepository, 'get')
            .mockReturnValue([]);

          res = await request.post(path).send(loginData);
        });

        it('should fail with status 409', () =>
          expect(res.status).toEqual(409));

        it('should have called adminRepository.get correctly', () => {
          expect(spyAdminRepository.get).toHaveBeenCalledTimes(1);
          expect(spyAdminRepository.get).toHaveBeenCalledWith({
            email: loginData.email
          });
        });
      });

      describe('when email is registered', () => {
        beforeEach(() => {
          spyAdminRepository.get = jest
            .spyOn(adminRepository, 'get')
            .mockReturnValue([admin]);
        });

        describe('when password is incorrect', () => {
          beforeEach(async () => {
            res = await request
              .post(path)
              .send({ ...loginData, password: 'incorrect' });
          });

          it('should fail with status 409', () =>
            expect(res.status).toEqual(409));

          it('should have called adminRepository.get correctly', () => {
            expect(spyAdminRepository.get).toHaveBeenCalledTimes(1);
            expect(spyAdminRepository.get).toHaveBeenCalledWith({
              email: loginData.email
            });
          });
        });

        describe('when password is correct', () => {
          it('should respond with correct status and body', () =>
            request
              .post(path)
              .send(loginData)
              .expect('Content-Type', /json/)
              .expect(200, { id: admin.id }));

          it('should have called adminRepository.get correctly', async () => {
            await request.post(path).send(loginData);

            expect(spyAdminRepository.get).toHaveBeenCalledTimes(1);
            expect(spyAdminRepository.get).toHaveBeenCalledWith({
              email: loginData.email
            });
          });
        });
      });
    });
  });
});

const supertest = require('supertest');
const containerFactory = require('../testContainerFactory');

const container = containerFactory.createContainer();

describe('statusController', () => {
  let dbService;
  let request;
  let res;

  beforeEach(() => {
    dbService = container.get('dbService');
    request = supertest(container.get('app'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /ping', () => {
    it('should respond with correct status and body', () =>
      request
        .get('/ping')
        .expect('Content-Type', /json/)
        .expect(200, { status: 'ok' }));
  });

  describe('GET /health', () => {
    const spyDbService = {};

    describe('when database is up', () => {
      beforeEach(async () => {
        spyDbService.getDatabaseHealth = jest
          .spyOn(dbService, 'getDatabaseHealth')
          .mockReturnValue(true);

        res = await request.get('/health');
      });

      it('should respond with correct status and body', () => {
        expect(res.status).toEqual(200);
        expect(res.header['content-type']).toMatch(/json/);
        expect(res.body).toEqual({ database: 'UP' });
      });

      it('should have called dbService once', () =>
        expect(spyDbService.getDatabaseHealth).toHaveBeenCalledTimes(1));
    });

    describe('when database is down', () => {
      beforeEach(async () => {
        spyDbService.getDatabaseHealth = jest
          .spyOn(dbService, 'getDatabaseHealth')
          .mockReturnValue(false);

        res = await request.get('/health');
      });

      it('should respond with correct status and body', () => {
        expect(res.status).toEqual(200);
        expect(res.header['content-type']).toMatch(/json/);
        expect(res.body).toEqual({ database: 'DOWN' });
      });

      it('should have called dbService once', () =>
        expect(spyDbService.getDatabaseHealth).toHaveBeenCalledTimes(1));
    });
  });
});

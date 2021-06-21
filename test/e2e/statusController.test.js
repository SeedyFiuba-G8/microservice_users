const supertest = require('supertest');
const containerFactory = require('../testContainerFactory');

const container = containerFactory.createContainer();

describe('statusController', () => {
  let dbService;
  let request;

  beforeEach(() => {
    dbService = container.get('dbService');
    request = supertest(container.get('app'));
  });

  describe('GET /ping', () => {
    it('should respond with correct status and body', async () => {
      const res = await request.get('/ping').send();

      expect(res.status).toEqual(200);
      expect(res.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /health', () => {
    let spyDbService;
    let res;

    beforeEach(async () => {
      spyDbService = jest
        .spyOn(dbService, 'getDatabaseHealth')
        .mockReturnValue(true);
      res = await request.get('/health').send();
    });

    it('should respond with correct status and body', () => {
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({ database: 'UP' });
    });

    it('should have called dbService once', () => {
      expect(spyDbService).toHaveBeenCalledTimes(1);
    });
  });
});

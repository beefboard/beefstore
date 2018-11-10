import supertest from 'supertest';
import app from '../app';

describe('routes', () => {
  describe('GET /', async () => {
    it('should respond with documentation', async () => {
      const response = await supertest(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        v1: '/v1'
      });
    });
  });

  describe('Unmatched routes', () => {
    it('should return 404 not found', async () => {
      const response = await supertest(app).get('/adskjasjhdsgh');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'Not found'
      });
    });
  });
});

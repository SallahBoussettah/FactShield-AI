import request from 'supertest';
import app from '../index';

// Mock database connection
jest.mock('../config/database', () => ({
  connectDatabase: jest.fn().mockResolvedValue(undefined),
  query: jest.fn(),
  getPool: jest.fn(),
}));

describe('App', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment');
    });
  });

  describe('GET /api', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'FactShield AI Backend API');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toContain('Not found');
    });
  });
});
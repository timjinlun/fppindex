// backend/tests/middleware.test.js

const request = require('supertest');
const express = require('express');
const { requestLogger, unknownEndpoint, errorHandler } = require('../utils/middleware');
const logger = require('../utils/logger');

jest.mock('../utils/logger'); // Mock logger to prevent actual logging during tests

const app = express();
app.use(express.json());
app.use(requestLogger);

app.get('/error', (req, res, next) => {
  next(new Error('Test Error'));
});

app.use(unknownEndpoint);
app.use(errorHandler);

describe('Middleware Tests', () => {
  test('Request Logger should log method, path, and body', async () => {
    await request(app)
      .post('/test')
      .send({ key: 'value' });

    expect(logger.info).toHaveBeenCalledWith('Method:', 'POST');
    expect(logger.info).toHaveBeenCalledWith('Path:  ', '/test');
    expect(logger.info).toHaveBeenCalledWith('Body:  ', { key: 'value' });
    expect(logger.info).toHaveBeenCalledWith('---');
  });

  test('Unknown Endpoint should return 404', async () => {
    const response = await request(app).get('/unknown');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'unknown endpoint' });
  });

  test('Error Handler should handle errors', async () => {
    const response = await request(app).get('/error');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'something went wrong...');
  });
});
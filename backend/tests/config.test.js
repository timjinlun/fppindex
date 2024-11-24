// backend/tests/config.test.js

const config = require('../utils/config');

describe('Config Tests', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  test('should use MONGODB_URI in production', () => {
    process.env.NODE_ENV = 'production';
    process.env.MONGODB_URI = 'prod_uri';
    process.env.TEST_MONGODB_URI = 'test_uri';

    const config = require('../utils/config');
    expect(config.MONGODB_URI).toBe('prod_uri');
  });

  test('should use TEST_MONGODB_URI in test', () => {
    process.env.NODE_ENV = 'test';
    process.env.MONGODB_URI = 'prod_uri';
    process.env.TEST_MONGODB_URI = 'test_uri';

    const config = require('../utils/config');
    expect(config.MONGODB_URI).toBe('test_uri');
  });

  test('should set PORT correctly', () => {
    process.env.PORT = '3000';
    const config = require('../utils/config');
    expect(config.PORT).toBe('3000');
  });
});
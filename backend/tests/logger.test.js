// backend/tests/logger.test.js

const logger = require('../utils/logger');

describe('Logger Tests', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('info should log messages when not in test environment', () => {
    process.env.NODE_ENV = 'development';
    logger.info('This is an info message');
    expect(console.log).toHaveBeenCalledWith('This is an info message');
  });

  test('info should not log messages in test environment', () => {
    process.env.NODE_ENV = 'test';
    logger.info('This is an info message');
    expect(console.log).not.toHaveBeenCalled();
  });

  test('error should log error messages when not in test environment', () => {
    process.env.NODE_ENV = 'development';
    logger.error('This is an error message');
    expect(console.error).toHaveBeenCalledWith('This is an error message');
  });

  test('error should not log error messages in test environment', () => {
    process.env.NODE_ENV = 'test';
    logger.error('This is an error message');
    expect(console.error).not.toHaveBeenCalled();
  });
});
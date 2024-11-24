// backend/utils/middleware.js

const logger = require('./logger');

/**
 * Middleware to log incoming requests.
 */
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

/**
 * Middleware to handle unknown endpoints, returning a 404 error.
 * @param {Request} request - The incoming request.
 * @param {Response} response - The outgoing response.
 */
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

/**
 * Middleware to handle errors.
 * @param {Error} error - The error object.
 * @param {Request} request - The incoming request.
 * @param {Response} response - The outgoing response.
 * @param {Function} next - The next middleware function.
 */
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  // Default to 500 server error
  response.status(500).json({ error: 'something went wrong...' });
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
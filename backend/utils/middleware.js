// backend/utils/middleware.js

const logger = require('./logger');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

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
  } else if (error.name === "MongoServerError" && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique'})
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }

  // next() is used to pass the error to the next middleware
  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      request.token = authorization.replace('bearer ', '')
  } else {
    request.token = null
  }
  // next() is used to pass the request to the next middleware
  next()
}

const userExtractor = async (request, response, next) => {
  if (request.token) {
      const decodedToken = jwt.verify(request.token, process.env.SECRET)
      if (decodedToken.id) {
          request.user = await User.findById(decodedToken.id)
      }
  }
  // next() is used to pass the request to the next middleware
  next()
}


module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
};

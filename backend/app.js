// backend/app.js

// Import express-async-errors before other imports
require('express-async-errors');

const express = require('express');
const cors = require('cors');

// Setting up the controllers
const foodController = require('./controllers/foods');
const userController = require('./controllers/users');

const { requestLogger, unknownEndpoint, errorHandler } = require('./utils/middleware');

const helmet = require('helmet'); // For security
const rateLimit = require('express-rate-limit'); // For rate limiting
const mongoSanitize = require('express-mongo-sanitize'); // For sanitization

// Set up the database.
const mongoose = require('mongoose');

const config = require('./utils/config');
const logger = require('./utils/logger');

const app = express();

// MongoDB Connection
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit if we can't connect to database
  });

// Add connection monitoring
mongoose.connection.on('error', err => {
  logger.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.error('MongoDB disconnected');
});

// Middleware
app.use(helmet()); // Sets secure HTTP headers
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests
app.use(requestLogger); // Logs incoming requests

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Data Sanitization
app.use(mongoSanitize());

// Routes
app.use('/api/foods', foodController);
app.use('/api/users', userController);

// Handle Unknown Endpoints
app.use(unknownEndpoint);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
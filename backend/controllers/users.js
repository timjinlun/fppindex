const mongoose = require('mongoose')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger');


// Get all users info 
usersRouter.get('/', async (request, response, next) => {
    logger.info('Attempting to fetch all users info');
    const users = await User.find({});
    logger.info(`Successfully fetched ${users.length} users`);
    response.json(users);
})


module.exports = usersRouter
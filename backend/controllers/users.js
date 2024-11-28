const mongoose = require('mongoose')
const usersRouter = require('express').Router()
const User = require('../models/user')


// Get all users info 
usersRouter.get('/', async (request, response, next) => {
    logger.info('Attempting to fetch all users info');
    const users = await User.find({});
    response.json(users);
});
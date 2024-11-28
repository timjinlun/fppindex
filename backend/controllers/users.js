const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger');


// Get all users info 
usersRouter.get('/', async (request, response, next) => {
    logger.info('Attempting to fetch all users info');
    const users = await User.find({}).populate('foods', { name: 1, price: 1, protion: 1} );
    logger.info(`Successfully fetched ${users.length} users`);
    response.json(users);
})


// Encrypt the password
usersRouter.post('/', async (request, response) => {
    const { username, name, password, createdAt } = request.body
  
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
  
    const user = new User({
      username,
      name,
      passwordHash,
    })
  
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  })



module.exports = usersRouter
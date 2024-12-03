const mongoose = require('mongoose');
const foodsRouter = require('express').Router();
const Food = require('../models/food');
const logger = require('../utils/logger');
const GlobalFood = require('../models/globalFood');
const jwt = require('jsonwebtoken');
const User = require('../models/user');



// Get all foods (personal mode)
foodsRouter.get('/', async (request, response, next) => {
    logger.info('Attempting to fetch all foods');
    const foods = await Food.find({}).populate('user')
    logger.info(`Successfully fetched ${foods.length} foods`);
    response.json(foods);
});


// Get global foods
foodsRouter.get('/global', async (request, response) => {
    logger.info('Attempting to fetch global foods');
    const foods = await GlobalFood.find({}).populate('user');
    logger.info(`Successfully fetched ${foods.length} global foods`);
    response.json(foods);
})



// Create a new food item (personal mode)
foodsRouter.post('/', async (request, response, next) => {
    const { name, price, portion, region } = request.body;

    // Verify the token, means that now we need to get the token from the request
    // and then verify the token with the secret key.
    // If the token is valid, we can get the user id from the token.
    // and then we can use that user to create the food item.
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    logger.info('decodedToken', decodedToken)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)


    // Validate required fields
    if (!name || !price || !portion || !region) {
        return response.status(400).json({ error: 'All fields are required' });
    }

    // Validate user exists
    if (!user || !user.id) {
        return response.status(401).json({ error: 'User authentication required' });
    }

    const food = new Food({
        name,
        price: Number(price),
        portion,
        region,
        user: user.id,
        contributor: user.name
    })

    const savedFood = await food.save();
    logger.info(`Food item added: ${name}`);
    response.status(201).json(savedFood);
});


// Create a global food item
foodsRouter.post('/global', async (request, response) => {
    const { name, price, portion, region } = request.body;
        
    // Verify the token, means that now we need to get the token from the request
    // and then verify the token with the secret key.
    // If the token is valid, we can get the user id from the token.
    // and then we can use that user to create the food item.
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    // Validate required fields
    if (!name || !price || !portion || !region) {
        return response.status(400).json({ error: 'All fields are required' });
    }

    // Validate user exists
    if (!user || !user.id) {
        return response.status(401).json({ error: 'User authentication required' });
    }

    const food = new GlobalFood({
        name,
        price: Number(price),
        portion,
        region,
        user: user.id,
        contributor: user.name
    });

    const savedFood = await food.save();

    // Populate user information before sending response
    const populatedFood = await savedFood.populate('user', 'username name');

    logger.info(`Global food item added: ${name}`);
    response.status(201).json(populatedFood);
});



// Add this DELETE endpoint for global foods
foodsRouter.delete('/global/:id', async (request, response) => {
    const { id } = request.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        logger.error('Invalid MongoDB ID format');
        return response.status(400).json({ error: 'Invalid ID format' });
    }

    logger.info('Attempting to delete global food with ID:', id);
    const deletedFood = await GlobalFood.findByIdAndDelete(id);

    if (!deletedFood) {
        logger.info('Global food not found with ID:', id);
        return response.status(404).json({ error: 'Global food not found' });
    }

    response.status(204).end();
    logger.info(`Global food item deleted: ${id}`);

});


// Update the PUT endpoint for global foods
foodsRouter.put('/global/:id', async (request, response) => {
    const { id } = request.params;
    const { name, price, portion, region } = request.body;

    logger.info('Attempting to update global food:', { id, body: request.body });

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        logger.error('Invalid MongoDB ID format:', id);
        return response.status(400).json({ error: 'Invalid ID format' });
    }

    // Validate required fields
    if (!name || price === undefined || !portion || !region) {
        logger.error('Missing required fields');
        return response.status(400).json({ error: 'All fields are required' });
    }

    const updatedFood = await GlobalFood.findByIdAndUpdate(
        id,
        { name, price: Number(price), portion, region },
        { new: true, runValidators: true }
    );

    if (!updatedFood) {
        logger.error('Global food not found with ID:', id);
        return response.status(404).json({ error: 'Global food not found' });
    }

    logger.info('Successfully updated global food:', updatedFood);
    response.json(updatedFood);
});

// Other routes remain the same...

module.exports = foodsRouter;
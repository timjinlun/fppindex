const mongoose = require('mongoose');
const foodsRouter = require('express').Router();
const Food = require('../models/food');
const logger = require('../utils/logger');
const GlobalFood = require('../models/globalFood');

// Get all foods (personal mode)
// Get all foods (personal mode)
foodsRouter.get('/', async (request, response, next) => {
    logger.info('Attempting to fetch all foods');
    const foods = await Food.find({});
    logger.info(`Successfully fetched ${foods.length} foods`);
    response.json(foods);
});

// Create a new food item (personal mode)
foodsRouter.post('/', async (request, response, next) => {
    const { name, price, portion, region } = request.body;

    // Validate required fields
    if (!name || !price || !portion || !region) {
        return response.status(400).json({ error: 'All fields are required' });
    }

    const food = new Food({
        name,
        price: Number(price),
        portion,
        region,
        createdAt: new Date()
    });

    const savedFood = await food.save();
    logger.info(`Food item added: ${name}`);
    response.status(201).json(savedFood);
});

// Get global foods
foodsRouter.get('/global', async (request, response) => {
    logger.info('Attempting to fetch global foods');
    const foods = await GlobalFood.find({});
    logger.info(`Successfully fetched ${foods.length} global foods`);
    response.json(foods);
});

// Create a global food item
foodsRouter.post('/global', async (request, response) => {
    const { name, price, portion, region } = request.body;

    // Validate required fields
    if (!name || !price || !portion || !region) {
        return response.status(400).json({ error: 'All fields are required' });
    }

    const food = new GlobalFood({
        name,
        price: Number(price),
        portion,
        region,
        createdAt: new Date()
    });

    const savedFood = await food.save();
    logger.info(`Global food item added: ${name}`);
    response.status(201).json(savedFood);
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
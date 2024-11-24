const mongoose = require('mongoose');
const foodsRouter = require('express').Router();
const Food = require('../models/food');
const logger = require('../utils/logger');
const { calculateAveragePrice, findMostExpensiveFood, countFoodsByRegion } = require('../utils/food_helper');


foodsRouter.get('/', async (request, response) => {
    const foods = await Food.find({});
    response.json(foods);
})

foodsRouter.post('/', async (req, res) => {
    const { name, price, portion, region } = req.body;
    const food = new Food({ name, price, portion, region });
    const savedFood = await food.save();
    res.status(201).json(savedFood);
    logger.info(`Food item added: ${name}`);
  });
  


/**
 * Upload multiple food items
 */
foodsRouter.post('/upload', async (req, res) => {
    const foods = req.body; // Assuming JSON array
    if (!Array.isArray(foods)) {
      return res.status(400).json({ error: 'Data should be an array of food items' });
    }
    const savedFoods = await Food.insertMany(foods);
    res.status(201).json(savedFoods);
    logger.info(`Uploaded ${savedFoods.length} food items`);
  });


  
foodsRouter.get('/averages', async (req, res) => {
    const averages = await Food.aggregate([
        {
            $group: {
                _id: '$region',
                averagePrice: { $avg: '$price' },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                region: '$_id',
                averagePrice: { $round: ['$averagePrice', 2] }, // Round to 2 decimal places
                count: 1,
            },
        },
    ]);
    res.json(averages);
});


foodsRouter.get('/statistics', async (req, res) => {
    const foods = await Food.find({});
    const averagePrice = calculateAveragePrice(foods);
    const mostExpensiveFood = findMostExpensiveFood(foods);
    const foodsByRegion = countFoodsByRegion(foods);

    res.json({
        averagePrice: averagePrice.toFixed(2),
        mostExpensiveFood,
        foodsByRegion,
    });
});

foodsRouter.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    logger.info('Attempting to delete food with ID:', id);
    
    // Check if ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.error('Invalid MongoDB ID format');
      return response.status(400).json({ error: 'Invalid ID format' });
    }

    // Add this line to see what's in the database
    const foodExists = await Food.findById(id);
    logger.info('Found food:', foodExists);

    const deletedFood = await Food.findByIdAndDelete(id);
    logger.info('Delete operation result:', deletedFood);
    
    if (!deletedFood) {
      logger.info('Food not found with ID:', id);
      return response.status(404).json({ error: 'food not found' });
    }
    
    response.status(204).end();
    logger.info(`Food item deleted: ${id}`);
  } catch (error) {
    logger.error('Error type:', error.name);
    logger.error('Error message:', error.message);
    logger.error('Full error:', error);
    logger.error('Stack trace:', error.stack);
    response.status(500).json({ 
      error: 'Error deleting food item',
      details: error.message 
    });
  }
});


module.exports = foodsRouter;
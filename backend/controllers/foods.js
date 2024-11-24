const mongoose = require('mongoose');
const foodsRouter = require('express').Router();
const Food = require('../models/food');
const logger = require('../utils/logger');
const { calculateAveragePrice, findMostExpensiveFood, countFoodsByRegion } = require('../utils/food_helper');
const GlobalFood = require('../models/globalFood');

foodsRouter.get('/', async (request, response) => {
  try {
    logger.info('Attempting to fetch all foods');
    const foods = await Food.find({});
    logger.info(`Successfully fetched ${foods.length} foods`);
    response.json(foods);
  } catch (error) {
    logger.error('Error fetching foods:', error);
    response.status(500).json({ 
      error: 'Error fetching foods',
      details: error.message 
    });
  }
});

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

foodsRouter.put('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    logger.info('Attempting to update food with ID:', id);
    
    // Check if ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.error('Invalid MongoDB ID format');
      return response.status(400).json({ error: 'Invalid ID format' });
    }

    const { name, price, portion, region } = request.body;
    
    // Create updated food object
    const updatedFood = {
      name,
      price,
      portion,
      region
    };

    // Add validation
    if (!name || !price || !portion || !region) {
      return response.status(400).json({ error: 'All fields are required' });
    }

    // Find and update the food item
    const food = await Food.findByIdAndUpdate(
      id,
      updatedFood,
      { new: true, runValidators: true }
    );

    if (!food) {
      logger.info('Food not found with ID:', id);
      return response.status(404).json({ error: 'food not found' });
    }

    logger.info('Successfully updated food:', food);
    response.json(food);
  } catch (error) {
    logger.error('Error updating food:', error);
    response.status(500).json({ 
      error: 'Error updating food item',
      details: error.message 
    });
  }
});

foodsRouter.get('/global', async (request, response) => {
  try {
    logger.info('Attempting to fetch global foods');
    const foods = await GlobalFood.find({});
    logger.info(`Successfully fetched ${foods.length} global foods`);
    response.json(foods);
  } catch (error) {
    logger.error('Error fetching global foods:', error);
    response.status(500).json({ 
      error: 'Error fetching global foods',
      details: error.message 
    });
  }
});

foodsRouter.post('/uploadGlobal', async (request, response) => {
  try {
    const foods = request.body;
    if (!Array.isArray(foods)) {
      return response.status(400).json({ error: 'Data should be an array of food items' });
    }
    
    const savedFoods = await GlobalFood.insertMany(foods);
    response.status(201).json(savedFoods);
    logger.info(`Uploaded ${savedFoods.length} global food items`);
  } catch (error) {
    logger.error('Error uploading global foods:', error);
    response.status(500).json({ 
      error: 'Error uploading global foods',
      details: error.message 
    });
  }
});

foodsRouter.post('/global', async (request, response) => {
  try {
    const { name, price, portion, region } = request.body;
    const food = new GlobalFood({ name, price, portion, region });
    const savedFood = await food.save();
    response.status(201).json(savedFood);
    logger.info(`Global food item added: ${name}`);
  } catch (error) {
    logger.error('Error creating global food:', error);
    response.status(500).json({ 
      error: 'Error creating global food',
      details: error.message 
    });
  }
});

foodsRouter.delete('/global/:id', async (request, response) => {
  try {
    const { id } = request.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({ error: 'Invalid ID format' });
    }

    const deletedFood = await GlobalFood.findByIdAndDelete(id);
    if (!deletedFood) {
      return response.status(404).json({ error: 'Global food not found' });
    }
    
    response.status(204).end();
    logger.info(`Global food item deleted: ${id}`);
  } catch (error) {
    logger.error('Error deleting global food:', error);
    response.status(500).json({ 
      error: 'Error deleting global food',
      details: error.message 
    });
  }
});

foodsRouter.put('/global/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const { name, price, portion, region } = request.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({ error: 'Invalid ID format' });
    }

    const updatedFood = await GlobalFood.findByIdAndUpdate(
      id,
      { name, price, portion, region },
      { new: true, runValidators: true }
    );

    if (!updatedFood) {
      return response.status(404).json({ error: 'Global food not found' });
    }

    response.json(updatedFood);
    logger.info(`Global food item updated: ${id}`);
  } catch (error) {
    logger.error('Error updating global food:', error);
    response.status(500).json({ 
      error: 'Error updating global food',
      details: error.message 
    });
  }
});

module.exports = foodsRouter;
// backend/tests/test_helper.js

const Food = require('../models/Food');

/**
 * Initial food items for testing.
 */
const initialFoods = [
  {
    _id: '60d21b4667d0d8992e610c85',
    name: 'Apple',
    price: 3.5,
    portion: 'kg',
    region: 'North',
    createdAt: new Date('2023-04-28T12:34:56.789Z'),
  },
  {
    _id: '60d21b5667d0d8992e610c86',
    name: 'Banana',
    price: 2.0,
    portion: 'kg',
    region: 'South',
    createdAt: new Date('2023-04-28T12:35:56.789Z'),
  },
  {
    _id: '60d21b5667d0d8992e610c87',
    name: 'Orange',
    price: 4.0,
    portion: 'kg',
    region: 'East',
    createdAt: new Date('2023-04-28T12:35:56.789Z'),
  },
];

/**
 * Returns all food items in the database.
 * @returns {Promise<Array>}
 */
const foodsInDb = async () => {
  const foods = await Food.find({});
  return foods.map((food) => food.toJSON());
};

/**
 * Returns the initial food items for testing.
 * @returns {Array}
 */
const nonExistingId = async () => {
  const food = new Food({
    name: 'Temporary Food',
    price: 0,
    portion: 'kg',
    region: 'Temporary',
  });
  await food.save();
  await food.deleteOne();

  return food._id.toString();
};

module.exports = {
  initialFoods,
  foodsInDb,
  nonExistingId,
};
// backend/utils/food_helper.js

/**
 * Calculates the average price of food items.
 * @param {Array} foods - Array of food items.
 * @returns {Number} - The average price.
 */
const calculateAveragePrice = (foods) => {
    if (foods.length === 0) return 0;
    const total = foods.reduce((sum, food) => sum + food.price, 0);
    return total / foods.length;
  };
  
  /**
   * Finds the most expensive food item.
   * @param {Array} foods - Array of food items.
   * @returns {Object|null} - The most expensive food item or null if the list is empty.
   */
  const findMostExpensiveFood = (foods) => {
    if (foods.length === 0) return null;
    return foods.reduce((max, food) => (food.price > max.price ? food : max), foods[0]);
  };
  
  /**
   * Counts the number of food items per region.
   * @param {Array} foods - Array of food items.
   * @returns {Object} - An object with regions as keys and counts as values.
   */
  const countFoodsByRegion = (foods) => {
    const regionCount = {};
    foods.forEach((food) => {
      if (!regionCount[food.region]) {
        regionCount[food.region] = 1;
      } else {
        regionCount[food.region] += 1;
      }
    });
    return regionCount;
  };
  
  module.exports = {
    calculateAveragePrice,
    findMostExpensiveFood,
    countFoodsByRegion,
  };
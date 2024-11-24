// backend/tests/food_helper.test.js

const {
    calculateAveragePrice,
    findMostExpensiveFood,
    countFoodsByRegion,
  } = require('../utils/food_helper');
  
  describe('Food Helper Functions', () => {
    test('calculateAveragePrice should return correct average', () => {
      const foods = [
        { price: 10 },
        { price: 20 },
        { price: 30 },
      ];
      expect(calculateAveragePrice(foods)).toBe(20);
    });
  
    test('calculateAveragePrice should return 0 for empty array', () => {
      const foods = [];
      expect(calculateAveragePrice(foods)).toBe(0);
    });
  
    test('findMostExpensiveFood should return the most expensive food', () => {
      const foods = [
        { name: 'A', price: 10 },
        { name: 'B', price: 30 },
        { name: 'C', price: 20 },
      ];
      expect(findMostExpensiveFood(foods)).toEqual({ name: 'B', price: 30 });
    });
  
    test('findMostExpensiveFood should return null for empty array', () => {
      const foods = [];
      expect(findMostExpensiveFood(foods)).toBeNull();
    });
  
    test('countFoodsByRegion should return correct counts', () => {
      const foods = [
        { region: 'North' },
        { region: 'South' },
        { region: 'North' },
        { region: 'East' },
      ];
      expect(countFoodsByRegion(foods)).toEqual({
        North: 2,
        South: 1,
        East: 1,
      });
    });
  
    test('countFoodsByRegion should return empty object for empty array', () => {
      const foods = [];
      expect(countFoodsByRegion(foods)).toEqual({});
    });
  });
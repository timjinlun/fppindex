const regions = [
  'Northeast US', 'Southeast US', 'Midwest US', 'Western US',
  'Northern Europe', 'Southern Europe', 'Eastern Europe', 'Western Europe',
  'East Asia', 'Southeast Asia', 'South Asia'
];

const foodNames = [
  'Apple', 'Banana', 'Orange', 'Rice', 'Bread', 'Milk', 'Eggs', 'Chicken',
  'Beef', 'Pork', 'Fish', 'Carrot', 'Potato', 'Tomato', 'Onion', 'Garlic',
  'Lettuce', 'Spinach', 'Cheese', 'Yogurt'
];

const portions = ['kg', 'lb', 'g', 'oz'];

const generateRandomPrice = () => {
  return Number((Math.random() * 50 + 0.5).toFixed(2)); // Random price between 0.50 and 50.50
};

const generateRandomFood = (id) => {
  return {
    id: `mock-${id}`,
    name: `${foodNames[Math.floor(Math.random() * foodNames.length)]} ${id}`,
    price: generateRandomPrice(),
    portion: portions[Math.floor(Math.random() * portions.length)],
    region: regions[Math.floor(Math.random() * regions.length)],
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString() // Random date within past ~4 months
  };
};

export const generateMockFoods = (count = 100) => {
  return Array.from({ length: count }, (_, index) => generateRandomFood(index + 1));
};

// Generate mock statistics
export const generateMockStatistics = (foods) => {
  const averagePrice = foods.reduce((sum, food) => sum + food.price, 0) / foods.length;
  const mostExpensiveFood = foods.reduce((max, food) => food.price > max.price ? food : max, foods[0]);
  const foodsByRegion = foods.reduce((acc, food) => {
    acc[food.region] = (acc[food.region] || 0) + 1;
    return acc;
  }, {});

  return {
    averagePrice: averagePrice.toFixed(2),
    mostExpensiveFood,
    foodsByRegion
  };
}; 
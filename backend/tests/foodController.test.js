// backend/tests/foodController.test.js

const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Food = require('../models/Food');
const helper = require('./test_helper');

const api = supertest(app);



beforeEach(async () => {
  await Food.deleteMany({});

  const foodObjects = helper.initialFoods.map((food) => new Food(food));
  const promiseArray = foodObjects.map((food) => food.save());
  await Promise.all(promiseArray);
});

describe('GET /api/foods', () => {
  test('foods are returned as json', async () => {
    await api
      .get('/api/foods')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all initial foods are returned', async () => {
    const response = await api.get('/api/foods');

    expect(response.body).toHaveLength(helper.initialFoods.length);
  });

  test('a specific food is within the returned foods', async () => {
    const response = await api.get('/api/foods');

    const names = response.body.map((r) => r.name);
    expect(names).toContain('Apple');
  });
});

describe('POST /api/foods', () => {
  test('a valid food can be added', async () => {
    const newFood = {
      name: 'Grapes',
      price: 5.0,
      portion: 'kg',
      region: 'West',
    };

    await api
      .post('/api/foods')
      .send(newFood)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const foodsAtEnd = await helper.foodsInDb();
    expect(foodsAtEnd).toHaveLength(helper.initialFoods.length + 1);

    const names = foodsAtEnd.map((r) => r.name);
    expect(names).toContain('Grapes');
  });

  test('food without name is not added', async () => {
    const newFood = {
      price: 4.0,
      portion: 'kg',
      region: 'East',
    };

    await api.post('/api/foods').send(newFood).expect(400);

    const foodsAtEnd = await helper.foodsInDb();
    expect(foodsAtEnd).toHaveLength(helper.initialFoods.length);
  });

  test('food with negative price is not added', async () => {
    const newFood = {
      name: 'Negative Price Food',
      price: -10,
      portion: 'kg',
      region: 'South',
    };

    await api.post('/api/foods').send(newFood).expect(400);

    const foodsAtEnd = await helper.foodsInDb();
    expect(foodsAtEnd).toHaveLength(helper.initialFoods.length);
  });

});



afterAll(async () => {
  await mongoose.connection.close();
});
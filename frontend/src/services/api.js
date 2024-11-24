// src/services/foods.js

import axios from 'axios';

const baseUrl = '/api/foods'; // Adjust if your backend runs on a different port

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newFood) => {
  const response = await axios.post(baseUrl, newFood);
  return response.data;
};

const update = async (id, updatedFood) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedFood);
  return response.data;
};

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response.data;
};

export default { getAll, create, update, remove };
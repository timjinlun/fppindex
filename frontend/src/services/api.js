// src/services/foods.js

import axios from 'axios';

const baseUrl = '/api/foods'; // Adjust if your backend runs on a different port

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching foods:', error);
    throw error;
  }
};

const create = async (newFood) => {
  try {
    console.log('Creating food item:', newFood);
    const response = await axios.post(baseUrl, newFood);
    console.log('Created food item:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating food:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to create food item');
  }
};

const remove = async (id) => {
  try {
    console.log('Attempting to delete food with ID:', id);
    const response = await axios.delete(`${baseUrl}/${id}`);
    console.log('Delete response:', response);
    return response.data;
  } catch (error) {
    console.error('Error deleting food:', error.response?.data || error.message);
    console.error('Full error object:', error);
    throw error;
  }
};

const update = async (id, updatedFood) => {
  try {
    const response = await axios.put(`${baseUrl}/${id}`, updatedFood);
    return response.data;
  } catch (error) {
    console.error('Error updating food:', error);
    throw error;
  }
};

const uploadMany = async (foods, endpoint = 'upload') => {
  try {
    const response = await axios.post(`${baseUrl}/${endpoint}`, foods);
    return response.data;
  } catch (error) {
    console.error('Error uploading foods:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to upload foods');
  }
};

const getGlobalFoods = async () => {
  try {
    const response = await axios.get(`${baseUrl}/global`);
    return response.data;
  } catch (error) {
    console.error('Error fetching global foods:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to fetch global foods');
  }
};

const createGlobalFood = async (newFood) => {
  try {
    console.log('Creating global food item:', newFood);
    const response = await axios.post(`${baseUrl}/global`, newFood);
    console.log('Created global food item response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating global food:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to create global food item');
  }
};

const removeGlobalFood = async (id) => {
  try {
    await axios.delete(`${baseUrl}/global/${id}`);
  } catch (error) {
    console.error('Error deleting global food:', error);
    throw error;
  }
};

const updateGlobalFood = async (id, updatedFood) => {
  try {
    console.log('Updating global food:', id, updatedFood);
    const response = await axios.put(`${baseUrl}/global/${id}`, updatedFood);
    console.log('Update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating global food:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to update global food item');
  }
};

export default { 
  getAll, 
  create, 
  remove, 
  update, 
  uploadMany,
  getGlobalFoods,
  createGlobalFood,
  removeGlobalFood,
  updateGlobalFood
};
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
    const response = await axios.post(baseUrl, newFood);
    return response.data;
  } catch (error) {
    console.error('Error creating food:', error);
    throw error;
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
    console.error('Error uploading foods:', error);
    throw error;
  }
};

const getGlobalFoods = async () => {
  try {
    const response = await axios.get(`${baseUrl}/global`);
    return response.data;
  } catch (error) {
    console.error('Error fetching global foods:', error);
    throw error;
  }
};

export default { getAll, create, remove, update, uploadMany, getGlobalFoods };
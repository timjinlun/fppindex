// src/App.jsx

import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import FoodList from './components/FoodList';
import FoodForm from './components/FoodForm';
import Notification from './components/Notification';
import api from './services/api';
import SearchBar from './components/SearchBar';
import PriceChart from './components/PriceChart';

const App = () => {
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ 
    message: '', 
    type: 'success' 
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const foodsData = await api.getAll();
      setFoods(foodsData);
      setError(null);
    } catch (err) {
      setError('Error fetching foods. Please try again later.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFoodCreated = async (newFood) => {
    try {
      const createdFood = await api.create(newFood);
      setFoods([...foods, createdFood]);
      setNotification({ 
        message: `Successfully added ${createdFood.name}`, 
        type: 'success' 
      });
      setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    } catch (err) {
      setNotification({ 
        message: 'Error creating food. Please try again.', 
        type: 'error' 
      });
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.remove(id);
      setFoods(foods.filter(food => food.id !== id));
      setNotification({
        message: 'Food item deleted successfully',
        type: 'success'
      });
      setTimeout(() => setNotification({ message: '', type: 'success' }), 5000);
    } catch (err) {
      const errorMessage = err.response?.data?.details || err.response?.data?.error || err.message;
      setNotification({
        message: `Error deleting food item: ${errorMessage}`,
        type: 'error'
      });
      console.error('Delete error:', err);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  const handleUpdate = async (id, updatedFood) => {
    try {
      const updated = await api.update(id, updatedFood);
      setFoods(foods.map(food => food.id === id ? updated : food));
      setNotification({
        message: `Successfully updated ${updated.name}`,
        type: 'success'
      });
      setTimeout(() => setNotification({ message: '', type: 'success' }), 5000);
    } catch (err) {
      setNotification({
        message: 'Error updating food item',
        type: 'error'
      });
      console.error('Update error:', err);
    }
  };

  const filteredFoods = foods.filter(food => 
    food.name.toLowerCase().includes(searchTerm) ||
    food.region.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="App">
      <Header />
      <main className="content">
        <Notification 
          message={notification.message} 
          type={notification.type} 
        />
        <SearchBar onSearch={handleSearch} />
        <FoodForm onFoodCreated={handleFoodCreated} />
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <PriceChart foods={filteredFoods} />
            <FoodList 
              foods={filteredFoods} 
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;

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
import ImportData from './components/ImportData';
import { generateMockFoods, generateMockStatistics } from './utils/mockData';
import ModeSelector from './components/ModeSelector';

const App = () => {
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ 
    message: '', 
    type: 'success' 
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isTestMode, setIsTestMode] = useState(false);
  const [mode, setMode] = useState('single');

  useEffect(() => {
    if (isTestMode) {
      const mockFoods = generateMockFoods(150);
      setFoods(mockFoods);
      setLoading(false);
    } else {
      fetchFoods();
    }
  }, [isTestMode]);

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

  const handleDataImport = async (data) => {
    try {
      if (mode === 'global') {
        // Add validation for global data
        await validateGlobalData(data);
      }
      
      const endpoint = mode === 'global' ? 'uploadGlobal' : 'upload';
      await api.uploadMany(data, endpoint);
      
      setNotification({
        message: `Successfully imported ${data.length} items to ${mode} dataset`,
        type: 'success'
      });
      
      // Refresh the appropriate dataset
      mode === 'global' ? fetchGlobalFoods() : fetchPersonalFoods();
    } catch (error) {
      setNotification({
        message: 'Error importing data: ' + error.message,
        type: 'error'
      });
    }
    setTimeout(() => setNotification({ message: '', type: 'success' }), 5000);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    // Clear existing data when switching modes
    setFoods([]);
    setLoading(true);
    
    if (newMode === 'global') {
      fetchGlobalFoods();
    } else {
      fetchPersonalFoods();
    }
  };

  const fetchGlobalFoods = async () => {
    try {
      setLoading(true);
      const foodsData = await api.getGlobalFoods();
      setFoods(foodsData);
      setError(null);
    } catch (err) {
      setError('Error fetching global foods data.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonalFoods = async () => {
    // Your existing fetchFoods function
    fetchFoods();
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
        
        <ModeSelector 
          currentMode={mode}
          onModeChange={handleModeChange}
        />
        
        <div className="content-grid">
          <div className="search-section">
            <div className="test-mode-controls">
              <button 
                onClick={() => setIsTestMode(!isTestMode)}
                className={`test-mode-button ${isTestMode ? 'active' : ''}`}
              >
                {isTestMode ? 'Exit Test Mode' : 'Enter Test Mode (150 items)'}
              </button>
            </div>
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Form section - left column */}
          <div className="form-section">
            <ImportData onDataImported={handleDataImport} />
            <FoodForm onFoodCreated={handleFoodCreated} />
          </div>

          {/* Chart section - right column */}
          <div className="chart-section">
            {!loading && !error && <PriceChart foods={filteredFoods} />}
          </div>

          {/* List section - full width */}
          <div className="list-section">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : (
              <FoodList 
                foods={filteredFoods} 
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;

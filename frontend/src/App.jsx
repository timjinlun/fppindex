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
import { saveToLocalStorage, loadFromLocalStorage } from './utils/storage';
import ExportButton from './components/ExportButton';

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
    if (mode === 'single') {
      const savedFoods = loadFromLocalStorage('personalFoods') || [];
      setFoods(savedFoods);
      setLoading(false);
    } else {
      fetchFoods();
    }
  }, [mode]);

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
      if (mode === 'global') {
        const createdFood = await api.create(newFood);
        setFoods([...foods, createdFood]);
      } else {
        const personalFood = {
          ...newFood,
          id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
        const updatedFoods = [...foods, personalFood];
        setFoods(updatedFoods);
        saveToLocalStorage('personalFoods', updatedFoods);
      }
      
      setNotification({ 
        message: `Successfully added ${newFood.name}`, 
        type: 'success' 
      });
    } catch (err) {
      setNotification({ 
        message: 'Error creating food item', 
        type: 'error' 
      });
      console.error('Error:', err);
    }
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  const handleDelete = async (id) => {
    try {
      if (mode === 'global') {
        await api.remove(id);
      }
      const updatedFoods = foods.filter(food => food.id !== id);
      setFoods(updatedFoods);
      if (mode === 'single') {
        saveToLocalStorage('personalFoods', updatedFoods);
      }
      setNotification({
        message: 'Food item deleted successfully',
        type: 'success'
      });
    } catch (err) {
      setNotification({
        message: 'Error deleting food item',
        type: 'error'
      });
      console.error('Delete error:', err);
    }
    setTimeout(() => setNotification({ message: '', type: 'success' }), 5000);
  };

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  const handleUpdate = async (id, updatedFood) => {
    try {
      let updated;
      if (mode === 'global') {
        updated = await api.update(id, updatedFood);
      } else {
        updated = { ...updatedFood, id };
      }
      
      const updatedFoods = foods.map(food => food.id === id ? updated : food);
      setFoods(updatedFoods);
      
      if (mode === 'single') {
        saveToLocalStorage('personalFoods', updatedFoods);
      }
      
      setNotification({
        message: `Successfully updated ${updated.name}`,
        type: 'success'
      });
    } catch (err) {
      setNotification({
        message: 'Error updating food item',
        type: 'error'
      });
      console.error('Update error:', err);
    }
    setTimeout(() => setNotification({ message: '', type: 'success' }), 5000);
  };

  const handleDataImport = async (data) => {
    try {
      if (mode === 'global') {
        // Upload to MongoDB for global mode
        await api.uploadMany(data, 'uploadGlobal');
        await fetchGlobalFoods();
      } else {
        // Store locally for personal mode
        const newFoods = data.map(food => ({
          ...food,
          id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }));
        const updatedFoods = [...foods, ...newFoods];
        setFoods(updatedFoods);
        saveToLocalStorage('personalFoods', updatedFoods);
      }
      
      setNotification({
        message: `Successfully imported ${data.length} items to ${mode} dataset`,
        type: 'success'
      });
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
    setFoods([]);
    setLoading(true);
    
    if (newMode === 'global') {
      fetchGlobalFoods();
    } else {
      // Load personal data from localStorage
      const savedFoods = loadFromLocalStorage('personalFoods') || [];
      setFoods(savedFoods);
      setLoading(false);
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
              <>
                <ExportButton 
                  foods={filteredFoods} 
                  mode={mode} 
                />
                <FoodList 
                  foods={filteredFoods} 
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;

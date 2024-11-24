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
    const initializeData = async () => {
      try {
        setLoading(true);
        let data;
        if (mode === 'global') {
          data = await api.getGlobalFoods();
        } else {
          data = loadFromLocalStorage('personalFoods') || [];
        }
        setFoods(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`Error fetching ${mode} foods: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [mode]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setFoods([]);
    setLoading(true);
  };

  const handleFoodCreated = async (newFood) => {
    try {
      console.log('Creating food in mode:', mode);
      let createdFood;
      
      if (mode === 'global') {
        createdFood = await api.createGlobalFood(newFood);
        console.log('Created global food:', createdFood);
      } else {
        createdFood = {
          ...newFood,
          id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
        const updatedFoods = [...foods, createdFood];
        saveToLocalStorage('personalFoods', updatedFoods);
      }
      
      setFoods(prevFoods => [...prevFoods, createdFood]);
      setNotification({ 
        message: `Successfully added ${createdFood.name}`, 
        type: 'success' 
      });
    } catch (err) {
      setNotification({ 
        message: `Error creating food item: ${err.message}`, 
        type: 'error' 
      });
      console.error('Error creating food:', err);
    }
    setTimeout(() => setNotification({ message: '', type: 'success' }), 5000);
  };

  const handleDelete = async (id) => {
    try {
      if (mode === 'global') {
        await api.removeGlobalFood(id);
      }
      setFoods(prevFoods => {
        const updatedFoods = prevFoods.filter(food => food.id !== id);
        if (mode === 'single') {
          saveToLocalStorage('personalFoods', updatedFoods);
        }
        return updatedFoods;
      });
      
      setNotification({
        message: 'Food item deleted successfully',
        type: 'success'
      });
    } catch (err) {
      setNotification({
        message: `Error deleting food item: ${err.message}`,
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
      console.log('Updating food in mode:', mode, 'with ID:', id);
      let updated;
      
      if (mode === 'global') {
        // Make sure we're sending all required fields
        const foodToUpdate = {
          name: updatedFood.name,
          price: Number(updatedFood.price),
          portion: updatedFood.portion,
          region: updatedFood.region
        };
        updated = await api.updateGlobalFood(id, foodToUpdate);
        console.log('Updated global food:', updated);
      } else {
        updated = { ...updatedFood, id };
        // Save to local storage for personal mode
        const updatedFoods = foods.map(food => food.id === id ? updated : food);
        saveToLocalStorage('personalFoods', updatedFoods);
      }
      
      // Update state
      setFoods(prevFoods => prevFoods.map(food => food.id === id ? updated : food));
      
      setNotification({
        message: `Successfully updated ${updated.name}`,
        type: 'success'
      });
    } catch (err) {
      console.error('Update error:', err);
      setNotification({
        message: `Error updating food item: ${err.message}`,
        type: 'error'
      });
    }
    setTimeout(() => setNotification({ message: '', type: 'success' }), 5000);
  };

  const handleDataImport = async (data) => {
    try {
      if (mode === 'global') {
        const savedFoods = await api.uploadMany(data, 'uploadGlobal');
        setFoods(prevFoods => [...prevFoods, ...savedFoods]);
      } else {
        const newFoods = data.map(food => ({
          ...food,
          id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }));
        setFoods(prevFoods => {
          const updatedFoods = [...prevFoods, ...newFoods];
          saveToLocalStorage('personalFoods', updatedFoods);
          return updatedFoods;
        });
      }
      
      setNotification({
        message: `Successfully imported ${data.length} items to ${mode} dataset`,
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: `Error importing data: ${error.message}`,
        type: 'error'
      });
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

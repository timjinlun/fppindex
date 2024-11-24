// src/App.jsx

import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import FoodList from './components/FoodList';
import apiService from './services/api';

const App = () => {
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiService
      .getAll()
      .then((initialFoods) => {
        if (!Array.isArray(initialFoods)) {
          setError('Foods data is invalid.');
          return;
        }
        setFoods(initialFoods);
      })
      .catch((err) => {
        setError('Error fetching foods data. Please try again later.');
        console.error(err);
      });
  }, []);

  console.log('App foods state:', foods);
  console.log('Is foods an array?', Array.isArray(foods));


  return (
    <div className="App">
      <Header />

      <main className="content">
        {error ? <p>{error}</p> : <FoodList foods={foods} />}
      </main>

      <Footer />
    </div>
  );
};

export default App;

// src/components/FoodList.jsx

import PropTypes from 'prop-types';
import './FoodList.css';
import { useState, useMemo } from 'react';

const FoodList = ({ foods, onDelete }) => {
  const [sortField, setSortField] = useState('name');
  const [filterRegion, setFilterRegion] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique regions from foods array
  const uniqueRegions = useMemo(() => {
    const regions = [...new Set(foods.map(food => food.region))];
    return regions.sort();
  }, [foods]);

  const sortedAndFilteredFoods = useMemo(() => {
    return foods
      .filter(food => !filterRegion || food.region === filterRegion)
      .sort((a, b) => {
        if (sortField === 'price') {
          return a.price - b.price;
        }
        return a[sortField].localeCompare(b[sortField]);
      });
  }, [foods, filterRegion, sortField]);

  const paginatedFoods = sortedAndFilteredFoods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      onDelete(id);
    }
  };

  if (!Array.isArray(foods)) {
    return <p>Error: Foods data is invalid.</p>;
  }

  return (
    <div className="food-list">
      <div className="controls">
        <div className="control-group">
          <label htmlFor="sort">Sort by:</label>
          <select 
            id="sort"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="region">Region</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="region">Filter by Region:</label>
          <select 
            id="region"
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
          >
            <option value="">All Regions</option>
            {uniqueRegions.map(region => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h2>Food Items ({sortedAndFilteredFoods.length} items)</h2>
      
      {paginatedFoods.length > 0 ? (
        <>
          <table className="food-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price ($)</th>
                <th>Portion</th>
                <th>Region</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFoods.map((food) => (
                <tr key={food.id}>
                  <td>{food.name}</td>
                  <td>{food.price.toFixed(2)}</td>
                  <td>{food.portion}</td>
                  <td>{food.region}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(food.id)}
                      className="delete-button"
                      aria-label={`Delete ${food.name}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {Math.ceil(sortedAndFilteredFoods.length / itemsPerPage)}</span>
            <button 
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage * itemsPerPage >= sortedAndFilteredFoods.length}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No food items available.</p>
      )}
    </div>
  );
};

FoodList.propTypes = {
  foods: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      portion: PropTypes.oneOf(['kg', 'lb', 'g', 'oz']).isRequired,
      region: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default FoodList;

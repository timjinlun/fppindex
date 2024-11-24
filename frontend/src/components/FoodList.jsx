// src/components/FoodList.jsx

import PropTypes from 'prop-types';
import './FoodList.css'; // Ensure this file exists

const FoodList = ({ foods, onDelete }) => {
  const handleDelete = (id) => {
    console.log('Deleting food with ID:', id);
    onDelete(id);
  };

  if (!Array.isArray(foods)) {
    return <p>Error: Foods data is invalid.</p>;
  }

  return (
    <div className="food-list">
      <h2>Food Items</h2>
      {foods.length > 0 ? (
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
            {foods.map((food) => (
              <tr key={food.id}>
                <td>{food.name}</td>
                <td>{food.price.toFixed(2)}</td>
                <td>{food.portion}</td>
                <td>{food.region}</td>
                <td>
                  <button
                    onClick={() => handleDelete(food.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No food items available.</p>
      )}
    </div>
  );
};

// Updated PropTypes for FoodList without likes
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

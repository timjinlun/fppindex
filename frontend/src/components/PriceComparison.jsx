import PropTypes from 'prop-types';
import './PriceComparison.css';

const PriceComparison = ({ foods }) => {
  const getFoodsByName = (name) => {
    return foods.filter(food => food.name.toLowerCase() === name.toLowerCase())
      .sort((a, b) => a.price - b.price);
  };

  const uniqueFoodNames = [...new Set(foods.map(food => food.name))];

  return (
    <div className="price-comparison">
      <h3>Price Comparison by Region</h3>
      {uniqueFoodNames.map(name => {
        const sameFood = getFoodsByName(name);
        if (sameFood.length > 1) {
          return (
            <div key={name} className="comparison-item">
              <h4>{name}</h4>
              <div className="price-range">
                <span>Lowest: ${sameFood[0].price.toFixed(2)} ({sameFood[0].region})</span>
                <span>Highest: ${sameFood[sameFood.length-1].price.toFixed(2)} ({sameFood[sameFood.length-1].region})</span>
                <span>Difference: {((sameFood[sameFood.length-1].price / sameFood[0].price - 1) * 100).toFixed(1)}%</span>
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

PriceComparison.propTypes = {
  foods: PropTypes.array.isRequired
};

export default PriceComparison; 
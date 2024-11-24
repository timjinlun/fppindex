import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PriceChart = ({ foods }) => {
  // Group foods by region and calculate average prices
  const regionData = foods.reduce((acc, food) => {
    if (!acc[food.region]) {
      acc[food.region] = {
        totalPrice: 0,
        count: 0,
        prices: {},
      };
    }
    
    // Track individual food prices in each region
    if (!acc[food.region].prices[food.name]) {
      acc[food.region].prices[food.name] = [];
    }
    acc[food.region].prices[food.name].push({
      price: food.price,
      portion: food.portion
    });
    
    acc[food.region].totalPrice += food.price;
    acc[food.region].count += 1;
    return acc;
  }, {});

  const regions = Object.keys(regionData);
  const averagePrices = regions.map(region => 
    regionData[region].totalPrice / regionData[region].count
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Average Food Prices by Region',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          afterBody: function(context) {
            const region = regions[context[0].dataIndex];
            const regionInfo = regionData[region];
            
            // Show individual food prices in tooltip
            let details = [`Total Items: ${regionInfo.count}`];
            Object.entries(regionInfo.prices).forEach(([food, priceData]) => {
              const avgPrice = priceData.reduce((sum, p) => sum + p.price, 0) / priceData.length;
              details.push(`${food}: $${avgPrice.toFixed(2)} per ${priceData[0].portion}`);
            });
            
            return details;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Average Price ($)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Region'
        }
      }
    }
  };

  const data = {
    labels: regions,
    datasets: [
      {
        label: 'Average Price',
        data: averagePrices,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="chart-container">
      <Bar options={options} data={data} />
    </div>
  );
};

PriceChart.propTypes = {
  foods: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      portion: PropTypes.string.isRequired,
      region: PropTypes.string.isRequired
    })
  ).isRequired
};

export default PriceChart; 
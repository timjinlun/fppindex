import PropTypes from 'prop-types';
import './ExportButton.css';

const ExportButton = ({ foods, mode }) => {
  const exportToJSON = () => {
    const dataStr = JSON.stringify(foods, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `food-prices-${mode}-${new Date().toISOString().split('T')[0]}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url); // Clean up
  };

  const exportToCSV = () => {
    const headers = ['name', 'price', 'portion', 'region'];
    const csvRows = [
      headers.join(','), // Header row
      ...foods.map(food => 
        headers.map(header => 
          typeof food[header] === 'string' ? `"${food[header]}"` : food[header]
        ).join(',')
      )
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `food-prices-${mode}-${new Date().toISOString().split('T')[0]}.csv`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url); // Clean up
  };

  return (
    <div className="export-buttons">
      <button onClick={exportToJSON} className="export-button json">
        Export to JSON
      </button>
      <button onClick={exportToCSV} className="export-button csv">
        Export to CSV
      </button>
    </div>
  );
};

ExportButton.propTypes = {
  foods: PropTypes.array.isRequired,
  mode: PropTypes.string.isRequired
};

export default ExportButton; 
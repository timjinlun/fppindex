import PropTypes from 'prop-types';
import { regions } from '../utils/regions';
import './RegionSelect.css';
import { useState } from 'react';

const RegionSelect = ({ value, onChange }) => {
  const [selectedContinent, setSelectedContinent] = useState('');

  const handleContinentChange = (continent) => {
    setSelectedContinent(continent);
    // If there's only one region in the continent, select it automatically
    if (regions[continent].length === 1) {
      onChange(regions[continent][0]);
    }
  };

  return (
    <div className="region-select">
      <div className="continent-select">
        <label htmlFor="continent">Continent:</label>
        <select
          id="continent"
          value={selectedContinent}
          onChange={(e) => handleContinentChange(e.target.value)}
        >
          <option value="">Select a continent</option>
          {Object.keys(regions).map(continent => (
            <option key={continent} value={continent}>
              {continent}
            </option>
          ))}
        </select>
      </div>

      {selectedContinent && (
        <div className="region-options">
          <label htmlFor="region">Region:</label>
          <select
            id="region"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">Select a region</option>
            {regions[selectedContinent].map(region => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

RegionSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default RegionSelect; 
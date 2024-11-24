import { useState } from 'react';
import PropTypes from 'prop-types';
import './ImportData.css';

const ImportData = ({ onDataImported }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const validateFoodItem = (item, index) => {
    const errors = [];

    // Check required fields
    if (!item.name || typeof item.name !== 'string' || item.name.length < 3) {
      errors.push(`Row ${index + 1}: Name must be at least 3 characters long`);
    }

    // Validate price
    const price = Number(item.price);
    if (isNaN(price) || price <= 0) {
      errors.push(`Row ${index + 1}: Price must be a positive number`);
    }

    // Validate portion
    const validPortions = ['kg', 'lb', 'g', 'oz'];
    if (!validPortions.includes(item.portion)) {
      errors.push(`Row ${index + 1}: Invalid portion unit. Must be one of: ${validPortions.join(', ')}`);
    }

    // Validate region (you can import your regions from utils/regions.js)
    if (!item.region || typeof item.region !== 'string' || item.region.length < 2) {
      errors.push(`Row ${index + 1}: Region is required and must be valid`);
    }

    return errors;
  };

  const parseCSV = async (file) => {
    const text = await file.text();
    const rows = text.split('\n');
    const headers = rows[0].toLowerCase().split(',').map(header => header.trim());
    
    // Validate headers
    const requiredHeaders = ['name', 'price', 'portion', 'region'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    return rows.slice(1)
      .filter(row => row.trim()) // Skip empty rows
      .map(row => {
        const values = row.split(',').map(value => value.trim());
        const food = {};
        headers.forEach((header, index) => {
          if (header === 'price') {
            food[header] = parseFloat(values[index]);
          } else {
            food[header] = values[index];
          }
        });
        return food;
      });
  };

  const parseJSON = async (file) => {
    const text = await file.text();
    const data = JSON.parse(text);
    
    if (!Array.isArray(data)) {
      throw new Error('JSON file must contain an array of food items');
    }
    
    return data;
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      setLoading(true);
      setValidationErrors([]);
      let data;

      // Parse file based on type
      if (file.name.endsWith('.csv')) {
        data = await parseCSV(file);
      } else if (file.name.endsWith('.json')) {
        data = await parseJSON(file);
      } else {
        throw new Error('Unsupported file format. Please use CSV or JSON.');
      }

      // Validate each item
      const allErrors = [];
      data.forEach((item, index) => {
        const itemErrors = validateFoodItem(item, index);
        allErrors.push(...itemErrors);
      });

      if (allErrors.length > 0) {
        setValidationErrors(allErrors);
        return;
      }

      // If validation passes, import the data
      await onDataImported(data);
      setFile(null);
      setValidationErrors([]);
      // Reset file input
      e.target.reset();
    } catch (error) {
      setValidationErrors([error.message]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleImport} className="import-form">
      <h3>Import Data</h3>
      <div className="file-input-container">
        <input
          type="file"
          accept=".csv,.json"
          onChange={(e) => setFile(e.target.files[0])}
          className="file-input"
          id="file-input"
        />
        <label htmlFor="file-input" className="file-label">
          {file ? file.name : 'Choose file'}
        </label>
      </div>
      <button 
        type="submit" 
        disabled={!file || loading}
        className="import-button"
      >
        {loading ? 'Importing...' : 'Import'}
      </button>

      {validationErrors.length > 0 && (
        <div className="validation-errors">
          <h4>Please fix the following errors:</h4>
          <ul>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="import-info">
        <p>Supported formats: CSV, JSON</p>
        <p>Required columns: name, price, portion, region</p>
        <p>Example CSV format:</p>
        <code>name,price,portion,region</code>
        <code>Apple,2.99,kg,Northeast US</code>
        <p>Example JSON format:</p>
        <code>
          [{"\n"}
          {"  "}{"{"}"name": "Apple", "price": 2.99, "portion": "kg", "region": "Northeast US"{"}"}{"\n"}
          {"]"}
        </code>
        <p>Validation rules:</p>
        <ul>
          <li>Name: At least 3 characters</li>
          <li>Price: Positive number</li>
          <li>Portion: Must be kg, lb, g, or oz</li>
          <li>Region: Must be a valid region</li>
        </ul>
      </div>
    </form>
  );
};

ImportData.propTypes = {
  onDataImported: PropTypes.func.isRequired
};

export default ImportData; 
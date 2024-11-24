import { useState } from 'react';
import PropTypes from 'prop-types';
import './ImportData.css';

const ImportData = ({ onDataImported }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const parseCSV = async (file) => {
    const text = await file.text();
    const rows = text.split('\n');
    const headers = rows[0].split(',').map(header => header.trim());
    
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
    return JSON.parse(text);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      setLoading(true);
      let data;

      if (file.name.endsWith('.csv')) {
        data = await parseCSV(file);
      } else if (file.name.endsWith('.json')) {
        data = await parseJSON(file);
      } else {
        throw new Error('Unsupported file format. Please use CSV or JSON.');
      }

      // Validate data format
      const isValid = data.every(item => 
        item.name && 
        typeof item.price === 'number' &&
        item.portion &&
        item.region
      );

      if (!isValid) {
        throw new Error('Invalid data format. Please check your file structure.');
      }

      await onDataImported(data);
      setFile(null);
      // Reset file input
      e.target.reset();
    } catch (error) {
      console.error('Import error:', error);
      alert(error.message);
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
          onChange={handleFileChange}
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
      <div className="import-info">
        <p>Supported formats: CSV, JSON</p>
        <p>Required columns: name, price, portion, region</p>
        <p>Example CSV format:</p>
        <code>name,price,portion,region</code>
        <code>Apple,2.99,kg,North</code>
      </div>
    </form>
  );
};

ImportData.propTypes = {
  onDataImported: PropTypes.func.isRequired
};

export default ImportData; 
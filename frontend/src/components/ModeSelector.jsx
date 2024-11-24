import PropTypes from 'prop-types';
import './ModeSelector.css';

const ModeSelector = ({ currentMode, onModeChange }) => {
  return (
    <div className="mode-selector">
      <h3>Select Mode</h3>
      <div className="mode-buttons">
        <button
          className={`mode-button ${currentMode === 'single' ? 'active' : ''}`}
          onClick={() => onModeChange('single')}
        >
          <span className="mode-icon">🏠</span>
          <div className="mode-info">
            <h4>Personal Mode</h4>
            <p>Track and analyze your own food price data</p>
          </div>
        </button>
        
        <button
          className={`mode-button ${currentMode === 'global' ? 'active' : ''}`}
          onClick={() => onModeChange('global')}
        >
          <span className="mode-icon">🌍</span>
          <div className="mode-info">
            <h4>Global Mode</h4>
            <p>Contribute to and explore worldwide food price trends</p>
          </div>
        </button>
      </div>
      
      <div className="mode-description">
        {currentMode === 'single' ? (
          <p>Personal Mode: Upload and analyze your own dataset. Your data stays private and won't be shared globally.</p>
        ) : (
          <p>Global Mode: Join our citizen science project! Share verified food prices from your region and explore global trends.</p>
        )}
      </div>
    </div>
  );
};

ModeSelector.propTypes = {
  currentMode: PropTypes.oneOf(['single', 'global']).isRequired,
  onModeChange: PropTypes.func.isRequired
};

export default ModeSelector; 
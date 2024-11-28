import PropTypes from 'prop-types';
import './DeleteAllButton.css';

const DeleteAllButton = ({ onDeleteAll, mode, itemCount }) => {
  const handleClick = () => {
    if (window.confirm(`Are you sure you want to delete all ${itemCount} items? This action cannot be undone.`)) {
      onDeleteAll();
    }
  };

  return (
    <button 
      className="delete-all-button"
      onClick={handleClick}
      disabled={itemCount === 0}
    >
      Delete All {mode === 'global' ? 'Global' : 'Personal'} Items
    </button>
  );
};

DeleteAllButton.propTypes = {
  onDeleteAll: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  itemCount: PropTypes.number.isRequired
};

export default DeleteAllButton; 
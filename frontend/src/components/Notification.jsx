import PropTypes from 'prop-types'
import './Notification.css'

const Notification = ({ message = '', type = 'success' }) => {
  if (!message) return null

  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['success', 'error'])
}

export default Notification 
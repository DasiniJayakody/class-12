import React from 'react'

function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <h4>Error</h4>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default ErrorMessage

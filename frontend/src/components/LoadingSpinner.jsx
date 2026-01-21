import React from 'react'

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner">
        <div className="spinner-circle"></div>
      </div>
      <div className="loading-steps">
        <div className="loading-step">
          <span className="step-icon">📋</span>
          <span className="step-text">Planning query strategy...</span>
        </div>
        <div className="loading-step">
          <span className="step-icon">🔍</span>
          <span className="step-text">Retrieving relevant documents...</span>
        </div>
        <div className="loading-step">
          <span className="step-icon">✍️</span>
          <span className="step-text">Generating answer...</span>
        </div>
        <div className="loading-step">
          <span className="step-icon">✓</span>
          <span className="step-text">Verifying answer...</span>
        </div>
      </div>
      <p className="loading-message">AI is analyzing your question...</p>
    </div>
  )
}

export default LoadingSpinner

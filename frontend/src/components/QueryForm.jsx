import React, { useState } from 'react'

function QueryForm({ onSubmit, loading }) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      onSubmit(input)
      setInput('')
    }
  }

  const handleChange = (e) => {
    setInput(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      handleSubmit(e)
    }
  }

  return (
    <form className="query-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="question">Ask a Question</label>
        <div className="input-wrapper">
          <textarea
            id="question"
            value={input}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter your question... (e.g., 'What are the advantages of vector databases?')"
            disabled={loading}
            rows="3"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="submit-btn"
          >
            {loading ? 'Processing...' : 'Ask Question'}
          </button>
        </div>
        <div className="form-hint">
          💡 Tip: Ask complex, multi-part questions to see the query planner in action
        </div>
      </div>
    </form>
  )
}

export default QueryForm

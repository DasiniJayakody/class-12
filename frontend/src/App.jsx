import React, { useState } from 'react'
import './App.css'
import QueryForm from './components/QueryForm'
import QueryPlan from './components/QueryPlan'
import AnswerDisplay from './components/AnswerDisplay'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'

function App() {
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPlan, setShowPlan] = useState(true)

  const handleSubmit = async (q) => {
    if (!q.trim()) {
      setError('Please enter a question')
      return
    }

    setQuestion(q)
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('http://localhost:8000/qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: q })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to get answer')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setQuestion('')
    setResult(null)
    setError(null)
  }

  return (
    <div className="app">
      <div className="app-header">
        <div className="header-content">
          <h1>🤖 AI Query Planner</h1>
          <p className="subtitle">Multi-Agent RAG with Intelligent Query Decomposition</p>
        </div>
      </div>

      <div className="app-container">
        <div className="main-content">
          <QueryForm onSubmit={handleSubmit} loading={loading} />

          {error && <ErrorMessage message={error} />}

          {loading && <LoadingSpinner />}

          {result && (
            <div className="results-section">
              <div className="results-header">
                <h2>Query Analysis & Results</h2>
                <button className="reset-btn" onClick={handleReset}>
                  New Query
                </button>
              </div>

              {result.plan && (
                <div className="section-toggle">
                  <button
                    className="toggle-btn"
                    onClick={() => setShowPlan(!showPlan)}
                  >
                    {showPlan ? '▼' : '▶'} Query Planning Strategy
                  </button>
                </div>
              )}

              {result.plan && showPlan && (
                <QueryPlan plan={result.plan} subQuestions={result.sub_questions} />
              )}

              <AnswerDisplay
                answer={result.answer}
                context={result.context}
              />
            </div>
          )}

          {!loading && !result && !error && (
            <div className="welcome-message">
              <div className="welcome-icon">📚</div>
              <h2>Welcome to the Query Planner</h2>
              <p>Ask any question about the indexed documents.</p>
              <p className="info">The system will automatically:</p>
              <ul className="info-list">
                <li>✓ Analyze and decompose complex questions</li>
                <li>✓ Create an intelligent search strategy</li>
                <li>✓ Retrieve relevant context from the database</li>
                <li>✓ Generate a verified answer</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="app-footer">
        <p>Powered by LangChain & LangGraph | Multi-Agent RAG System</p>
      </div>
    </div>
  )
}

export default App

import React from 'react'

function QueryPlan({ plan, subQuestions }) {
  return (
    <div className="query-plan">
      <div className="plan-header">
        <h3>🔍 Query Planning Strategy</h3>
      </div>

      <div className="plan-content">
        <div className="plan-text">
          {plan.split('\n').map((line, idx) => {
            if (!line.trim()) return null
            return (
              <p key={idx} className={line.startsWith('Original') || line.startsWith('Rephrased') ? 'plan-highlight' : ''}>
                {line}
              </p>
            )
          })}
        </div>
      </div>

      {subQuestions && subQuestions.length > 0 && (
        <div className="sub-questions">
          <h4>Sub-Questions to Retrieve:</h4>
          <ul className="sub-questions-list">
            {subQuestions.map((q, idx) => (
              <li key={idx} className="sub-question-item">
                <span className="question-number">{idx + 1}</span>
                <span className="question-text">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default QueryPlan

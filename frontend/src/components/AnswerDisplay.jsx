import React, { useState } from 'react'

function AnswerDisplay({ answer, context }) {
  const [showContext, setShowContext] = useState(false)

  return (
    <div className="answer-display">
      <div className="answer-section">
        <h3>✅ Final Answer</h3>
        <div className="answer-content">
          {answer ? (
            answer.split('\n').map((line, idx) => {
              if (!line.trim()) return <br key={idx} />
              return (
                <p key={idx} className={line.startsWith('•') || line.startsWith('-') ? 'answer-list-item' : ''}>
                  {line}
                </p>
              )
            })
          ) : (
            <p className="no-answer">No answer could be generated based on the retrieved context.</p>
          )}
        </div>
      </div>

      {context && (
        <div className="context-section">
          <button
            className="context-toggle-btn"
            onClick={() => setShowContext(!showContext)}
          >
            {showContext ? '▼' : '▶'} Retrieved Context ({countChunks(context)} chunks)
          </button>

          {showContext && (
            <div className="context-content">
              {context.split('\n\n').map((chunk, idx) => {
                if (!chunk.trim()) return null
                return (
                  <div key={idx} className="context-chunk">
                    {chunk.split('\n').map((line, lineIdx) => (
                      <p key={lineIdx}>{line}</p>
                    ))}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function countChunks(context) {
  if (!context) return 0
  return context.split('Chunk').length - 1
}

export default AnswerDisplay

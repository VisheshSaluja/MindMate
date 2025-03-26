import React, { useState } from 'react';
import './SelfAssessment.css';

const questions = [
  { id: 1, text: "Have you been feeling down, depressed, or hopeless recently?", options: ['Yes', 'No'] },
  { id: 2, text: "Have you had trouble sleeping or staying asleep?", options: ['Yes', 'No'] },
  { id: 3, text: "Have you felt anxious or on edge frequently?", options: ['Yes', 'No'] }
];

const SelfAssessment = ({ onScoreUpdate }) => {
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionId, answer) => {
    setResponses(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    if (Object.keys(responses).length !== questions.length) return;
    const score = Object.values(responses).filter(r => r === 'Yes').length;
    setSubmitted(true);
    onScoreUpdate && onScoreUpdate(score);
  };

  const score = Object.values(responses).filter(r => r === 'Yes').length;

  return (
    <div className="self-assessment">
      <h3>Self-Assessment Check-In</h3>
      {questions.map(q => (
        <div key={q.id} className="question-block">
          <p>{q.text}</p>
          {q.options.map(opt => (
            <label key={opt}>
              <input
                type="radio"
                name={`question-${q.id}`}
                value={opt}
                checked={responses[q.id] === opt}
                onChange={() => handleSelect(q.id, opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
      {submitted && (
        <div className="assessment-result">
          <h4>Assessment Result:</h4>
          <p>You answered "Yes" to {score} out of {questions.length} questions.</p>
        </div>
      )}
    </div>
  );
};

export default SelfAssessment;
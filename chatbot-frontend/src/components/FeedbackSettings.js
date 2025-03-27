import React, { useState } from 'react';
import './FeedbackSettings.css';

const FeedbackSettings = ({ tone, setTone }) => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (feedback.trim()) {
      console.log('User feedback:', feedback);
      setFeedback('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="feedback-settings">
      <h3>Customize Chatbot</h3>
      <div className="tone-selector">
        <label>Choose tone:</label>
        <select value={tone} onChange={(e) => setTone(e.target.value)}>
          <option value="friendly">Friendly</option>
          <option value="professional">Professional</option>
        </select>
      </div>
      <form onSubmit={handleFeedbackSubmit} className="feedback-form">
        <label>Your Feedback:</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us what you think..."
        />
        <button type="submit">Submit</button>
        {submitted && <p className="thanks-msg">Thanks for your feedback!</p>}
      </form>
    </div>
  );
};

export default FeedbackSettings;
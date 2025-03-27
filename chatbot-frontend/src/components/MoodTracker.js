import React, { useState } from 'react';
import './MoodTracker.css';

const MoodTracker = ({ onMoodChange }) => {
  const [moods, setMoods] = useState(() => {
    const saved = localStorage.getItem('mood-logs');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedMood, setSelectedMood] = useState('');

  const handleMoodSubmit = () => {
    if (!selectedMood) return;
    const today = new Date().toLocaleDateString();
    const newEntry = { date: today, mood: selectedMood };
    const updated = [...moods.filter(m => m.date !== today), newEntry];
    setMoods(updated);
    localStorage.setItem('mood-logs', JSON.stringify(updated));
    setSelectedMood('');
    onMoodChange && onMoodChange(selectedMood);
  };

  const moodOptions = ['😄 Happy', '😐 Neutral', '😞 Sad', '😡 Angry', '😰 Anxious'];

  return (
    <div className="mood-tracker">
      <h3>How are you feeling today?</h3>
      <div className="mood-options">
        {moodOptions.map((mood) => (
          <button
            key={mood}
            className={selectedMood === mood ? 'selected' : ''}
            onClick={() => setSelectedMood(mood)}
          >
            {mood}
          </button>
        ))}
      </div>
      <button onClick={handleMoodSubmit}>Log Mood</button>
      <div className="mood-log">
        <h4>Recent Moods:</h4>
        <ul>
          {moods.slice(-5).reverse().map((m, idx) => (
            <li key={idx}>{m.date}: {m.mood}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MoodTracker;
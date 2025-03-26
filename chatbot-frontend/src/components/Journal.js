import React, { useState } from 'react';
import './Journal.css';

const Journal = () => {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('journal-entries');
    return saved ? JSON.parse(saved) : [];
  });

  const handleSave = () => {
    if (!entry.trim()) return;
    const newEntry = { date: new Date().toLocaleString(), text: entry.trim() };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('journal-entries', JSON.stringify(updated));
    setEntry('');
  };

  return (
    <div className="journal">
      <h3>📝 Your Journal</h3>
      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Write your thoughts here..."
      />
      <button onClick={handleSave}>Save Entry</button>
      <div className="journal-history">
        <h4>Previous Entries</h4>
        <ul>
          {entries.map((e, i) => (
            <li key={i}>
              <strong>{e.date}</strong>
              <p>{e.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Journal;
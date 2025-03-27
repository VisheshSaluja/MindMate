import React, { useState, useEffect } from 'react';
import './Journal.css';

function Journal() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch journal entries from backend
  const fetchEntries = async () => {
    try {
      const response = await fetch('http://localhost:8000/journal');
      const data = await response.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error('❌ Error fetching journal entries:', error);
    }
  };

  // Add a new journal entry
  const addEntry = async () => {
    if (!newEntry.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newEntry })
      });

      if (response.ok) {
        setNewEntry('');
        fetchEntries(); // Refresh entries after adding
      }
    } catch (error) {
      console.error('❌ Error adding journal entry:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="journal-container">
      <h2>📚 Your Journal</h2>

      <div className="journal-input">
        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="Write about your day or feelings..."
        />
        <button onClick={addEntry} disabled={loading}>
          {loading ? 'Saving...' : 'Add Entry'}
        </button>
      </div>

      <div className="journal-entries">
        {entries.length === 0 ? (
          <p className="no-entries">No journal entries yet. Start by writing something!</p>
        ) : (
          entries.map((entry, idx) => (
            <div key={idx} className="journal-entry">
              <p>{entry.content}</p>
              <span className="entry-date">{new Date(entry.timestamp).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Journal;

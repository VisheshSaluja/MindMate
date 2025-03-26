import React, { useState } from 'react';
import './App.css';
import { FaComments, FaSmile, FaClipboardList, FaBook, FaCogs, FaHeartbeat, FaHome, FaLightbulb } from 'react-icons/fa';

import Home from './components/Home';
import Chatbot from './components/Chatbot';
import MoodTracker from './components/MoodTracker';
import SelfAssessment from './components/SelfAssessment';
import Journal from './components/Journal';
import FeedbackSettings from './components/FeedbackSettings';
import EmergencySupport from './components/EmergencySupport';
import Recommendations from './components/Recommendations';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [tone, setTone] = useState('friendly');
  const [mood, setMood] = useState('');
  const [score, setScore] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case 'chat': return <Chatbot tone={tone} />;
      case 'mood': return <MoodTracker onMoodChange={setMood} />;
      case 'assessment': return <SelfAssessment onScoreUpdate={setScore} />;
      case 'journal': return <Journal />;
      case 'feedback': return <FeedbackSettings tone={tone} setTone={setTone} />;
      case 'emergency': return <EmergencySupport />;
      case 'recommendations': return <Recommendations mood={mood} assessmentScore={score} />;
      default: return <Home />;
    }
  };

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      <nav className="nav">
        <button onClick={() => setActiveTab('home')}><FaHome /> Home</button>
        <button onClick={() => setActiveTab('chat')}><FaComments /> Chatbot</button>
        <button onClick={() => setActiveTab('mood')}><FaSmile /> Mood</button>
        <button onClick={() => setActiveTab('assessment')}><FaClipboardList /> Assessment</button>
        <button onClick={() => setActiveTab('journal')}><FaBook /> Journal</button>
        <button onClick={() => setActiveTab('feedback')}><FaCogs /> Feedback</button>
        <button onClick={() => setActiveTab('emergency')}><FaHeartbeat /> Emergency</button>
        <button onClick={() => setActiveTab('recommendations')}><FaLightbulb /> Tips</button>
        <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </nav>
      <div className="tab-container">{renderTab()}</div>
    </div>
  );
}

export default App;

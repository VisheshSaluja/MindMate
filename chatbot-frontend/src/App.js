import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

import Home from './components/Home';
import Login from './pages/Login';
import Chatbot from './pages/Chatbot';
import Journal from './pages/Journal'; // Import Journal

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <div className="App">
        {isLoggedIn && (
          <nav className="nav-bar">
            <Link to="/chat" className="nav-link">
              🤖 Chatbot
            </Link>
            <Link to="/journal" className="nav-link">
              📚 Journal
            </Link>
            <button
              className="nav-link logout-btn"
              onClick={() => {
                localStorage.removeItem('token');
                setIsLoggedIn(false);
              }}
            >
              🚪 Logout
            </button>
          </nav>
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/chat" element={isLoggedIn ? <Chatbot /> : <Navigate to="/login" />} />
          <Route path="/journal" element={isLoggedIn ? <Journal /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

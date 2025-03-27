import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-card">
        <h1>🧠 MindMate</h1>
        <p>Your personal mental wellness companion.</p>
        <p>Navigate through your thoughts, emotions, and goals with guidance.</p>
        <button className="login-button" onClick={() => navigate('/login')}>
          Open your mind → Log In
        </button>
      </div>
    </div>
  );
};

export default Home;

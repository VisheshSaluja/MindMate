// Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { ArrowRight } from "lucide-react"; // optional icon

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="tag top-tag">Breathe</div>
      <h1 className="main-title">
        In Calm, <br /> Breathe out
      </h1>
      <div className="tag bottom-tag">Happiness.</div>

      <p className="subtitle">
        Discover tranquility amid chaos, prioritize self-care with MindMate.
      </p>

      <button className="journey-button" onClick={() => navigate("/login")}>
        Begin your journey
        <ArrowRight size={20} className="arrow-icon" />
      </button>
    </div>
  );
};

export default Home;

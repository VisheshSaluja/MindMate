import React, { useEffect, useState } from 'react';
import './Recommendations.css';

const resourceMap = {
  happy: ["Keep a gratitude journal to extend the good vibes ✨", "Try sharing your mood with a friend!"],
  neutral: ["Try a short breathing exercise to recharge 🧘‍♀️", "Listen to calming music or take a walk"],
  sad: ["This 5-minute meditation might help: https://www.youtube.com/watch?v=inpok4MKVLM", "Consider journaling your thoughts or talking to someone"],
  anxious: ["Try a grounding technique: 5 things you can see, 4 you can touch...", "Practice box breathing (inhale 4s – hold 4s – exhale 4s – hold 4s)"],
  default: ["Explore https://www.mentalhealth.gov for helpful resources", "Check out https://www.mhanational.org for assessments and guidance"]
};

const Recommendations = ({ mood, assessmentScore }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const moodKey = (mood || '').toLowerCase().split(' ')[1]; // e.g., 😞 Sad → 'sad'
    let base = resourceMap[moodKey] || resourceMap.default;
    if (assessmentScore >= 2) {
      base = [...base, "⚠️ You may benefit from speaking to a counselor or therapist."];
    }
    setSuggestions(base);
  }, [mood, assessmentScore]);

  return (
    <div className="recommendations">
      <h3>🎯 Personalized Recommendations</h3>
      <ul>
        {suggestions.map((tip, idx) => <li key={idx}>{tip}</li>)}
      </ul>
    </div>
  );
};

export default Recommendations;
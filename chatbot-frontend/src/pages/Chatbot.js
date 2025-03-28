







import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import { useNavigate } from 'react-router-dom';

function Chatbot({ tone = 'friendly' }) {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a compassionate mental health assistant named MindMate.' },
    { role: 'assistant', content: 'Hello! How can I support you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState('neutral');
  const [followupQuestions, setFollowupQuestions] = useState([]);
  const [followupIndex, setFollowupIndex] = useState(0);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [showJournalButton, setShowJournalButton] = useState(false);
  const [conversationMode, setConversationMode] = useState('normal');
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // Voice recognition setup
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      recognitionRef.current?.start();
      setListening(true);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    if (conversationMode === 'followup' && followupIndex < followupQuestions.length) {
      sendNextFollowup(updatedMessages);
      setInput('');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, tone, mood })
      });

      const data = await response.json();
      const botMsg = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, botMsg]);

      if (updatedMessages.length >= 3 && !assessmentCompleted) {
        fetchFollowupQuestions(mood);
      }

      if (updatedMessages.length >= 3) {
        setShowJournalButton(true);
      }
    } catch (error) {
      console.error("❌ Chatbot error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    }

    setLoading(false);
    setInput('');
  };

  const fetchFollowupQuestions = async (mood) => {
    try {
      const response = await fetch('http://localhost:8000/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood })
      });

      const data = await response.json();
      setFollowupQuestions(data.questions);
      setConversationMode('followup');
      setFollowupIndex(0);
    } catch (error) {
      console.error("❌ Failed to fetch follow-up questions:", error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I’m unable to generate follow-up questions right now.' }
      ]);
    }
  };

  const sendNextFollowup = (updatedMessages) => {
    if (followupIndex < followupQuestions.length) {
      const nextQuestion = followupQuestions[followupIndex];
      setMessages([...updatedMessages, { role: 'assistant', content: nextQuestion }]);
      setFollowupIndex(followupIndex + 1);
    } else {
      setAssessmentCompleted(true);
      setConversationMode('normal');
      sendDynamicMoodResponse(mood, updatedMessages);
    }
  };

  const sendDynamicMoodResponse = async (mood, updatedMessages) => {
    try {
      const response = await fetch('http://localhost:8000/dynamic-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood })
      });

      const data = await response.json();
      const botMsg = { role: 'assistant', content: data.response };
      setMessages([...updatedMessages, botMsg]);
    } catch (error) {
      console.error('❌ Failed to generate dynamic response:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Let’s continue with something helpful for you.' }
      ]);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages
          .filter(msg => msg.role !== 'system')
          .map((msg, idx) => (
            <div key={idx} className={`message ${msg.role === 'user' ? 'user' : 'bot'}`}>
              {msg.content}
            </div>
        ))}
        {loading && <div className="message bot">Typing...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? 'Loading...' : 'Send'}
        </button>
        <button onClick={toggleListening} className="mic-button">
          {listening ? '🎙️ Listening...' : '🎤 Speak'}
        </button>
      </div>

      {showJournalButton && (
        <div className="journal-button-container">
          <button className="journal-button" onClick={() => navigate('/journal')}>
            📚 Open Journal
          </button>
        </div>
      )}
    </div>
  );
}

export default Chatbot;















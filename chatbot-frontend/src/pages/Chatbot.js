import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

function Chatbot({ tone = 'friendly' }) {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a compassionate mental health assistant named MindMate.' },
    { role: 'assistant', content: 'Hello! How can I support you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    console.log("✉️ Sending message:", input);
    console.log("📤 Full payload:", { messages: updatedMessages, tone });

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, tone })
      });

      const data = await response.json();
      console.log("🤖 Bot response from backend:", data);

      const botMsg = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("❌ Chatbot error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    }

    setLoading(false);
    setInput('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;

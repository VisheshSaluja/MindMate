// import React, { useState, useEffect, useRef } from 'react';
// import './Chatbot.css';

// function Chatbot({ tone = 'friendly' }) {
//   const [messages, setMessages] = useState([
//     { role: 'system', content: 'You are a compassionate mental health assistant named MindMate.' },
//     { role: 'assistant', content: 'Hello! How can I support you today?' }
//   ]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const chatEndRef = useRef(null);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMsg = { role: 'user', content: input };
//     const updatedMessages = [...messages, userMsg];
//     setMessages(updatedMessages);
//     setLoading(true);

//     console.log("✉️ Sending message:", input);
//     console.log("📤 Full payload:", { messages: updatedMessages, tone });

//     try {
//       const response = await fetch('http://localhost:8000/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ messages: updatedMessages, tone })
//       });

//       const data = await response.json();
//       console.log("🤖 Bot response from backend:", data);

//       const botMsg = { role: 'assistant', content: data.response };
//       setMessages(prev => [...prev, botMsg]);
//     } catch (error) {
//       console.error("❌ Chatbot error:", error);
//       setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
//     }

//     setLoading(false);
//     setInput('');
//   };

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, loading]);

//   return (
//     <div className="chat-container">
//       <div className="chat-window">
//         {messages
//           .filter(msg => msg.role !== 'system')
//           .map((msg, idx) => (
//             <div key={idx} className={`message ${msg.role === 'user' ? 'user' : 'bot'}`}>
//               {msg.content}
//             </div>
//         ))}
//         {loading && <div className="message bot">Typing...</div>}
//         <div ref={chatEndRef} />
//       </div>

//       <div className="chat-input">
//         <input
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           placeholder="Type your message..."
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// }

// export default Chatbot;




// import React, { useState, useEffect, useRef } from 'react';
// import './Chatbot.css';

// function Chatbot({ tone = 'friendly' }) {
//   const [messages, setMessages] = useState([
//     { role: 'system', content: 'You are a compassionate mental health assistant named MindMate.' },
//     { role: 'assistant', content: 'Hello! How can I support you today?' }
//   ]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [mood, setMood] = useState('neutral');
//   const [assessmentTriggered, setAssessmentTriggered] = useState(false);
//   const chatEndRef = useRef(null);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMsg = { role: 'user', content: input };
//     const updatedMessages = [...messages, userMsg];
//     setMessages(updatedMessages);
//     setLoading(true);

//     console.log("✉️ Sending message:", input);
//     console.log("📤 Full payload:", { messages: updatedMessages, tone, mood });

//     try {
//       const response = await fetch('http://localhost:8000/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ messages: updatedMessages, tone, mood })
//       });

//       const data = await response.json();
//       console.log("🤖 Bot response from backend:", data);

//       const botMsg = { role: 'assistant', content: data.response };
//       setMessages(prev => [...prev, botMsg]);
//       setMood(data.mood); // Update mood based on analysis
//       if (data.assessment_trigger) {
//         setAssessmentTriggered(true);
//       }
//     } catch (error) {
//       console.error("❌ Chatbot error:", error);
//       setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
//     }

//     setLoading(false);
//     setInput('');
//   };

//   // Prompt self-assessment if triggered
//   useEffect(() => {
//     if (assessmentTriggered) {
//       const assessmentMsg = {
//         role: 'assistant',
//         content: 'You’ve been talking with me for a while. Would you like to do a quick self-assessment to reflect on your emotions? 😊'
//       };
//       setMessages(prev => [...prev, assessmentMsg]);
//       setAssessmentTriggered(false); // Reset trigger
//     }
//   }, [assessmentTriggered]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, loading]);

//   return (
//     <div className="chat-container">
//       <div className="chat-window">
//         {messages
//           .filter(msg => msg.role !== 'system')
//           .map((msg, idx) => (
//             <div key={idx} className={`message ${msg.role === 'user' ? 'user' : 'bot'}`}>
//               {msg.content}
//             </div>
//         ))}
//         {loading && <div className="message bot">Typing...</div>}
//         <div ref={chatEndRef} />
//       </div>

//       <div className="chat-input">
//         <input
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           placeholder="Type your message..."
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// }

// export default Chatbot;

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
  const [conversationMode, setConversationMode] = useState('normal'); // normal or followup
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // Send message to backend
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    // Handle Follow-Up Questions if active
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

      // Trigger follow-up questions dynamically after 3 messages
      if (updatedMessages.length >= 3 && !assessmentCompleted) {
        fetchFollowupQuestions(mood);
      }

      // Show journal button after 3 messages
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

  // Fetch follow-up questions dynamically based on mood
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

  // Send follow-up questions one by one
  const sendNextFollowup = (updatedMessages) => {
    if (followupIndex < followupQuestions.length) {
      const nextQuestion = followupQuestions[followupIndex];
      setMessages([...updatedMessages, { role: 'assistant', content: nextQuestion }]);
      setFollowupIndex(followupIndex + 1);
    } else {
      setAssessmentCompleted(true);
      setConversationMode('normal'); // Switch back to normal mode after follow-up
      sendDynamicMoodResponse(mood, updatedMessages);
    }
  };

  // Continue conversation after follow-up based on mood
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

  // Auto-scroll to bottom of chat
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
      </div>

      {/* Button to Open Journal */}
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

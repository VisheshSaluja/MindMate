import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate('/chat');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(to right, #f5f7fa, #c3cfe2)',
      padding: '2rem',
    },
    card: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '2rem',
      boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
      textAlign: 'center',
      maxWidth: '400px',
      width: '100%',
    },
    heading: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '1rem',
    },
    image: {
      width: '100%',
      height: 'auto',
      borderRadius: '1rem',
      marginBottom: '1.5rem',
    },
    button: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      backgroundColor: '#5e2ca5',
      color: 'white',
      border: 'none',
      borderRadius: '2rem',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>It’s Ok Not To Be OKAY !!</h2>
        <img
          src="/meditation.jpg"
          alt="mental health support"
          style={styles.image}
        />
        <button style={styles.button} onClick={handleChatClick}>
          Let Us Help You
        </button>
      </div>
    </div>
  );
}

export default Home;

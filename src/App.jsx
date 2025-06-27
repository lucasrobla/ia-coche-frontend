import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: 'Eres un asesor experto en coches. Tu misión es ayudar al usuario a encontrar el coche ideal mediante conversación personalizada.',
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('https://ia-coche-backend.onrender.com/chat', {
        messages: newMessages,
      });

      setMessages([...newMessages, res.data.response]);
    } catch (err) {
      alert('Error al conectar con el servidor');
      console.error(err);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const styles = createStyles(darkMode);

  return (
    <div style={styles.page}>
      <div style={styles.chatContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>🚗 MotorMatch IA</h1>
          <button onClick={() => setDarkMode(!darkMode)} style={styles.toggleBtn}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <div style={styles.chatBox}>
          {messages
            .filter((m) => m.role !== 'system')
            .map((msg, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.message,
                  ...(msg.role === 'user' ? styles.userMsg : styles.botMsg),
                  animation: 'fadeIn 0.4s ease',
                }}
              >
                {msg.content}
              </div>
            ))}
          {loading && <div style={{ ...styles.botMsg, animation: 'fadeIn 0.4s ease' }}>Pensando...</div>}
          <div ref={chatEndRef} />
        </div>
        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.button}>Enviar</button>
        </div>
      </div>

      {/* Animación inline */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// 🎨 Función que genera estilos según el modo (oscuro o claro)
function createStyles(dark) {
  const colors = dark
    ? {
        bg: '#1e1e1e',
        card: '#2c2c2c',
        bubbleUser: '#0d6efd',
        bubbleBot: '#343a40',
        text: '#fff',
        input: '#343a40',
      }
    : {
        bg: '#f8f9fa',
        card: '#ffffff',
        bubbleUser: '#007bff',
        bubbleBot: '#e9ecef',
        text: '#000',
        input: '#dee2e6',
      };

  return {
    page: {
      backgroundColor: colors.bg,
      color: colors.text,
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem',
      transition: 'background 0.3s ease, color 0.3s ease',
    },
    chatContainer: {
      width: '100%',
      maxWidth: '720px',
      height: '90vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.card,
      borderRadius: '12px',
      padding: '1rem',
      boxShadow: '0 0 20px rgba(0,0,0,0.3)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: '1.6rem',
      marginBottom: '1rem',
    },
    toggleBtn: {
      fontSize: '1.3rem',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
    },
    chatBox: {
      flex: 1,
      overflowY: 'auto',
      padding: '0.5rem',
      backgroundColor: dark ? '#202020' : '#f1f1f1',
      borderRadius: '10px',
      marginBottom: '1rem',
    },
    message: {
      padding: '12px 16px',
      borderRadius: '20px',
      margin: '8px 0',
      maxWidth: '75%',
      whiteSpace: 'pre-wrap',
      lineHeight: '1.5',
    },
    userMsg: {
      backgroundColor: colors.bubbleUser,
      color: 'white',
      alignSelf: 'flex-end',
      marginLeft: 'auto',
    },
    botMsg: {
      backgroundColor: colors.bubbleBot,
      color: dark ? 'white' : 'black',
      alignSelf: 'flex-start',
      marginRight: 'auto',
    },
    inputContainer: {
      display: 'flex',
      gap: '0.5rem',
    },
    input: {
      flex: 1,
      padding: '0.75rem',
      borderRadius: '8px',
      border: 'none',
      fontSize: '1rem',
      backgroundColor: colors.input,
      color: colors.text,
    },
    button: {
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      backgroundColor: '#198754',
      color: 'white',
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
    },
  };
}

export default App;

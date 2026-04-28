import { useState } from 'react';
import { motion } from 'framer-motion';

// Simple markdown-like renderer
function renderText(text) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((p, j) => {
      if (p.startsWith('**') && p.endsWith('**')) {
        return <strong key={j}>{p.slice(2, -2)}</strong>;
      }
      return p;
    });
    return <span key={i}>{rendered}{i < lines.length - 1 && <br />}</span>;
  });
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message, index }) {
  const isUser = message.role === 'user';
  const [feedback, setFeedback] = useState(null); // 'up' or 'down'

  return (
    <motion.div
      className={`message-row ${isUser ? 'user' : 'bot'}`}
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Avatar */}
      <div className={`avatar ${isUser ? 'user' : 'bot'}`}>
        {isUser ? '👤' : '🌿'}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: isUser ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
        {/* Name + time */}
        <div style={{
          fontSize: '0.7rem', color: 'var(--text-secondary)',
          display: 'flex', gap: '0.5rem', alignItems: 'center',
          flexDirection: isUser ? 'row-reverse' : 'row'
        }}>
          <span style={{ fontWeight: 600 }}>{isUser ? 'You' : 'EcoBot'}</span>
          <span>{formatTime(new Date(message.time))}</span>
        </div>

        {/* Bubble */}
        <div style={{ display:'flex', alignItems:'flex-end', gap:'0.5rem', flexDirection: isUser ? 'row-reverse' : 'row' }}>
          <motion.div
            className={`bubble ${isUser ? 'user' : 'bot'}`}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.15 }}
            style={{ position:'relative' }}
          >
            {renderText(message.text)}
          </motion.div>

          {/* Feedback buttons for bot messages */}
          {!isUser && (
            <div style={{ display:'flex', gap:'0.25rem', marginBottom:'0.5rem', opacity: feedback ? 1 : 0.4 }}>
              <motion.button
                whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                onClick={() => setFeedback('up')}
                style={{ 
                  background:'none', border:'none', cursor:'pointer', fontSize:'0.85rem',
                  filter: feedback === 'down' ? 'grayscale(1)' : 'none',
                  color: feedback === 'up' ? 'var(--accent-green)' : 'var(--text-secondary)'
                }}
              >
                👍
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                onClick={() => setFeedback('down')}
                style={{ 
                  background:'none', border:'none', cursor:'pointer', fontSize:'0.85rem',
                  filter: feedback === 'up' ? 'grayscale(1)' : 'none',
                  color: feedback === 'down' ? '#ff5252' : 'var(--text-secondary)'
                }}
              >
                👎
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

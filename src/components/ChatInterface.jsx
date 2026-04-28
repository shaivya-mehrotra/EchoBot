import { useRef, useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { getChatResponse } from '../utils/chatService';
import { useVoice } from '../hooks/useVoice';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import VoiceButton from './VoiceButton';

const QUICK_PROMPTS = [
  { icon:'🌍', text:'My carbon footprint' },
  { icon:'💧', text:'Save water tips' },
  { icon:'⚡', text:'Cut my energy use' },
  { icon:'😄', text:'Tell me a joke' },
  { icon:'🤓', text:'Surprise me with a fact' },
  { icon:'💪', text:'Motivate me!' },
  { icon:'🥗', text:'Eco-friendly diet' },
  { icon:'🚲', text:'Green transport' },
  { icon:'♻️', text:'Zero waste tips' },
  { icon:'🎯', text:'My eco score' },
];

export default function ChatInterface() {
  const { 
    messages, addMessage, stats, updateStats, 
    isTyping, setTyping, botPersonality, isMemoryEnabled 
  } = useApp();
  const [input, setInput]       = useState('');
  const [voiceErr, setVoiceErr] = useState('');
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;
    setInput('');
    addMessage('user', trimmed);
    setTyping(true);

    try {
      const settings = { personality: botPersonality, isMemoryEnabled };
      const { text: reply, statsDelta } = await getChatResponse(trimmed, stats, settings, messages);
      addMessage('bot', reply);
      if (statsDelta) updateStats(statsDelta);
    } catch {
      addMessage('bot', '🌿 Sorry, I had a hiccup! Please try again. Remember: every eco-question matters! 💚');
    } finally {
      setTyping(false);
    }
  }, [input, addMessage, stats, updateStats, setTyping, botPersonality, isMemoryEnabled, messages]);

  const { listening, speaking, startListening, stopListening, speak, stopSpeaking } = useVoice({
    onResult: (transcript) => handleSend(transcript),
    onError: (err) => setVoiceErr(`Voice error: ${err}`),
  });

  // TTS for last bot message
  useEffect(() => {
    const last = [...messages].reverse().find(m => m.role === 'bot');
    if (last && messages.length > 1) speak(last.text);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-grow textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
  };

  return (
    <div className="chat-container">
      {/* Messages */}
      <div className="messages-area">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <MessageBubble key={msg.id} message={msg} index={i} />
          ))}
          {isTyping && <TypingIndicator key="typing" />}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: '0.5rem 1.5rem 0', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
        >
          {QUICK_PROMPTS.map(p => (
            <button
              key={p.text}
              className="tip-chip"
              onClick={() => handleSend(p.text)}
            >
              {p.icon} {p.text}
            </button>
          ))}
        </motion.div>
      )}

      {/* Voice error */}
      <AnimatePresence>
        {voiceErr && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ padding: '0.25rem 1.5rem', fontSize: '0.75rem', color: '#ff5252' }}
          >
            {voiceErr}
            <button onClick={() => setVoiceErr('')} style={{ marginLeft: 8, color: 'inherit', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Listening banner */}
      <AnimatePresence>
        {listening && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            style={{
              padding: '0.5rem 1.5rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontSize: '0.8rem', color: '#ff5252', fontWeight: 600,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5252', display: 'inline-block', animation: 'pulse-ring 1s infinite' }} />
            Listening… speak now
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar */}
      <div className="input-bar glass" style={{ borderRadius: 0 }}>
        <VoiceButton
          listening={listening}
          speaking={speaking}
          onToggle={listening ? stopListening : startListening}
          onStopSpeak={stopSpeaking}
        />

        <textarea
          ref={textareaRef}
          className="chat-input"
          placeholder="Ask EcoBot anything about sustainability… 🌿"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          rows={1}
          aria-label="Chat input"
        />

        <motion.button
          className="send-btn gradient-btn"
          style={{ borderRadius: '50%' }}
          onClick={() => handleSend()}
          disabled={!input.trim() && !isTyping}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          aria-label="Send message"
          data-tip="Send (Enter)"
        >
          ➤
        </motion.button>
      </div>
    </div>
  );
}

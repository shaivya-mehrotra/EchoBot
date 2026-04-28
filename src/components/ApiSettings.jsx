import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStoredApiKey, saveApiKey, clearApiKey } from '../utils/chatService';

export default function ApiSettings({ isOpen, onClose }) {
  const [key, setKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKey(getStoredApiKey());
      setSaved(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    saveApiKey(key);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  const handleClear = () => {
    clearApiKey();
    setKey('');
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" style={{
          position:'fixed', top:0, left:0, right:0, bottom:0,
          background:'rgba(0,0,0,0.7)', backdropFilter:'blur(5px)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000
        }}>
          <motion.div
            initial={{ scale:0.9, opacity:0 }}
            animate={{ scale:1, opacity:1 }}
            exit={{ scale:0.9, opacity:0 }}
            className="glass"
            style={{
              width:'90%', maxWidth:400, padding:'2rem', borderRadius:24,
              border:'1px solid rgba(255,255,255,0.1)', position:'relative'
            }}
          >
            <button
              onClick={onClose}
              style={{
                position:'absolute', top:15, right:15, background:'none', border:'none',
                color:'var(--text-secondary)', cursor:'pointer', fontSize:'1.2rem'
              }}
            >
              ✕
            </button>

            <h2 style={{ marginTop:0, fontSize:'1.4rem', color:'var(--accent-green)', display:'flex', alignItems:'center', gap:'0.5rem' }}>
              🤖 AI Settings
            </h2>
            <p style={{ fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'1.5rem' }}>
              Configure your AI API key. We support **Google Gemini** (AIza...) and **Groq** (gsk_...) keys.
            </p>

            <div style={{ marginBottom:'1.5rem' }}>
              <label style={{ display:'block', fontSize:'0.75rem', fontWeight:700, marginBottom:8, color:'var(--text-secondary)' }}>
                API KEY
              </label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter your API key here..."
                style={{
                  width:'100%', padding:'0.8rem 1rem', borderRadius:12,
                  background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)',
                  color:'white', fontSize:'0.9rem', outline:'none'
                }}
              />
              <p style={{ fontSize:'0.7rem', color:'#888', marginTop:8 }}>
                {key.startsWith('gsk_') ? '✅ Groq key detected' : key.startsWith('AIza') ? '✅ Gemini key detected' : '⚠️ Key should start with AIza (Gemini) or gsk (Groq)'}
              </p>
            </div>

            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button
                onClick={handleSave}
                className="gradient-btn"
                style={{ flex:1, padding:'0.75rem', fontSize:'0.9rem' }}
              >
                {saved ? 'Saved! ✨' : 'Save Key'}
              </button>
              <button
                onClick={handleClear}
                style={{
                  padding:'0.75rem 1rem', borderRadius:12, background:'rgba(255,50,50,0.1)',
                  border:'1px solid rgba(255,50,50,0.2)', color:'#ff5252',
                  fontSize:'0.9rem', cursor:'pointer'
                }}
              >
                Clear
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

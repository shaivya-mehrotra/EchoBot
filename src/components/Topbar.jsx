import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { getStoredApiKey } from '../utils/chatService';

export default function Topbar({ onOpenSettings }) {
  const { theme, toggleTheme, setSidebarOpen, sidebarOpen, page } = useApp();
  const apiKey = getStoredApiKey();
  const hasApiKey = !!(import.meta.env.VITE_GEMINI_API_KEY || apiKey);
  const isGroq = apiKey.startsWith('gsk_');

  const titles = {
    chat:      { icon:'💬', label:'EcoChat' },
    dashboard: { icon:'📊', label:'Dashboard' },
    tips:      { icon:'💡', label:'Eco Tips' },
    tracker:   { icon:'🎯', label:'Tracker' },
  };
  const current = titles[page] || titles.chat;

  return (
    <div className="topbar glass" style={{ borderRadius:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
        <button
          className="mobile-menu-btn"
          style={{ display:'flex' }}
          onClick={() => setSidebarOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
        <span style={{ fontSize:'1.3rem' }}>{current.icon}</span>
        <h1 style={{ fontSize:'1.1rem', fontWeight:700, margin:0 }}>{current.label}</h1>
        <span style={{
          fontSize:'0.68rem', padding:'2px 10px', borderRadius:'99px', fontWeight:600,
          background:'rgba(0,230,118,0.12)', color:'var(--accent-green)',
          border:'1px solid rgba(0,230,118,0.25)'
        }}>AI-Powered</span>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
        {/* API key status pill */}
        <motion.button
          onClick={onOpenSettings}
          whileTap={{ scale:0.95 }}
          data-tip={hasApiKey ? `${isGroq ? 'Groq' : 'Gemini'} AI active` : 'Add API key for AI responses'}
          style={{
            display:'flex', alignItems:'center', gap:'0.4rem',
            padding:'4px 12px', borderRadius:'99px', border:'none', cursor:'pointer',
            background: hasApiKey ? 'rgba(0,230,118,0.12)' : 'rgba(255,171,64,0.12)',
            color: hasApiKey ? 'var(--accent-green)' : '#ffab40',
            fontSize:'0.72rem', fontWeight:600,
            borderWidth:1, borderStyle:'solid',
            borderColor: hasApiKey ? 'rgba(0,230,118,0.3)' : 'rgba(255,171,64,0.3)',
          }}
        >
          <span style={{ fontSize:'0.75rem' }}>{hasApiKey ? '🤖' : '🔑'}</span>
          {hasApiKey ? (isGroq ? 'Groq AI' : 'Gemini AI') : 'Add API Key'}
        </motion.button>

        {/* Online indicator */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.72rem', color:'var(--text-secondary)' }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:'#00e676', display:'inline-block', boxShadow:'0 0 6px #00e676' }} />
          Live
        </div>

        {/* Theme toggle */}
        <motion.div
          className="theme-toggle"
          onClick={toggleTheme}
          whileTap={{ scale:0.95 }}
          aria-label="Toggle theme"
          data-tip={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          <div className="knob">{theme === 'dark' ? '🌙' : '☀️'}</div>
        </motion.div>

        {/* User avatar */}
        <div style={{
          width:34, height:34, borderRadius:'50%',
          background:'linear-gradient(135deg,#00e676,#00bfa5)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'0.85rem', fontWeight:700, color:'#0a1a0f', cursor:'pointer',
          boxShadow:'0 0 12px var(--glow-green)'
        }}>
          🌿
        </div>
      </div>
    </div>
  );
}

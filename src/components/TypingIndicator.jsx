import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <motion.div
      className="message-row bot"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="avatar bot">🌿</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>EcoBot</div>
        <div className="bubble bot" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0.75rem 1rem', minWidth: 60 }}>
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </motion.div>
  );
}

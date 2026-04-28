import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceButton({ listening, speaking, onToggle, onStopSpeak }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {/* Waveform when speaking */}
      <AnimatePresence>
        {speaking && (
          <motion.div
            className="waveform"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {[1,2,3,4,5].map(i => (
              <div
                key={i}
                className="wave-bar"
                style={{ animationDelay: `${(i - 1) * 0.1}s` }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stop speaking button */}
      <AnimatePresence>
        {speaking && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onStopSpeak}
            className="voice-btn idle"
            data-tip="Stop speaking"
            style={{ fontSize: '0.9rem' }}
          >
            🔇
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mic toggle */}
      <motion.button
        className={`voice-btn ${listening ? 'listening' : 'idle'}`}
        onClick={onToggle}
        whileTap={{ scale: 0.92 }}
        data-tip={listening ? 'Stop listening' : 'Voice input'}
        aria-label={listening ? 'Stop voice input' : 'Start voice input'}
      >
        {listening ? '🎙️' : '🎤'}
      </motion.button>
    </div>
  );
}

import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const { setPage } = useApp();

  return (
    <div style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      color: 'var(--text-primary)',
      padding: '2rem',
      textAlign: 'center',
      overflow: 'hidden'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ maxWidth: '800px' }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌿</div>
        <h1 className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
          EcoBot: Your Personal <br /> Sustainability Partner
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 3rem' }}>
          Join thousands of EcoWarriors tracking their carbon footprint, earning points, and making the world greener—one conversation at a time.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
          {[
            { icon: '💬', title: 'AI Chat', desc: 'Expert eco-advice 24/7' },
            { icon: '📊', title: 'Analytics', desc: 'Track your real impact' },
            { icon: '🏆', title: 'Rewards', desc: 'Earn points for actions' }
          ].map((feat, i) => (
            <motion.div
              key={i}
              className="glass"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              style={{ padding: '1.5rem', borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{feat.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{feat.title}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{feat.desc}</div>
            </motion.div>
          ))}
        </div>

        <motion.button
          className="gradient-btn"
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 230, 118, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPage('chat')}
          style={{
            padding: '1.2rem 3rem',
            fontSize: '1.2rem',
            fontWeight: 800,
            borderRadius: '99px',
            cursor: 'pointer',
            border: 'none',
            color: '#0a1a0f'
          }}
        >
          Get Started — It's Free 🚀
        </motion.button>
      </motion.div>
    </div>
  );
}

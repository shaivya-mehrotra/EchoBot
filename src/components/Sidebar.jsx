import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

const NAV = [
  { id:'chat',      icon:'💬', label:'EcoChat'   },
  { id:'dashboard', icon:'📊', label:'Dashboard'  },
  { id:'tips',      icon:'💡', label:'Eco Tips'   },
  { id:'tracker',   icon:'🎯', label:'Tracker'    },
];

const QUICK_STATS = [
  { icon:'🌍', label:'Carbon', key:'carbonKg', unit:'kg' },
  { icon:'💧', label:'Water',  key:'waterLiters', unit:'L' },
  { icon:'⚡', label:'Energy', key:'energyKwh', unit:'kWh' },
];

export default function Sidebar() {
  const { page, setPage, stats, sidebarOpen, setSidebarOpen, theme, toggleTheme } = useApp();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${!sidebarOpen ? '' : 'show'}`}
        style={{ display: sidebarOpen ? undefined : 'none' }}
        onClick={() => setSidebarOpen(false)}
      />

      <motion.aside
        className={`sidebar glass ${sidebarOpen ? '' : 'collapsed'}`}
        initial={false}
        style={{ zIndex: 40 }}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">🌿</div>
          <span className="logo-text gradient-text">EcoBot</span>
        </div>

        {/* Nav */}
        <div className="section-title">Navigation</div>
        {NAV.map(item => (
          <motion.div
            key={item.id}
            className={`nav-item ${page === item.id ? 'active' : ''}`}
            onClick={() => { setPage(item.id); if (window.innerWidth < 768) setSidebarOpen(false); }}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.id === 'chat' && (
              <span style={{
                marginLeft:'auto', fontSize:'0.65rem', fontWeight:700,
                background:'linear-gradient(135deg,#00e676,#00bfa5)',
                color:'#0a1a0f', borderRadius:'99px', padding:'2px 8px'
              }}>AI</span>
            )}
          </motion.div>
        ))}

        {/* Quick stats */}
        <div className="section-title" style={{ marginTop:'1rem' }}>Today's Stats</div>
        {QUICK_STATS.map(s => (
          <div key={s.key} className="nav-item" style={{ cursor:'default', justifyContent:'space-between' }}>
            <span>{s.icon} {s.label}</span>
            <span style={{ fontWeight:700, color: 'var(--accent-green)', fontSize:'0.9rem' }}>
              {stats[s.key]} {s.unit}
            </span>
          </div>
        ))}

        {/* Bottom eco score */}
        <div style={{ marginTop:'auto', padding:'0.75rem 0.25rem 0' }}>
          <motion.div 
            className="nav-item" 
            onClick={toggleTheme}
            style={{ marginBottom: '0.75rem', cursor: 'pointer' }}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </motion.div>

          <div className="glass" style={{ borderRadius:16, padding:'0.85rem 1rem' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.5rem' }}>
              <span style={{ fontSize:'0.78rem', color:'var(--text-secondary)', fontWeight:600 }}>ECO SCORE</span>
              <span style={{ fontSize:'1.1rem', fontWeight:800, color:'var(--accent-green)' }}>{stats.ecoScore}/100</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${stats.ecoScore}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
            <div style={{ fontSize:'0.7rem', color:'var(--text-secondary)', marginTop:'0.4rem' }}>
              🔥 {stats.streak}-day streak · ⭐ {stats.points.toLocaleString()} pts
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const TIPS = [
  { cat:'🌍 Carbon', color:'#00e676', items:[
    { tip:'Walk or cycle instead of driving', impact:'Save ~2.4 kg CO₂/trip', pts:20 },
    { tip:'Reduce one beef meal/week',        impact:'Save ~6 kg CO₂/meal', pts:25 },
    { tip:'Work from home one day/week',       impact:'Save ~1.8 kg CO₂/day', pts:15 },
    { tip:'Switch to a renewable energy tariff', impact:'Eliminate home energy emissions', pts:50 },
  ]},
  { cat:'💧 Water', color:'#40c4ff', items:[
    { tip:'Shorten shower to 5 minutes',     impact:'Save ~25 L/day',       pts:10 },
    { tip:'Fix a leaky tap immediately',     impact:'Save ~20 L/day',       pts:15 },
    { tip:'Use dishwasher on full load only', impact:'Save ~20 L/cycle',    pts:10 },
    { tip:'Collect rainwater for plants',    impact:'Save ~50 L/week',      pts:20 },
  ]},
  { cat:'⚡ Energy', color:'#ffab40', items:[
    { tip:'Switch off standby devices',      impact:'Save ~100 kWh/year',   pts:15 },
    { tip:'Lower thermostat by 1°C',         impact:'Save 6% heating cost', pts:20 },
    { tip:'Replace bulbs with LED',          impact:'Save 80% lighting energy', pts:30 },
    { tip:'Air-dry clothes instead of dryer', impact:'Save ~3 kWh/load',   pts:15 },
  ]},
  { cat:'♻️ Waste', color:'#ce93d8', items:[
    { tip:'Start composting food scraps',    impact:'Divert 30% of waste',  pts:25 },
    { tip:'Carry reusable bag & bottle',     impact:'Avoid 200 bags/year',  pts:10 },
    { tip:'Buy products with less packaging', impact:'Reduce packaging waste 40%', pts:15 },
    { tip:'Donate or sell instead of bin',   impact:'Extend product life',  pts:20 },
  ]},
];

export default function EcoTips() {
  const { updateStats } = useApp();
  const [done, setDone] = useState(new Set());
  const [activeTab, setActiveTab] = useState(0);

  const markDone = (key, pts) => {
    if (done.has(key)) return;
    setDone(prev => new Set([...prev, key]));
    updateStats({ ecoScore: 1, points: pts });
  };

  const current = TIPS[activeTab];

  return (
    <div style={{ flex:1, overflowY:'auto', padding:'1.25rem 1.5rem' }}>
      <h2 style={{ fontSize:'1.2rem', fontWeight:800, marginBottom:'0.25rem' }}>💡 Eco Tips & Actions</h2>
      <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)', marginBottom:'1.25rem' }}>
        Complete actions to earn EcoPoints and level up your eco score!
      </p>

      {/* Category tabs */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
        {TIPS.map((t, i) => (
          <button
            key={i}
            className={`tip-chip ${activeTab === i ? 'active' : ''}`}
            onClick={() => setActiveTab(i)}
            style={activeTab === i ? { borderColor: t.color, color: t.color, background: t.color + '18' } : {}}
          >
            {t.cat}
          </button>
        ))}
      </div>

      {/* Tips list */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity:0, x:15 }}
          animate={{ opacity:1, x:0 }}
          exit={{ opacity:0, x:-15 }}
          transition={{ duration:0.25 }}
          style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}
        >
          {current.items.map((item, i) => {
            const key = `${activeTab}-${i}`;
            const isDone = done.has(key);
            return (
              <motion.div
                key={key}
                className="glass"
                style={{
                  borderRadius:16, padding:'1rem 1.25rem',
                  display:'flex', alignItems:'center', gap:'1rem',
                  border: isDone ? `1px solid ${current.color}55` : '1px solid var(--border)',
                  opacity: isDone ? 0.65 : 1,
                }}
                initial={{ opacity:0, y:12 }}
                animate={{ opacity: isDone ? 0.65 : 1, y:0 }}
                transition={{ delay: i * 0.07 }}
              >
                <div style={{
                  width:40, height:40, borderRadius:12, flexShrink:0,
                  background: current.color + '20',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'1.2rem'
                }}>
                  {isDone ? '✅' : '🎯'}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:'0.9rem', marginBottom:'0.2rem',
                    textDecoration: isDone ? 'line-through' : 'none' }}>
                    {item.tip}
                  </div>
                  <div style={{ fontSize:'0.75rem', color:'var(--text-secondary)' }}>
                    🌿 Impact: {item.impact}
                  </div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontSize:'0.75rem', color: current.color, fontWeight:700, marginBottom:'0.35rem' }}>
                    +{item.pts} pts
                  </div>
                  <motion.button
                    className="gradient-btn"
                    style={{ padding:'0.35rem 0.9rem', borderRadius:99, fontSize:'0.75rem' }}
                    onClick={() => markDone(key, item.pts)}
                    disabled={isDone}
                    whileTap={{ scale:0.93 }}
                  >
                    {isDone ? 'Done ✓' : 'Mark Done'}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const ACTIVITIES = [
  { id:'drive',   icon:'🚗', label:'Drove car',        field:'carbonKg',    value: 2.1,  neg:true,  pts:0  },
  { id:'transit', icon:'🚌', label:'Used public transit', field:'carbonKg', value:-0.8,  neg:false, pts:15 },
  { id:'cycle',   icon:'🚲', label:'Cycled/walked',    field:'carbonKg',    value:-1.2,  neg:false, pts:20 },
  { id:'shower',  icon:'🚿', label:'5-min shower',     field:'waterLiters', value:-25,   neg:false, pts:10 },
  { id:'lshower', icon:'🛁', label:'Long shower (15m)', field:'waterLiters', value: 50,  neg:true,  pts:0  },
  { id:'led',     icon:'💡', label:'Used LED lights',  field:'energyKwh',   value:-0.5,  neg:false, pts:10 },
  { id:'standby', icon:'🔌', label:'Left devices on standby', field:'energyKwh', value:0.8, neg:true, pts:0 },
  { id:'compost', icon:'♻️', label:'Composted waste',  field:'carbonKg',    value:-0.3,  neg:false, pts:25 },
  { id:'meatless',icon:'🥗', label:'Meatless meal',   field:'carbonKg',    value:-1.5,  neg:false, pts:20 },
  { id:'flight',  icon:'✈️', label:'Short flight',    field:'carbonKg',    value:120,   neg:true,  pts:0  },
];

export default function Tracker() {
  const { stats, updateStats } = useApp();
  const [log, setLog]     = useState([]);
  const [logged, setLogged] = useState(new Set());

  const logActivity = (act) => {
    const delta = { [act.field]: act.value, points: act.pts, ecoScore: act.neg ? -1 : 1 };
    updateStats(delta);
    const entry = { ...act, time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }) };
    setLog(prev => [entry, ...prev].slice(0, 12));
    setLogged(prev => new Set([...prev, act.id + Date.now()]));
  };

  return (
    <div style={{ flex:1, overflowY:'auto', padding:'1.25rem 1.5rem' }}>
      <h2 style={{ fontSize:'1.2rem', fontWeight:800, marginBottom:'0.25rem' }}>🎯 Activity Tracker</h2>
      <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)', marginBottom:'1.25rem' }}>
        Log your daily activities to update your environmental stats in real time.
      </p>

      {/* Activities grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(170px, 1fr))', gap:'0.75rem', marginBottom:'1.5rem' }}>
        {ACTIVITIES.map((act, i) => (
          <motion.button
            key={act.id}
            className="glass"
            style={{
              borderRadius:16, padding:'1rem', textAlign:'left', border:'1px solid var(--border)',
              cursor:'pointer', background:'none', color:'var(--text-primary)',
              display:'flex', flexDirection:'column', gap:'0.4rem',
            }}
            whileHover={{ scale:1.03, borderColor: act.neg ? '#ff5252' : 'var(--accent-green)' }}
            whileTap={{ scale:0.96 }}
            initial={{ opacity:0, y:12 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => logActivity(act)}
          >
            <span style={{ fontSize:'1.5rem' }}>{act.icon}</span>
            <span style={{ fontSize:'0.8rem', fontWeight:600 }}>{act.label}</span>
            <span style={{
              fontSize:'0.7rem', fontWeight:700,
              color: act.neg ? '#ff5252' : '#00e676'
            }}>
              {act.neg ? '↑' : '↓'} {Math.abs(act.value)} {act.field === 'carbonKg' ? 'kg CO₂' : act.field === 'waterLiters' ? 'L water' : 'kWh'}
            </span>
            {act.pts > 0 && <span style={{ fontSize:'0.65rem', color:'#00bfa5' }}>+{act.pts} pts</span>}
          </motion.button>
        ))}
      </div>

      {/* Live stats */}
      <div className="glass" style={{ borderRadius:20, padding:'1.25rem', marginBottom:'1.25rem' }}>
        <div style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--accent-green)', marginBottom:'0.85rem' }}>📊 Live Stats</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1rem' }}>
          {[
            { label:'Carbon', value: stats.carbonKg, unit:'kg', color:'#00e676' },
            { label:'Water',  value: stats.waterLiters, unit:'L', color:'#40c4ff' },
            { label:'Energy', value: stats.energyKwh, unit:'kWh', color:'#ffab40' },
          ].map(s => (
            <div key={s.label} style={{ textAlign:'center' }}>
              <div style={{ fontSize:'1.6rem', fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:'0.7rem', color:s.color, opacity:0.7 }}>{s.unit}</div>
              <div style={{ fontSize:'0.7rem', color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity log */}
      {log.length > 0 && (
        <div className="glass" style={{ borderRadius:20, padding:'1.25rem' }}>
          <div style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--accent-teal)', marginBottom:'0.75rem' }}>📋 Today's Log</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
            {log.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity:0, x:-10 }}
                animate={{ opacity:1, x:0 }}
                style={{ display:'flex', alignItems:'center', gap:'0.75rem', fontSize:'0.82rem' }}
              >
                <span>{entry.icon}</span>
                <span style={{ flex:1 }}>{entry.label}</span>
                <span style={{ color: entry.neg ? '#ff5252' : '#00e676', fontWeight:600, fontSize:'0.75rem' }}>
                  {entry.neg ? '+' : '-'}{Math.abs(entry.value)} {entry.field === 'carbonKg' ? 'kg' : entry.field === 'waterLiters' ? 'L' : 'kWh'}
                </span>
                <span style={{ color:'var(--text-secondary)', fontSize:'0.7rem' }}>{entry.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

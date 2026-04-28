import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const ECO_TIPS_OF_DAY = [
  { icon:'🚿', tip:'Take a 5-minute shower today', impact:'Saves 25L water' },
  { icon:'🔌', tip:'Unplug all chargers before bed', impact:'Saves ~0.5 kWh/day' },
  { icon:'🥗', tip:'Try a plant-based meal today', impact:'Saves ~3 kg CO₂' },
  { icon:'🚶', tip:'Walk for trips under 1km', impact:'Saves ~0.2 kg CO₂/trip' },
  { icon:'💡', tip:'Switch off lights in empty rooms', impact:'Saves ~0.3 kWh/day' },
  { icon:'♻️', tip:'Sort your recycling properly today', impact:'Reduces landfill by 40%' },
  { icon:'🌿', tip:'Eat one meal with no meat today', impact:'Saves ~1.5 kg CO₂' },
];

const QUOTES = [
  { text: '"The Earth does not belong to us, we belong to the Earth."', author: 'Chief Seattle' },
  { text: '"We do not inherit the Earth from our ancestors, we borrow it from our children."', author: 'Antoine de Saint-Exupéry' },
  { text: '"The greatest threat to our planet is the belief that someone else will save it."', author: 'Robert Swan' },
  { text: '"In every walk with nature, one receives far more than he seeks."', author: 'John Muir' },
  { text: '"What we are doing to the forests of the world is but a mirror reflection of what we are doing to ourselves."', author: 'Mahatma Gandhi' },
];

export default function Dashboard() {
  const { 
    stats, badges, streakDays, updateStats, 
    dailyTasks, toggleTask, leaderboard, milestones,
    challenges, activityFeed
  } = useApp();
  const [quoteIdx, setQuoteIdx]   = useState(0);
  const [tipIdx]                  = useState(() => new Date().getDay() % ECO_TIPS_OF_DAY.length);
  const [tipDone, setTipDone]     = useState(false);
  const [goalKg, setGoalKg]       = useState(3.5);
  const [editGoal, setEditGoal]   = useState(false);
  const [goalInput, setGoalInput] = useState('3.5');
  const [logActivity, setLogActivity] = useState({ type: 'transport', value: 0 });
  const [isLogging, setIsLogging] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setQuoteIdx(i => (i + 1) % QUOTES.length), 8000);
    return () => clearInterval(t);
  }, []);

  const handleGoalSave = () => {
    const v = parseFloat(goalInput);
    if (!isNaN(v) && v > 0) setGoalKg(v);
    setEditGoal(false);
  };

  const handleQuickLog = () => {
    const val = parseFloat(logActivity.value);
    if (isNaN(val) || val <= 0) return;
    
    let carbonImpact = 0;
    if (logActivity.type === 'transport') carbonImpact = val * 0.2; // 0.2kg per km
    if (logActivity.type === 'energy') carbonImpact = val * 0.4;    // 0.4kg per kWh
    if (logActivity.type === 'food') carbonImpact = val * 2.5;      // 2.5kg per meal (avg meat)
    
    updateStats({ 
      carbonKg: carbonImpact, 
      points: 20, 
      ecoScore: 1 
    });
    
    setIsLogging(false);
    setLogActivity({ type: 'transport', value: 0 });
  };

  const lineOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0d1526', titleColor: '#00e676', bodyColor: '#e8f5e9', borderColor: 'rgba(0,230,118,0.2)', borderWidth: 1 } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#90a4ae', font: { size: 11 } } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#90a4ae', font: { size: 11 } } },
    },
    elements: { line: { tension: 0.4 }, point: { radius: 4, hoverRadius: 7 } },
  };

  const carbonData = {
    labels: DAYS,
    datasets: [{ data: stats.weeklyCarbon, borderColor: '#00e676', backgroundColor: 'rgba(0,230,118,0.1)', fill: true, pointBackgroundColor: '#00e676' }]
  };
  const waterData = {
    labels: DAYS,
    datasets: [{ data: stats.weeklyWater, borderColor: '#40c4ff', backgroundColor: 'rgba(64,196,255,0.1)', fill: true, pointBackgroundColor: '#40c4ff' }]
  };
  const donutData = {
    labels: ['Transport','Home Energy','Food','Shopping','Other'],
    datasets: [{ data: [28,22,30,12,8], backgroundColor: ['#00e676','#00bfa5','#40c4ff','#7c4dff','#ff6d00'], borderWidth: 0, hoverOffset: 8 }]
  };
  const donutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: '#90a4ae', font: { size: 11 }, padding: 12, boxWidth: 12 } }, tooltip: { backgroundColor: '#0d1526', titleColor: '#00e676', bodyColor: '#e8f5e9' } },
    cutout: '68%',
  };

  const STATS = [
    { icon:'🌍', label:'Carbon Today',  value: stats.carbonKg,    unit:'kg CO₂', color:'#00e676', bg:'rgba(0,230,118,0.1)' },
    { icon:'💧', label:'Water Usage',   value: stats.waterLiters, unit:'litres', color:'#40c4ff', bg:'rgba(64,196,255,0.1)' },
    { icon:'⚡', label:'Energy Used',   value: stats.energyKwh,   unit:'kWh',    color:'#ffab40', bg:'rgba(255,171,64,0.1)' },
    { icon:'🏆', label:'Eco Score',     value: stats.ecoScore,    unit:'/100',   color:'#00bfa5', bg:'rgba(0,191,165,0.1)' },
  ];

  const goalMet  = stats.carbonKg <= goalKg;
  const goalPct  = Math.min(100, Math.round((goalKg / Math.max(stats.carbonKg, 0.1)) * 100));
  const todayTip = ECO_TIPS_OF_DAY[tipIdx];
  const quote    = QUOTES[quoteIdx];

  return (
    <div style={{ flex:1, overflowY:'auto', padding:'1.25rem 1.5rem', display:'flex', flexDirection:'column', gap:'1.25rem' }}>

      {/* ── Stat Cards ── */}
      <div className="dashboard-grid">
        {STATS.map((s, i) => (
          <motion.div key={s.label} className="stat-card glass glow-green"
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.08 }}
            style={{ background: s.bg, border: `1px solid ${s.color}22` }}>
            <div className="icon-bg">{s.icon}</div>
            <div className="value" style={{ color: s.color }}>{s.value}</div>
            <div style={{ fontSize:'0.75rem', color: s.color, opacity:0.7, marginBottom:'0.15rem' }}>{s.unit}</div>
            <div className="label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Tip of Day | CO2 Goal | Quote ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:'1rem' }}>

        {/* Live Activity Feed */}
        <motion.div className="glass" style={{ borderRadius:20, padding:'1.1rem', overflow:'hidden' }}
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}>
          <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--accent-green)', marginBottom:'0.8rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>📡 Activity Feed</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.7rem' }}>
            {activityFeed.map(act => (
              <div key={act.id} style={{ display:'flex', gap:'0.6rem', alignItems:'flex-start' }}>
                <div style={{ fontSize:'1rem', background:'rgba(255,255,255,0.05)', borderRadius:8, padding:4 }}>{act.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-primary)' }}>{act.user}</div>
                  <div style={{ fontSize:'0.7rem', color:'var(--text-secondary)' }}>{act.action}</div>
                  <div style={{ fontSize:'0.6rem', color:'var(--accent-green)', opacity:0.6, marginTop:2 }}>{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Milestones */}
        <motion.div className="glass" style={{ borderRadius:20, padding:'1.1rem' }}
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
          <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--accent-purple)', marginBottom:'0.8rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>🚀 Milestones</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {milestones.map(m => (
              <div key={m.id}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', marginBottom:'0.25rem' }}>
                  <span>{m.icon} {m.label}</span>
                  <span style={{ fontWeight:700 }}>{m.current}/{m.target} {m.unit}</span>
                </div>
                <div className="progress-bar" style={{ height:4 }}>
                  <div className="progress-fill" style={{ width: `${(m.current/m.target)*100}%`, background: 'var(--accent-purple)' }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tip of the Day */}
        <motion.div className="glass" style={{ borderRadius:20, padding:'1.1rem' }}
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
          <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--accent-teal)', marginBottom:'0.6rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>💡 Tip of the Day</div>
          <div style={{ fontSize:'1.8rem', marginBottom:'0.4rem' }}>{todayTip.icon}</div>
          <div style={{ fontSize:'0.85rem', fontWeight:600, marginBottom:'0.3rem' }}>{todayTip.tip}</div>
          <div style={{ fontSize:'0.72rem', color:'var(--accent-green)', marginBottom:'0.75rem' }}>🌿 {todayTip.impact}</div>
          <motion.button
            onClick={() => { if (!tipDone) { setTipDone(true); updateStats({ ecoScore:2, points:30 }); } }}
            whileTap={{ scale:0.95 }}
            style={{ padding:'0.4rem 0.9rem', borderRadius:99, fontSize:'0.75rem', fontWeight:700, cursor:'pointer', border:'none',
              background: tipDone ? 'rgba(0,230,118,0.15)' : 'linear-gradient(135deg,#00e676,#00bfa5)',
              color: tipDone ? 'var(--accent-green)' : '#0a1a0f' }}>
            {tipDone ? '✅ Done! +30pts' : '✔ Mark as Done'}
          </motion.button>
        </motion.div>

        {/* CO2 Daily Goal */}
        <motion.div className="glass" style={{ borderRadius:20, padding:'1.1rem' }}
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}>
          <div style={{ fontSize:'0.72rem', fontWeight:700, color: goalMet ? 'var(--accent-green)' : '#ffab40', marginBottom:'0.6rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>
            🎯 Daily CO₂ Goal
          </div>
          <div style={{ display:'flex', alignItems:'baseline', gap:'0.4rem', marginBottom:'0.5rem' }}>
            <span style={{ fontSize:'1.6rem', fontWeight:800, color: goalMet ? 'var(--accent-green)' : '#ffab40' }}>{stats.carbonKg}</span>
            <span style={{ fontSize:'0.78rem', color:'var(--text-secondary)' }}>/ {goalKg} kg target</span>
          </div>
          <div className="progress-bar" style={{ marginBottom:'0.5rem' }}>
            <motion.div className="progress-fill"
              initial={{ width:0 }} animate={{ width:`${goalPct}%` }}
              style={{ background: goalMet ? 'linear-gradient(90deg,#00e676,#00bfa5)' : 'linear-gradient(90deg,#ffab40,#ff6d00)' }}
              transition={{ duration:1 }} />
          </div>
          <div style={{ fontSize:'0.72rem', color: goalMet ? 'var(--accent-green)' : '#ffab40', marginBottom:'0.6rem', fontWeight:600 }}>
            {goalMet ? '🌟 Goal achieved today!' : `↓ ${(stats.carbonKg - goalKg).toFixed(1)} kg above target`}
          </div>
          {editGoal ? (
            <div style={{ display:'flex', gap:'0.4rem' }}>
              <input value={goalInput} onChange={e => setGoalInput(e.target.value)}
                style={{ width:70, padding:'0.3rem 0.5rem', borderRadius:8, border:'1px solid var(--border)', background:'var(--bg-card)', color:'var(--text-primary)', fontSize:'0.8rem' }} />
              <button onClick={handleGoalSave}
                style={{ padding:'0.3rem 0.7rem', borderRadius:8, background:'var(--accent-green)', color:'#0a1a0f', border:'none', fontWeight:700, cursor:'pointer', fontSize:'0.75rem' }}>Set</button>
            </div>
          ) : (
            <button onClick={() => setEditGoal(true)}
              style={{ background:'none', border:'1px solid var(--border)', color:'var(--text-secondary)', padding:'0.3rem 0.8rem', borderRadius:99, fontSize:'0.72rem', cursor:'pointer' }}>
              ✏️ Edit Goal
            </button>
          )}
        </motion.div>

        {/* Eco Wisdom Quote */}
        <motion.div className="glass" style={{ borderRadius:20, padding:'1.1rem', display:'flex', flexDirection:'column', justifyContent:'space-between', position:'relative' }}
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}>
          
          {isLogging ? (
            <div style={{ height:'100%', display:'flex', flexDirection:'column', gap:'0.5rem' }}>
              <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--accent-blue)', textTransform:'uppercase' }}>🚀 Quick Log</div>
              <select 
                value={logActivity.type} 
                onChange={e => setLogActivity({...logActivity, type: e.target.value})}
                style={{ background:'var(--bg-card)', color:'var(--text-primary)', border:'1px solid var(--border)', borderRadius:8, padding:'0.3rem', fontSize:'0.8rem' }}
              >
                <option value="transport">🚗 Transport (km)</option>
                <option value="energy">⚡ Energy (kWh)</option>
                <option value="food">🥩 Meat Meal (qty)</option>
              </select>
              <input 
                type="number" 
                placeholder="Value..."
                onChange={e => setLogActivity({...logActivity, value: e.target.value})}
                style={{ background:'var(--bg-card)', color:'var(--text-primary)', border:'1px solid var(--border)', borderRadius:8, padding:'0.3rem', fontSize:'0.8rem' }}
              />
              <div style={{ display:'flex', gap:'0.4rem', marginTop:'auto' }}>
                <button onClick={handleQuickLog} style={{ flex:1, padding:'0.4rem', borderRadius:8, background:'var(--accent-green)', border:'none', fontWeight:700, cursor:'pointer', fontSize:'0.7rem' }}>Log</button>
                <button onClick={() => setIsLogging(false)} style={{ flex:1, padding:'0.4rem', borderRadius:8, background:'rgba(255,255,255,0.1)', border:'none', color:'var(--text-primary)', cursor:'pointer', fontSize:'0.7rem' }}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--accent-blue)', marginBottom:'0.6rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>🌍 Eco Wisdom</div>
              <motion.div key={quoteIdx} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
                <div style={{ fontSize:'0.82rem', fontStyle:'italic', lineHeight:1.6, color:'var(--text-primary)', marginBottom:'0.6rem' }}>{quote.text}</div>
                <div style={{ fontSize:'0.72rem', color:'var(--text-secondary)', fontWeight:600 }}>— {quote.author}</div>
              </motion.div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'0.75rem' }}>
                <div style={{ display:'flex', gap:'0.3rem' }}>
                  {QUOTES.map((_, i) => (
                    <div key={i} onClick={() => setQuoteIdx(i)}
                      style={{ width:6, height:6, borderRadius:'50%', cursor:'pointer', transition:'background 0.3s', background: i === quoteIdx ? 'var(--accent-blue)' : 'var(--border)' }} />
                  ))}
                </div>
                <button 
                  onClick={() => setIsLogging(true)}
                  style={{ background:'var(--accent-blue)', color:'white', border:'none', padding:'0.3rem 0.6rem', borderRadius:99, fontSize:'0.65rem', fontWeight:700, cursor:'pointer' }}
                >
                  ➕ Quick Log
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem' }}>
        <motion.div className="chart-card glass" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}>
          <div style={{ fontSize:'0.78rem', fontWeight:700, color:'#00e676', marginBottom:'0.75rem' }}>📈 Weekly Carbon (kg)</div>
          <div style={{ height:130 }}><Line data={carbonData} options={lineOpts} /></div>
        </motion.div>
        <motion.div className="chart-card glass" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }}>
          <div style={{ fontSize:'0.78rem', fontWeight:700, color:'#40c4ff', marginBottom:'0.75rem' }}>💧 Weekly Water (L)</div>
          <div style={{ height:130 }}><Line data={waterData} options={lineOpts} /></div>
        </motion.div>
        <motion.div className="chart-card glass" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }}>
          <div style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'0.75rem' }}>🥧 Emissions Breakdown</div>
          <div style={{ height:130 }}><Doughnut data={donutData} options={donutOpts} /></div>
        </motion.div>
      </div>

      {/* ── Streak + Badges Row ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:'1rem' }}>
        
        {/* Active Challenges */}
        <motion.div className="glass" style={{ borderRadius:20, padding:'1.25rem', display:'flex', flexDirection:'column' }} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.65 }}>
          <div style={{ fontSize:'0.78rem', fontWeight:700, marginBottom:'1rem', color:'var(--accent-teal)', textTransform:'uppercase', letterSpacing:'0.05em' }}>⚡ Active Challenges</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {challenges.map(ch => (
              <div key={ch.id} className="glass" style={{ padding:'0.75rem', borderRadius:12, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.4rem' }}>
                  <span style={{ fontSize:'1.2rem' }}>{ch.icon}</span>
                  <span style={{ fontSize:'0.6rem', fontWeight:800, color:'#ffab40', background:'rgba(255,171,64,0.1)', padding:'2px 6px', borderRadius:4 }}>{ch.expires}</span>
                </div>
                <div style={{ fontSize:'0.8rem', fontWeight:700, marginBottom:'0.2rem' }}>{ch.title}</div>
                <div style={{ fontSize:'0.65rem', color:'var(--text-secondary)', display:'flex', justifyContent:'space-between' }}>
                  <span>🏆 {ch.reward} pts</span>
                  <span>👥 {ch.participants}</span>
                </div>
              </div>
            ))}
          </div>
          <button style={{ marginTop:'auto', width:'100%', padding:'0.5rem', borderRadius:8, background:'var(--accent-teal)', border:'none', color:'#0a1a0f', fontWeight:700, fontSize:'0.7rem', cursor:'pointer' }}>View All</button>
        </motion.div>

        {/* Leaderboard */}
        <motion.div className="glass" style={{ borderRadius:20, padding:'1.25rem', display:'flex', flexDirection:'column' }} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }}>
          <div style={{ fontSize:'0.78rem', fontWeight:700, marginBottom:'1rem', color:'var(--accent-orange)', textTransform:'uppercase', letterSpacing:'0.05em' }}>🏆 Leaderboard</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
            {leaderboard.map((user, i) => (
              <div key={user.id} style={{ 
                display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.5rem 0.75rem', borderRadius:12,
                background: user.isUser ? 'rgba(0,230,118,0.1)' : 'transparent',
                border: user.isUser ? '1px solid rgba(0,230,118,0.2)' : 'none'
              }}>
                <div style={{ fontSize:'0.75rem', fontWeight:800, color:'var(--text-secondary)', width:15 }}>{i + 1}</div>
                <div style={{ fontSize:'1.1rem' }}>{user.avatar}</div>
                <div style={{ flex:1, fontSize:'0.82rem', fontWeight: user.isUser ? 700 : 500, color: user.isUser ? 'var(--accent-green)' : 'var(--text-primary)' }}>
                  {user.name} {user.isUser && '(You)'}
                </div>
                <div style={{ fontSize:'0.78rem', fontWeight:700 }}>{user.isUser ? stats.points.toLocaleString() : user.points.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Daily Tasks */}
        <motion.div className="glass" style={{ borderRadius:20, padding:'1.25rem', display:'flex', flexDirection:'column' }} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }}>
          <div style={{ fontSize:'0.78rem', fontWeight:700, marginBottom:'1rem', color:'var(--accent-blue)', textTransform:'uppercase', letterSpacing:'0.05em' }}>✅ Daily Eco Tasks</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
            {dailyTasks.map(task => (
              <div key={task.id} 
                onClick={() => toggleTask(task.id)}
                style={{ 
                  display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.6rem 0.8rem', borderRadius:12, 
                  background: task.completed ? 'rgba(0,230,118,0.1)' : 'rgba(255,255,255,0.03)',
                  border: task.completed ? '1px solid rgba(0,230,118,0.2)' : '1px solid rgba(255,255,255,0.05)',
                  cursor:'pointer', transition:'all 0.2s'
                }}>
                <div style={{ 
                  width:18, height:18, borderRadius:4, border:'2px solid', 
                  borderColor: task.completed ? '#00e676' : '#90a4ae',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  background: task.completed ? '#00e676' : 'transparent',
                  color:'#0a1a0f', fontSize:'0.7rem'
                }}>
                  {task.completed && '✓'}
                </div>
                <div style={{ flex:1, fontSize:'0.82rem', color: task.completed ? '#00e676' : 'var(--text-primary)', textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.7 : 1 }}>
                  {task.text}
                </div>
                <div style={{ fontSize:'0.7rem', fontWeight:700, color: task.completed ? '#00e676' : 'var(--text-secondary)' }}>
                  +{task.points}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:'auto', paddingTop:'1rem', fontSize:'0.7rem', color:'var(--text-secondary)', textAlign:'center' }}>
            Complete tasks to earn EcoPoints & boost your score!
          </div>
        </motion.div>

        {/* Streak & Score Ring */}
        <motion.div className="glass" style={{ borderRadius:20, padding:'1.25rem' }} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.75 }}>
          <div style={{ fontSize:'0.78rem', fontWeight:700, marginBottom:'0.85rem', color:'var(--accent-green)' }}>🔥 Daily Streak — {stats.streak} days</div>
          <div className="streak-bar">
            {streakDays.map((d, i) => (
              <div key={d.day + i} className={`streak-day ${d.active ? 'done' : 'miss'}`}>{d.day}</div>
            ))}
          </div>
          <div style={{ marginTop:'1rem', fontSize:'0.75rem', color:'var(--text-secondary)' }}>
            ⭐ <strong style={{ color:'var(--text-primary)' }}>{stats.points.toLocaleString()}</strong> EcoPoints
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginTop:'1rem' }}>
            <div className="eco-ring">
              <svg viewBox="0 0 120 120" width="120" height="120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(0,230,118,0.12)" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="url(#scoreGrad)" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50 * stats.ecoScore / 100} ${2 * Math.PI * 50}`} />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00e676" />
                    <stop offset="100%" stopColor="#00bfa5" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ textAlign:'center' }}>
                <div className="score-num">{stats.ecoScore}</div>
                <div className="score-lbl">Score</div>
              </div>
            </div>
            <div style={{ fontSize:'0.75rem', color:'var(--text-secondary)', lineHeight:1.6 }}>
              {stats.ecoScore >= 80 ? '🌟 Sustainability champion!' : stats.ecoScore >= 60 ? '💚 Great progress!' : '🌱 Every action counts!'}
            </div>
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div className="glass" style={{ borderRadius:20, padding:'1.25rem' }} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8 }}>
          <div style={{ fontSize:'0.78rem', fontWeight:700, marginBottom:'0.85rem', color:'var(--accent-teal)' }}>🎖️ Achievements</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:'0.75rem' }}>
            {badges.map((b, i) => (
              <motion.div key={b.id} className={`badge-card glass ${b.earned ? '' : 'locked'}`}
                initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }} transition={{ delay: 0.8 + i * 0.07 }}
                whileHover={b.earned ? { scale:1.06 } : {}}
                style={{ border: b.earned ? '1px solid rgba(0,230,118,0.3)' : '1px solid var(--border)' }}>
                <div className="badge-icon">{b.icon}</div>
                <div className="badge-name">{b.name}</div>
                <div className="badge-desc">{b.desc}</div>
                {b.earned && <div style={{ fontSize:'0.6rem', color:'#00e676', fontWeight:700 }}>✓ EARNED</div>}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import { createContext, useContext, useState, useCallback, useRef } from 'react';

const AppContext = createContext(null);

const INITIAL_STATS = {
  carbonKg: 4.2,
  waterLiters: 142,
  energyKwh: 8.6,
  ecoScore: 72,
  streak: 5,
  points: 1240,
  weeklyCarbon: [5.1, 4.8, 4.5, 4.2, 4.0, 4.2, 3.9],
  weeklyWater:  [160, 155, 148, 142, 138, 142, 130],
};

const DAILY_TASKS = [
  { id: 't1', text: 'Used a reusable bottle', points: 10, completed: false },
  { id: 't2', text: 'Turned off unused electronics', points: 15, completed: false },
  { id: 't3', text: 'Recycled plastics/paper', points: 20, completed: false },
  { id: 't4', text: 'Walked or cycled for short trips', points: 25, completed: false },
  { id: 't5', text: 'Used energy-saving light mode', points: 10, completed: false },
];

const LEADERBOARD = [
  { id: 1, name: 'EcoWarrior_99', points: 2850, avatar: '🦊' },
  { id: 2, name: 'GreenLeaf', points: 2420, avatar: '🌿' },
  { id: 3, name: 'SolarPower', points: 2100, avatar: '☀️' },
  { id: 4, name: 'You', points: 1240, avatar: '👤', isUser: true },
  { id: 5, name: 'OceanSaver', points: 980, avatar: '🌊' },
];

const MILESTONES = [
  { id: 'm1', label: 'CO₂ Saved', target: 50, current: 28, unit: 'kg', icon: '☁️' },
  { id: 'm2', label: 'Trees Planted', target: 10, current: 3, unit: 'trees', icon: '🌳' },
  { id: 'm3', label: 'Water Saved', target: 1000, current: 420, unit: 'L', icon: '💧' },
];

const CHALLENGES = [
  { id: 'c1', title: 'Plastic-Free Week', icon: '🥤', expires: '2d left', reward: 500, participants: 1240 },
  { id: 'c2', title: 'Bike to Work', icon: '🚲', expires: '5d left', reward: 800, participants: 850 },
];

const ACTIVITY_FEED = [
  { id: 1, user: 'EcoWarrior_99', action: 'planted a tree!', time: '2m ago', icon: '🌳' },
  { id: 2, user: 'SolarPower', action: 'saved 50L water', time: '15m ago', icon: '💧' },
  { id: 3, user: 'GreenLeaf', action: 'hit a 10-day streak!', time: '1h ago', icon: '🔥' },
];

const INITIAL_BADGES = [
  { id:'b1', icon:'🌱', name:'Green Starter',   desc:'First eco message',    earned:true  },
  { id:'b2', icon:'💧', name:'Water Saver',      desc:'Reduce water 10%',     earned:true  },
  { id:'b3', icon:'⚡', name:'Energy Hero',      desc:'Save 5 kWh this week', earned:false },
  { id:'b4', icon:'🚲', name:'Zero Emissions',   desc:'Walk/cycle for 7 days', earned:false },
  { id:'b5', icon:'♻️', name:'Recycling Pro',    desc:'Log 10 recycle actions',earned:true  },
  { id:'b6', icon:'🌍', name:'Planet Guardian',  desc:'Score above 90',        earned:false },
];

const STREAK_DAYS = [
  { day: 'Mon', active: true },
  { day: 'Tue', active: true },
  { day: 'Wed', active: true },
  { day: 'Thu', active: true },
  { day: 'Fri', active: false },
  { day: 'Sat', active: false },
  { day: 'Sun', active: false },
];

export const AppProvider = ({ children }) => {
  const [theme, setTheme]   = useState('dark');
  const [page, setPage]     = useState('landing');
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'bot',
      text: "🌿 Hi! I'm **EcoBot**, your AI eco-assistant. I can help you track your carbon footprint, water usage, and energy consumption — and give personalized tips to live more sustainably. What would you like to explore today?",
      time: new Date(),
    }
  ]);
  const [stats, setStats]   = useState(INITIAL_STATS);
  const [badges]            = useState(INITIAL_BADGES);
  const [dailyTasks, setDailyTasks] = useState(DAILY_TASKS);
  const [leaderboard]       = useState(LEADERBOARD);
  const [milestones]        = useState(MILESTONES);
  const [challenges]        = useState(CHALLENGES);
  const [activityFeed]      = useState(ACTIVITY_FEED);
  const [botPersonality, setBotPersonality] = useState('helpful'); // helpful, expert, friendly
  const [isMemoryEnabled, setMemoryEnabled] = useState(true);
  const [isTyping, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const msgId = useRef(2);

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }, []);

  const addMessage = useCallback((role, text) => {
    const id = msgId.current++;
    setMessages(prev => [...prev, { id, role, text, time: new Date() }]);
    return id;
  }, []);

  const updateStats = useCallback((delta) => {
    setStats(prev => ({
      ...prev,
      carbonKg:    Math.max(0, +(prev.carbonKg    + (delta.carbonKg    || 0)).toFixed(1)),
      waterLiters: Math.max(0, Math.round(prev.waterLiters + (delta.waterLiters || 0))),
      energyKwh:   Math.max(0, +(prev.energyKwh   + (delta.energyKwh   || 0)).toFixed(1)),
      ecoScore:    Math.min(100, Math.max(0, Math.round(prev.ecoScore + (delta.ecoScore || 0)))),
      points:      prev.points + (delta.points || 0),
    }));
  }, []);

  const toggleTask = useCallback((taskId) => {
    setDailyTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newState = !task.completed;
        if (newState) {
          updateStats({ points: task.points, ecoScore: 1 });
        } else {
          updateStats({ points: -task.points, ecoScore: -1 });
        }
        return { ...task, completed: newState };
      }
      return task;
    }));
  }, [updateStats]);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      page, setPage,
      messages, addMessage, setMessages,
      stats, updateStats,
      badges,
      dailyTasks, toggleTask,
      leaderboard, milestones,
      challenges, activityFeed,
      botPersonality, setBotPersonality,
      isMemoryEnabled, setMemoryEnabled,
      streakDays: STREAK_DAYS,
      isTyping, setTyping,
      sidebarOpen, setSidebarOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

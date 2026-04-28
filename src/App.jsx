import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import AnimatedBackground from './components/AnimatedBackground';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import EcoTips from './components/EcoTips';
import Tracker from './components/Tracker';
import LandingPage from './components/LandingPage';
import ApiSettings from './components/ApiSettings';

const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -12 },
};

function AppInner() {
  const { page, theme, sidebarOpen } = useApp();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const pageMap = {
    landing:   <LandingPage />,
    chat:      <ChatInterface />,
    dashboard: <Dashboard />,
    tips:      <EcoTips />,
    tracker:   <Tracker />,
  };

  const isLanding = page === 'landing';

  return (
    <div
      className={theme === 'light' ? 'light-mode' : ''}
      style={{ height:'100vh', width:'100vw', overflow:'hidden', position:'relative' }}
    >
      <AnimatedBackground />

      <div className="app-layout" style={{ position:'relative', zIndex:1 }}>
        {!isLanding && <Sidebar />}

        <main
          className="main-content"
          style={{ 
            marginLeft: isLanding ? '0' : (sidebarOpen ? 'var(--sidebar-w)' : '0'),
            width: isLanding ? '100%' : 'auto'
          }}
        >
          {!isLanding && <Topbar onOpenSettings={() => setSettingsOpen(true)} />}

          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              variants={PAGE_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration:0.28, ease:[0.4, 0, 0.2, 1] }}
              style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minHeight:0 }}
            >
              {pageMap[page] || pageMap.chat}
            </motion.div>
          </AnimatePresence>
        </main>

        <ApiSettings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}

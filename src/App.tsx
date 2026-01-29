import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Settings, Menu, Mic, Camera, Shield, LogOut } from 'lucide-react';
import Assistant from './components/Assistant';
import BlindMode from './modes/BlindMode';
import DeafMode from './modes/DeafMode';
import SignLanguageMode from './modes/SignLanguageMode';
import Dashboard from './components/Dashboard';
import SecurityPortal from './components/SecurityPortal';
import Login from './components/Login';

export type Mode = 'none' | 'blind' | 'deaf' | 'sign' | 'security';

function App() {
  const [activeMode, setActiveMode] = useState<Mode>('none');
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Announce mode change for accessibility
    if (activeMode !== 'none' && activeMode !== 'security') {
      const utterance = new SpeechSynthesisUtterance(`${activeMode} mode activated`);
      window.speechSynthesis.speak(utterance);
    }
  }, [activeMode]);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden text-white font-sans selection:bg-brand-primary selection:text-white">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary/20 blur-[120px] rounded-full" />
      </div>

      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center glass-panel border-x-0 border-t-0">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setActiveMode('none')}
        >
          <div className="p-2 bg-brand-primary rounded-xl shadow-lg shadow-brand-primary/30">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">AI <span className="gradient-text">Accessibility</span></span>
        </motion.div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveMode('security')}
            className={`p-3 rounded-full glass-panel transition-all glow-focus ${activeMode === 'security' ? 'bg-brand-primary/20 border-brand-primary/50' : 'hover:bg-white/10'}`}
            aria-label="Security Portal"
          >
            <Shield className={`w-5 h-5 ${activeMode === 'security' ? 'text-brand-primary' : ''}`} />
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-3 rounded-full glass-panel hover:bg-white/10 transition-colors glow-focus"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveMode('none')}
            className="p-3 rounded-full glass-panel hover:bg-white/10 transition-colors glow-focus"
            aria-label="Menu"
          >
            {activeMode === 'none' ? <Settings className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {activeMode === 'none' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <header className="mb-12 text-center md:text-left">
                <motion.h1
                  className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Your Compassionate <br />
                  <span className="gradient-text">Digital Companion</span>
                </motion.h1>
                <motion.p
                  className="text-lg text-white/60 max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Experience the web through vision, sound, and gestures. Choose a mode that fits your journey.
                </motion.p>
              </header>
              <Dashboard onSelectMode={setActiveMode} />
            </motion.div>
          )}

          {activeMode === 'blind' && (
            <motion.div
              key="blind-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BlindMode onBack={() => setActiveMode('none')} />
            </motion.div>
          )}

          {activeMode === 'deaf' && (
            <motion.div
              key="deaf-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DeafMode onBack={() => setActiveMode('none')} />
            </motion.div>
          )}

          {activeMode === 'sign' && (
            <motion.div
              key="sign-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SignLanguageMode onBack={() => setActiveMode('none')} />
            </motion.div>
          )}

          {activeMode === 'security' && (
            <motion.div
              key="security-portal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <header className="mb-12">
                <h2 className="text-4xl font-bold mb-2">Security Portal</h2>
                <p className="text-white/50 italic">Your data remains yours. Always.</p>
              </header>
              <SecurityPortal />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Assistant Control */}
      <Assistant
        activeMode={activeMode}
        isExpanded={isAssistantExpanded}
        setIsExpanded={setIsAssistantExpanded}
      />

      {/* Quick Controls Bar (Mobile Optimized) */}
      <motion.div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-panel rounded-full px-6 py-3 flex gap-8 items-center z-50 backdrop-blur-2xl"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1 }}
      >
        <button className="p-2 hover:text-brand-primary transition-colors aria-label='Quick Voice Command'">
          <Mic className="w-6 h-6" />
        </button>
        <button className="p-2 hover:text-brand-primary transition-colors aria-label='Quick Camera Scan'">
          <Camera className="w-6 h-6" />
        </button>
        <div className="w-px h-6 bg-white/20" />
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium opacity-80">Encryption Active</span>
        </div>
      </motion.div>
    </div>
  );
}

export default App;

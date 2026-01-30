import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Mic, Camera } from 'lucide-react';
import Assistant from './components/Assistant';
import BlindMode from './modes/BlindMode';
import DeafMode from './modes/DeafMode';
import SignLanguageMode from './modes/SignLanguageMode';
import Dashboard from './components/Dashboard';
import SettingsDropdown from './components/SettingsDropdown';

export type Mode = 'none' | 'blind' | 'deaf' | 'sign';

function App() {
  const [activeMode, setActiveMode] = useState<Mode>('none');
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(false);

  useEffect(() => {
    // Announce mode change for accessibility
    if (activeMode !== 'none') {
      const utterance = new SpeechSynthesisUtterance(`${activeMode} mode activated`);
      window.speechSynthesis.speak(utterance);
    }
  }, [activeMode]);

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
          <SettingsDropdown />
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
      </motion.div>
    </div>
  );
}

export default App;

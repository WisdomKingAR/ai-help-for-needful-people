import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Features } from './components/Features';
import { Impact } from './components/Impact';
import { Principles } from './components/Principles';
import { Footer } from './components/Footer';
import { ParticleBackground } from './components/ParticleBackground';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { JoinMovement } from './components/JoinMovement';
import { Dashboard } from './components/Dashboard';
import { useState, useEffect } from 'react';
import { api } from './services/api';

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(api.isLoggedIn());
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  useEffect(() => {
    setIsLoggedIn(api.isLoggedIn());
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsAuthOpen(false);
    setView('dashboard');
  };

  const handleLogout = () => {
    api.clearToken();
    setIsLoggedIn(false);
    setView('landing');
  };

  return (
    <div className="bg-background text-white selection:bg-primary/30 min-h-screen font-sans transition-colors duration-500">
      <ParticleBackground />
      <Navbar
        onJoinClick={() => setIsAuthOpen(true)}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onDashboardClick={() => setView('dashboard')}
        onHomeClick={() => setView('landing')}
      />
      <main>
        {view === 'landing' ? (
          <>
            <Hero onJoinClick={() => setIsAuthOpen(true)} />
            <About />
            <Features />
            <Impact />
            <Principles />
          </>
        ) : (
          <Dashboard />
        )}
      </main>
      <Footer />
      <AccessibilityToolbar />
      <JoinMovement
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;

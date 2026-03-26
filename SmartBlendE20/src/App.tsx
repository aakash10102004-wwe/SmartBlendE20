import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/showcase/Hero';
import Features from './components/showcase/Features';
import Benefits from './components/showcase/Benefits';
import HowItWorks from './components/showcase/HowItWorks';
import TechSpecs from './components/showcase/TechSpecs';
import ModelViewer from './components/showcase/ModelViewer';
import Dashboard from './components/dashboard/Dashboard';

/* ── View types ── */
export type AppView = 'landing' | 'dashboard';

/* ── Transition variants ── */
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' as const } },
};

/* ── Landing Page ── */
function LandingPage({
  onNavigate,
}: {
  onNavigate: (view: AppView) => void;
}) {
  return (
    <motion.div key="landing" {...pageTransition}>
      <Header onNavigate={onNavigate} />
      <main>
        <Hero onNavigate={onNavigate} />
        <Features />
        <Benefits />
        <HowItWorks />
        <TechSpecs />
        <ModelViewer />
      </main>
      <Footer />
    </motion.div>
  );
}

/* ── App Controller ── */
function App() {
  const [view, setView] = useState<AppView>('landing');

  const navigate = useCallback((v: AppView) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setView(v), v === 'landing' ? 300 : 0);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {view === 'landing' ? (
        <LandingPage key="landing" onNavigate={navigate} />
      ) : (
        <motion.div key="dashboard" {...pageTransition}>
          <Dashboard onBackToHome={() => navigate('landing')} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;

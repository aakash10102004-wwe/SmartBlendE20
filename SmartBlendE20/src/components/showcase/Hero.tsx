import { motion } from 'framer-motion';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import type { AppView } from '../../App';
import './Hero.css';

const Hero = ({ onNavigate }: { onNavigate: (view: AppView) => void }) => {
  const scrollTo3D = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('3d-model');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="hero" id="hero">
      {/* Background Effects */}
      <div className="hero-bg">
        <div className="bg-grid" />
        <div className="bg-glow hero-glow-1" />
        <div className="bg-glow hero-glow-2" />
        <div className="bg-glow hero-glow-3" />
        <div className="hero-orb" />
      </div>

      <div className="container hero-container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="badge-dot" />
            Next-Gen Fuel Intelligence
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Smart Blend
            <span className="hero-title-accent"> E20</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Intelligent E20 Fuel Filtration System
          </motion.p>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Advanced real-time ethanol detection, water contamination guard, and 
            smart temperature monitoring — powered by IoT sensor fusion and ESP32 
            microcontroller technology.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <a href="#3d-model" className="btn btn-primary" onClick={scrollTo3D}>
              Explore System
              <ArrowRight size={18} />
            </a>
            <button
              className="btn btn-secondary"
              onClick={() => onNavigate('dashboard')}
            >
              <LayoutDashboard size={18} />
              View Dashboard
            </button>
          </motion.div>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            <div className="hero-stat">
              <span className="hero-stat-value">99.2%</span>
              <span className="hero-stat-label">Detection Accuracy</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">&lt;2s</span>
              <span className="hero-stat-label">Response Time</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">24/7</span>
              <span className="hero-stat-label">Live Monitoring</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Visual Element */}
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-device">
            <div className="device-ring device-ring-outer">
              <div className="device-ring device-ring-middle">
                <div className="device-ring device-ring-inner">
                  <div className="device-core">
                    <span className="device-core-label">E20</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="device-particle device-particle-1" />
            <div className="device-particle device-particle-2" />
            <div className="device-particle device-particle-3" />
            <div className="device-particle device-particle-4" />
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="scroll-line" />
      </motion.div>
    </section>
  );
};

export default Hero;

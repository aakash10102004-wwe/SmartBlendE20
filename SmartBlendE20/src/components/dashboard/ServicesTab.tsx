import { motion } from 'framer-motion';
import {
  Crown,
  Check,
  Calendar,
  Shield,
  Wrench,
  Clock,
  PhoneCall,
  Sparkles,
  Zap,
  Settings,
} from 'lucide-react';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const features = [
  'Priority fuel quality monitoring',
  'Real-time contaminant alerts',
  'Monthly engine health reports',
  'Dedicated service support',
  '2× extended filter life guarantee',
];

export default function ServicesTab() {
  return (
    <motion.div
      className="tab-panel"
      key="services"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="tab-header">
        <h1>Services</h1>
        <p>Subscription, AMC &amp; service management</p>
      </div>

      {/* ── Subscription Plan ── */}
      <motion.div className="dash-card plan-card" variants={item}>
        <span className="plan-badge">
          <Crown size={12} />
          Current Plan
        </span>
        <div className="plan-name">SmartBlend Pro+</div>
        <div className="plan-price">
          <strong>₹1,299</strong> / month
        </div>
        <div className="plan-period">Billed annually • Renews Apr 15, 2026</div>
      </motion.div>

      {/* ── Plan Features ── */}
      <motion.div className="dash-card" variants={item}>
        <div className="card-title">
          <Sparkles size={14} className="card-title-icon" />
          Plan Features
        </div>
        <div className="feature-list">
          {features.map((f, i) => (
            <div className="feature-item" key={i}>
              <span className="feature-check">
                <Check size={12} />
              </span>
              {f}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Service Status ── */}
      <motion.div className="dash-card" variants={item}>
        <div className="card-title">
          <Settings size={14} className="card-title-icon" />
          Service Details
        </div>
        <div className="service-detail-row">
          <span className="service-detail-label">
            <span className="service-detail-icon cyan">
              <Zap size={14} />
            </span>
            Subscription Status
          </span>
          <span
            className="service-detail-value"
            style={{ color: 'var(--accent-green)' }}
          >
            Active
          </span>
        </div>
        <div className="service-detail-row">
          <span className="service-detail-label">
            <span className="service-detail-icon green">
              <Shield size={14} />
            </span>
            AMC Validity
          </span>
          <span className="service-detail-value">Apr 2027</span>
        </div>
        <div className="service-detail-row">
          <span className="service-detail-label">
            <span className="service-detail-icon amber">
              <Calendar size={14} />
            </span>
            Next Service
          </span>
          <span className="service-detail-value">1,200 km</span>
        </div>
        <div className="service-detail-row">
          <span className="service-detail-label">
            <span className="service-detail-icon cyan">
              <Clock size={14} />
            </span>
            Last Serviced
          </span>
          <span className="service-detail-value">Mar 10, 2026</span>
        </div>
        <div className="service-detail-row">
          <span className="service-detail-label">
            <span className="service-detail-icon green">
              <Wrench size={14} />
            </span>
            Filter Replacements
          </span>
          <span className="service-detail-value">3 / 6 used</span>
        </div>
        <div style={{ marginTop: 8 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 4,
            }}
          >
            <span className="stat-label">AMC Usage</span>
            <span
              style={{
                fontSize: '0.68rem',
                fontFamily: "'JetBrains Mono', monospace",
                color: 'var(--text-muted)',
              }}
            >
              50%
            </span>
          </div>
          <div className="progress-bar-wrap">
            <div
              className="progress-bar-fill cyan"
              style={{ width: '50%' }}
            />
          </div>
        </div>
      </motion.div>

      {/* ── Service Button ── */}
      <motion.div variants={item}>
        <button className="service-btn" id="book-service-btn">
          <PhoneCall size={18} />
          Book a Service Now
        </button>
      </motion.div>
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import {
  Car,
  Fuel,
  Gauge,
  Heart,
  TrendingUp,
  ArrowUpRight,
  Droplets,
  Zap,
  Thermometer,
  FlaskConical,
} from 'lucide-react';
import type { SimulatedData } from './useSimulatedData';

/* ── helper: animated score ring ── */
function ScoreRing({
  value,
  max = 100,
  color = 'cyan',
}: {
  value: number;
  max?: number;
  color?: 'cyan' | 'green';
}) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / max) * circ;

  return (
    <div className="score-ring">
      <svg viewBox="0 0 80 80">
        <circle className="ring-bg" cx="40" cy="40" r={r} />
        <circle
          className={`ring-value ${color}`}
          cx="40"
          cy="40"
          r={r}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="score-number">{value}</span>
    </div>
  );
}

/** Label for the efficiency score */
function effLabel(score: number) {
  if (score >= 85) return 'Excellent Performance';
  if (score >= 70) return 'Good Performance';
  if (score >= 55) return 'Average Performance';
  return 'Needs Attention';
}

function effDesc(score: number) {
  if (score >= 85)
    return 'Your Smart Blend system is operating at peak efficiency. Engine deposits reduced by 38% compared to standard fuel.';
  if (score >= 70)
    return 'System operating well. Minor fluctuations in blend quality detected — performance still above baseline.';
  if (score >= 55)
    return 'Performance is moderate. Consider checking fuel source quality and filter condition.';
  return 'Efficiency has dropped below optimal range. A service check is recommended.';
}

/** fuel status badge */
function fuelBadge(eth: number) {
  if (eth >= 85) return { cls: 'optimal', label: 'Optimal' } as const;
  if (eth >= 75) return { cls: 'warning', label: 'Moderate' } as const;
  return { cls: 'critical', label: 'Low' } as const;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

/* ── shared transition style for live values ── */
const liveStyle: React.CSSProperties = {
  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
};

export default function DashboardTab({ data }: { data: SimulatedData }) {
  const badge = fuelBadge(data.ethanol);

  return (
    <motion.div
      className="tab-panel"
      key="dashboard"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="tab-header">
        <h1>Dashboard</h1>
        <p>Real-time vehicle &amp; fuel system overview</p>
      </div>

      {/* ── Vehicle Info ── */}
      <motion.div className="dash-card" variants={item}>
        <div className="vehicle-card">
          <div className="vehicle-icon-wrap">
            <Car size={24} />
          </div>
          <div className="vehicle-info">
            <h3>Hyundai Creta 2024</h3>
            <p>SmartBlend E20 Pro • Active</p>
            <div className="vehicle-meta">
              <span>MH 12 AB 1234</span>
              <span>24,580 km</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Fuel Status (live ethanol) ── */}
      <motion.div className="dash-card" variants={item}>
        <div className="card-title">
          <Fuel size={14} className="card-title-icon" />
          Fuel Status
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div className="stat-value" style={{ marginBottom: 6, ...liveStyle }}>
              {data.ethanol}%
            </div>
            <div className="stat-label">Blended E20 Level</div>
          </div>
          <span className={`fuel-badge ${badge.cls}`} style={liveStyle}>
            <Droplets size={12} />
            {badge.label}
          </span>
        </div>
        <div className="progress-bar-wrap">
          <div
            className={`progress-bar-fill ${badge.cls === 'optimal' ? 'green' : badge.cls === 'warning' ? 'amber' : 'cyan'}`}
            style={{ width: `${data.ethanol}%`, ...liveStyle }}
          />
        </div>
      </motion.div>

      {/* ── Live Sensor Row ── */}
      <motion.div className="stat-row" variants={item}>
        <div className="stat-item">
          <div className="stat-icon cyan">
            <FlaskConical size={18} />
          </div>
          <div className="stat-label">Ethanol Blend</div>
          <div className="stat-value" style={liveStyle}>
            {data.ethanol}%
          </div>
          <span className="stat-change up" style={liveStyle}>
            <ArrowUpRight size={10} />
            live
          </span>
        </div>
        <div className="stat-item">
          <div className="stat-icon amber">
            <Thermometer size={18} />
          </div>
          <div className="stat-label">Temperature</div>
          <div className="stat-value" style={liveStyle}>
            {data.temperature}°C
          </div>
          <span className="stat-change up" style={liveStyle}>
            <ArrowUpRight size={10} />
            live
          </span>
        </div>
      </motion.div>

      {/* ── Quick Stats (live) ── */}
      <motion.div className="stat-row" variants={item}>
        <div className="stat-item">
          <div className="stat-icon green">
            <TrendingUp size={18} />
          </div>
          <div className="stat-label">Mileage</div>
          <div className="stat-value" style={liveStyle}>
            {data.mileage}
          </div>
          <span className="stat-change up">
            <ArrowUpRight size={10} />
            km/l
          </span>
        </div>
        <div className="stat-item">
          <div className="stat-icon amber">
            <Heart size={18} />
          </div>
          <div className="stat-label">Engine Health</div>
          <div className="stat-value" style={liveStyle}>
            {data.engineHealth}
          </div>
          <span className="stat-change up" style={liveStyle}>
            <ArrowUpRight size={10} />
            {data.engineHealth >= 90 ? 'Excellent' : 'Good'}
          </span>
        </div>
      </motion.div>

      <motion.div className="stat-row" variants={item}>
        <div className="stat-item">
          <div className="stat-icon cyan">
            <Gauge size={18} />
          </div>
          <div className="stat-label">Water Content</div>
          <div className="stat-value" style={liveStyle}>
            {data.water}%
          </div>
          <span
            className={`stat-change ${data.water <= 2.5 ? 'up' : 'down'}`}
            style={liveStyle}
          >
            <ArrowUpRight size={10} />
            {data.water <= 2.5 ? 'Low' : 'Elevated'}
          </span>
        </div>
        <div className="stat-item">
          <div className="stat-icon red">
            <Fuel size={18} />
          </div>
          <div className="stat-label">Fuel Saved</div>
          <div className="stat-value" style={liveStyle}>
            ₹{(data.fuelSaved / 1000).toFixed(1)}k
          </div>
          <span className="stat-change up">
            <ArrowUpRight size={10} />
            this month
          </span>
        </div>
      </motion.div>

      {/* ── Efficiency Score (live) ── */}
      <motion.div className="dash-card" variants={item}>
        <div className="card-title">
          <Zap size={14} className="card-title-icon" />
          Efficiency Score
        </div>
        <div className="score-card">
          <ScoreRing
            value={data.efficiency}
            color={data.efficiency >= 70 ? 'cyan' : 'green'}
          />
          <div className="score-details">
            <h3 style={liveStyle}>{effLabel(data.efficiency)}</h3>
            <p>{effDesc(data.efficiency)}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

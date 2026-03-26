import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Droplets,
  PiggyBank,
  ArrowUpRight,
} from 'lucide-react';
import type { SimulatedData } from './useSimulatedData';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

/* ── Mini bar chart data ── */
const chartData = [
  { label: 'Jan', before: 55, after: 70 },
  { label: 'Feb', before: 50, after: 68 },
  { label: 'Mar', before: 52, after: 74 },
  { label: 'Apr', before: 48, after: 72 },
  { label: 'May', before: 54, after: 78 },
  { label: 'Jun', before: 51, after: 80 },
];

function DonutChart({
  value,
  color,
}: {
  value: number;
  color: string;
}) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 100 100">
        <circle className="donut-bg" cx="50" cy="50" r={r} />
        <circle
          className="donut-fill"
          cx="50"
          cy="50"
          r={r}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ stroke: color, filter: `drop-shadow(0 0 6px ${color}40)` }}
        />
      </svg>
      <div className="donut-center">
        <span className="donut-pct">{value}%</span>
        <span className="donut-label">Removed</span>
      </div>
    </div>
  );
}

/* ── shared transition style for live values ── */
const liveStyle: React.CSSProperties = {
  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
};

export default function InsightsTab({ data }: { data: SimulatedData }) {
  /* Derive mileage comparison from live mileage */
  const cityBase = 14.2;
  const hwBase = 18.5;
  const mixedBase = 15.8;
  const boost = data.mileage / 18.4; // ratio vs baseline
  const cityAfter = +(cityBase * boost).toFixed(1);
  const hwAfter = +(hwBase * boost).toFixed(1);
  const mixedAfter = +(mixedBase * boost).toFixed(1);

  return (
    <motion.div
      className="tab-panel"
      key="insights"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="tab-header">
        <h1>Insights</h1>
        <p>Performance analytics &amp; fuel intelligence</p>
      </div>

      {/* ── Mileage Comparison (live) ── */}
      <motion.div className="dash-card" variants={item}>
        <div className="card-title">
          <TrendingUp size={14} className="card-title-icon" />
          Mileage Comparison
        </div>
        <div className="comparison-row">
          <span className="comparison-label">City Driving</span>
          <div className="comparison-values">
            <span className="comparison-before">{cityBase} km/l</span>
            <span className="comparison-after" style={liveStyle}>
              {cityAfter} km/l
            </span>
          </div>
        </div>
        <div className="comparison-row">
          <span className="comparison-label">Highway</span>
          <div className="comparison-values">
            <span className="comparison-before">{hwBase} km/l</span>
            <span className="comparison-after" style={liveStyle}>
              {hwAfter} km/l
            </span>
          </div>
        </div>
        <div className="comparison-row">
          <span className="comparison-label">Mixed</span>
          <div className="comparison-values">
            <span className="comparison-before">{mixedBase} km/l</span>
            <span className="comparison-after" style={liveStyle}>
              {mixedAfter} km/l
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Fuel Savings (live) ── */}
      <motion.div className="stat-row" variants={item}>
        <div className="stat-item">
          <div className="stat-icon green">
            <PiggyBank size={18} />
          </div>
          <div className="stat-label">Monthly Savings</div>
          <div className="stat-value" style={liveStyle}>
            ₹{data.fuelSaved.toLocaleString('en-IN')}
          </div>
          <span className="stat-change up">
            <ArrowUpRight size={10} />
            +18% vs last
          </span>
        </div>
        <div className="stat-item">
          <div className="stat-icon cyan">
            <TrendingUp size={18} />
          </div>
          <div className="stat-label">Total Saved</div>
          <div className="stat-value" style={liveStyle}>
            ₹{((data.fuelSaved * 6) / 1000).toFixed(1)}k
          </div>
          <span className="stat-change up">
            <ArrowUpRight size={10} />
            6 months
          </span>
        </div>
      </motion.div>

      {/* ── Water Removal (live) ── */}
      <motion.div className="dash-card" variants={item}>
        <div className="card-title">
          <Droplets size={14} className="card-title-icon" />
          Water Removal Efficiency
        </div>
        <div className="donut-card">
          <DonutChart value={data.waterRemoval} color="#00d4ff" />
          <div className="donut-legend">
            <div className="donut-legend-item">
              <span className="legend-dot cyan" />
              <span>Water removed</span>
              <strong style={liveStyle}>{data.waterRemoval}%</strong>
            </div>
            <div className="donut-legend-item">
              <span className="legend-dot green" />
              <span>Impurities filtered</span>
              <strong style={liveStyle}>{data.impurities}%</strong>
            </div>
            <div className="donut-legend-item">
              <span className="legend-dot amber" />
              <span>Contaminants blocked</span>
              <strong style={liveStyle}>{data.contaminants}%</strong>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Performance Chart ── */}
      <motion.div className="dash-card" variants={item}>
        <div className="card-title">
          <BarChart3 size={14} className="card-title-icon" />
          Performance Trend
        </div>
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 10,
            justifyContent: 'flex-end',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--accent-cyan)',
              }}
            />
            Before
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--accent-green)',
              }}
            />
            After SmartBlend
          </span>
        </div>
        <div className="chart-area">
          {chartData.map((d) => (
            <div
              key={d.label}
              style={{
                flex: 1,
                display: 'flex',
                gap: 3,
                alignItems: 'flex-end',
                height: '100%',
              }}
            >
              <div className="chart-bar-wrap">
                <div
                  className="chart-bar cyan"
                  style={{ height: `${d.before}%` }}
                />
                <span className="chart-bar-label">{d.label}</span>
              </div>
              <div className="chart-bar-wrap">
                <div
                  className="chart-bar green"
                  style={{ height: `${d.after}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

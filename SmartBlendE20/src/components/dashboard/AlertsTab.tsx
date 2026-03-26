import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Thermometer,
  Gauge,
  CheckCircle2,
  Filter,
  Bell,
  Lightbulb,
  Shield,
  Wrench,
} from 'lucide-react';
import type { LiveAlert } from './useAlertEngine';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

type FilterStatus = 'all' | 'active' | 'filtering' | 'resolved';

const statusIcon: Record<string, typeof AlertTriangle> = {
  water_high: AlertTriangle,
  temp_high: Thermometer,
  eff_low: Gauge,
};

const statusIconFallback: Record<string, typeof AlertTriangle> = {
  active: AlertTriangle,
  filtering: Filter,
  resolved: CheckCircle2,
};

function fmtTime(d: Date) {
  return d.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

const recommendations = [
  {
    icon: Shield,
    title: 'Replace fuel filter',
    desc: 'Filter has processed 480L — replace within 200km for optimal performance.',
  },
  {
    icon: Wrench,
    title: 'Schedule maintenance',
    desc: 'Next service due in 1,200 km. Book early to avoid engine wear.',
  },
  {
    icon: Lightbulb,
    title: 'Switch to verified E20 stations',
    desc: 'Stations with certified E20 blends show 15% better filtration results.',
  },
];

export default function AlertsTab({ alerts }: { alerts: LiveAlert[] }) {
  const [filter, setFilter] = useState<FilterStatus>('all');

  const filtered =
    filter === 'all'
      ? alerts
      : alerts.filter((a) => a.status === filter);

  const activeCount = alerts.filter((a) => a.status === 'active').length;
  const filteringCount = alerts.filter((a) => a.status === 'filtering').length;

  return (
    <motion.div
      className="tab-panel"
      key="alerts"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="tab-header">
        <h1>Alerts</h1>
        <p>Live system notifications &amp; recommendations</p>
      </div>

      {/* ── Summary badges ── */}
      <motion.div className="alert-summary" variants={item}>
        <div className="alert-summary-badge active">
          <AlertTriangle size={14} />
          <span>{activeCount} Active</span>
        </div>
        <div className="alert-summary-badge filtering">
          <Filter size={14} />
          <span>{filteringCount} Filtering</span>
        </div>
        <div className="alert-summary-badge resolved">
          <CheckCircle2 size={14} />
          <span>
            {alerts.filter((a) => a.status === 'resolved').length} Resolved
          </span>
        </div>
      </motion.div>

      {/* ── Filters ── */}
      <motion.div variants={item}>
        <div className="alert-filters">
          {(['all', 'active', 'filtering', 'resolved'] as const).map((f) => (
            <button
              key={f}
              className={`alert-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? `All (${alerts.length})` : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Alert List ── */}
      <motion.div className="dash-card" variants={item}>
        <div className="card-title">
          <Bell size={14} className="card-title-icon" />
          Recent Alerts
        </div>
        <AnimatePresence mode="popLayout">
          {filtered.map((a) => {
            const Icon = statusIcon[a.ruleKey] ?? statusIconFallback[a.status] ?? AlertTriangle;
            return (
              <motion.div
                key={a.id}
                className="alert-item"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className={`alert-icon-wrap ${a.status}`}>
                  <Icon size={16} />
                </div>
                <div className="alert-body">
                  <div className="alert-title">{a.title}</div>
                  <div className="alert-timestamp">{fmtTime(a.createdAt)}</div>
                </div>
                <span className={`alert-tag ${a.status}`}>{a.status}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="alert-empty">
            {filter === 'all'
              ? 'No alerts yet — monitoring sensors...'
              : `No ${filter} alerts`}
          </div>
        )}
      </motion.div>

      {/* ── Recommendations ── */}
      <motion.div className="dash-card" variants={item}>
        <div className="card-title">
          <Lightbulb size={14} className="card-title-icon" />
          Recommendations
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {recommendations.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={i} className="recommendation-card">
                <div className="rec-icon">
                  <Icon size={16} />
                </div>
                <div className="rec-text">
                  <h4>{r.title}</h4>
                  <p>{r.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

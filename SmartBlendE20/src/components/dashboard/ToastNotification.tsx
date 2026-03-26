import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Thermometer, Gauge, X } from 'lucide-react';
import type { LiveAlert } from './useAlertEngine';

const iconMap: Record<string, typeof AlertTriangle> = {
  water_high: AlertTriangle,
  temp_high: Thermometer,
  eff_low: Gauge,
};

export default function ToastNotification({
  toast,
  onDismiss,
}: {
  toast: LiveAlert | null;
  onDismiss: () => void;
}) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="toast-container"
          key={toast.id}
          initial={{ opacity: 0, y: -60, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        >
          <div className="toast-glow" />
          <div className="toast-inner">
            <span className="toast-icon">
              {(() => {
                const Icon = iconMap[toast.ruleKey] ?? AlertTriangle;
                return <Icon size={16} />;
              })()}
            </span>
            <div className="toast-body">
              <div className="toast-title">{toast.title}</div>
              <div className="toast-time">Just now</div>
            </div>
            <button
              className="toast-close"
              onClick={onDismiss}
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
          <div className="toast-progress" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

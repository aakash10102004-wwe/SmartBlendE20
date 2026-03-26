import { useState, useEffect, useRef, useCallback } from 'react';
import type { SimulatedData } from './useSimulatedData';

/* ── Types ── */
export type AlertStatus = 'active' | 'filtering' | 'resolved';

export interface LiveAlert {
  id: string;
  ruleKey: string;
  title: string;
  status: AlertStatus;
  createdAt: Date;
  resolvedAt?: Date;
}

/* ── Threshold rules ── */
interface Rule {
  key: string;
  title: string;
  check: (d: SimulatedData) => boolean;
}

const RULES: Rule[] = [
  {
    key: 'water_high',
    title: 'Water contamination detected',
    check: (d) => d.water > 1,
  },
  {
    key: 'temp_high',
    title: 'High temperature detected',
    check: (d) => d.temperature > 38,
  },
  {
    key: 'eff_low',
    title: 'System efficiency low',
    check: (d) => d.efficiency < 70,
  },
];

const MAX_ALERTS = 10;

let _nextId = 1;
const uid = () => `alert-${_nextId++}-${Date.now()}`;

/**
 * useAlertEngine — watches SimulatedData and fires / resolves alerts.
 *
 * Returns { alerts, newToast, dismissToast }
 * - alerts: last 10 alerts (newest first)
 * - newToast: the most recent toast to show (cleared after 4s)
 * - dismissToast: manually dismiss the toast
 */
export function useAlertEngine(data: SimulatedData) {
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  const [toast, setToast] = useState<LiveAlert | null>(null);
  const activeRules = useRef<Set<string>>(new Set());
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    setAlerts((prev) => {
      let next = [...prev];
      const nowActive = new Set<string>();

      for (const rule of RULES) {
        const firing = rule.check(data);

        if (firing) {
          nowActive.add(rule.key);

          // Already tracked → move to "filtering" if it was just active
          const existing = next.find(
            (a) => a.ruleKey === rule.key && a.status !== 'resolved',
          );
          if (existing) {
            // keep it active (or filtering after 6s)
            const age = Date.now() - existing.createdAt.getTime();
            if (age > 6000 && existing.status === 'active') {
              existing.status = 'filtering';
            }
          } else if (!activeRules.current.has(rule.key)) {
            // Brand new violation → create alert + toast
            const alert: LiveAlert = {
              id: uid(),
              ruleKey: rule.key,
              title: rule.title,
              status: 'active',
              createdAt: new Date(),
            };
            next = [alert, ...next];

            // Fire toast
            setToast(alert);
            clearTimeout(toastTimer.current);
            toastTimer.current = setTimeout(() => setToast(null), 4000);
          }
        } else {
          // Condition cleared → resolve any active/filtering alert for this rule
          const live = next.find(
            (a) => a.ruleKey === rule.key && a.status !== 'resolved',
          );
          if (live) {
            live.status = 'resolved';
            live.resolvedAt = new Date();
          }
        }
      }

      activeRules.current = nowActive;

      // Keep only the last MAX_ALERTS
      return next.slice(0, MAX_ALERTS);
    });
  }, [data]);

  // Cleanup timer
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  return { alerts, toast, dismissToast };
}

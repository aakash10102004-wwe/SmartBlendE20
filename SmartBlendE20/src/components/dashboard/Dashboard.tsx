import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BarChart3,
  Bell,
  Headphones,
  ArrowLeft,
} from 'lucide-react';

import DashboardTab from './DashboardTab';
import InsightsTab from './InsightsTab';
import AlertsTab from './AlertsTab';
import ServicesTab from './ServicesTab';
import ToastNotification from './ToastNotification';
import { useSimulatedData } from './useSimulatedData';
import { useAlertEngine } from './useAlertEngine';
import './Dashboard.css';

type TabId = 'dashboard' | 'insights' | 'alerts' | 'services';

const tabs: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'services', label: 'Services', icon: Headphones },
];

export default function Dashboard({ onBackToHome }: { onBackToHome?: () => void }) {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const liveData = useSimulatedData(2000);
  const { alerts, toast, dismissToast } = useAlertEngine(liveData);

  const activeAlertCount = useMemo(
    () => alerts.filter((a) => a.status === 'active').length,
    [alerts],
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab data={liveData} />;
      case 'insights':
        return <InsightsTab data={liveData} />;
      case 'alerts':
        return <AlertsTab alerts={alerts} />;
      case 'services':
        return <ServicesTab />;
    }
  };

  return (
    <div className="dashboard-app">
      {/* ── Ambient background orbs ── */}
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />

      {/* ── Top Bar ── */}
      <header className="dash-topbar">
        <div className="dash-topbar-left">
          {onBackToHome && (
            <button
              className="dash-back-btn"
              onClick={onBackToHome}
              aria-label="Back to Home"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="dash-topbar-logo">SB</div>
          <div>
            <div className="dash-topbar-title">SmartBlend E20</div>
            <div className="dash-topbar-sub">Fuel Intelligence System</div>
          </div>
        </div>
        <div className="dash-topbar-right">
          <div className="dash-topbar-status">
            <span className="pulse-dot" />
            Online
          </div>
          <div className="dash-avatar">AS</div>
        </div>
      </header>

      {/* ── Toast Notifications ── */}
      <ToastNotification toast={toast} onDismiss={dismissToast} />

      {/* ── Main Content ── */}
      <div className="dash-content">
        <AnimatePresence mode="wait">
          {renderTab()}
        </AnimatePresence>
      </div>

      {/* ── Bottom Navigation ── */}
      <nav className="dash-bottom-nav" id="bottom-nav">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`nav-${tab.id}`}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-label={tab.label}
            >
              <span className="nav-tab-icon">
                <Icon size={20} />
                {tab.id === 'alerts' && activeAlertCount > 0 && (
                  <span className="nav-badge">{activeAlertCount}</span>
                )}
              </span>
              <span className="nav-tab-label">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

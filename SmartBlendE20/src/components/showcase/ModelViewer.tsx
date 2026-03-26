import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Thermometer, Droplets, FlaskConical, Cpu, Wifi, Filter, Zap, ArrowRight } from 'lucide-react';
import './ModelViewer.css';

/* ══════════════════════════════════════════
   COMPONENT DATA
   ══════════════════════════════════════════ */
interface ComponentInfo {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  detail: string;
  color: string;
  icon: typeof Thermometer;
  liveDataKey?: 'temperature' | 'water' | 'ethanol';
  liveUnit?: string;
  /* Hotspot position as % of image */
  x: number;
  y: number;
  w: number;
  h: number;
}

const COMPONENTS: ComponentInfo[] = [
  {
    id: 'filter',
    name: 'Filter Mesh',
    subtitle: 'Hydrophobic 5-Micron',
    description: 'Stops water droplets while allowing petrol to pass through. Multi-layer sintered mesh with 99.2% particle capture rate.',
    detail: 'Material: SS316 • Pore size: 5μm • Flow rate: 120 L/hr',
    color: '#00ff88',
    icon: Filter,
    x: 12, y: 32, w: 17, h: 30,
  },
  {
    id: 'capacitive',
    name: 'Capacitive Grid',
    subtitle: 'SS316 Parallel Plates',
    description: 'Insulated parallel-plate capacitance sensor detecting ethanol-to-petrol ratio in real time via dielectric constant measurement.',
    detail: 'Sensitivity: ±0.5% • Response: <500ms • Range: 0-100% E20',
    color: '#ffb800',
    icon: Zap,
    liveDataKey: 'ethanol',
    liveUnit: '%',
    x: 28, y: 65, w: 16, h: 18,
  },
  {
    id: 'water-pins',
    name: 'Water Sensing Pins',
    subtitle: 'Conductive Probes',
    description: 'Conductivity-based probes exposed for binary water detection. Detects contamination down to 0.05% volume.',
    detail: 'Type: Conductometric • Pins: 2× SS304 • Threshold: 0.05%',
    color: '#00d4ff',
    icon: Droplets,
    liveDataKey: 'water',
    liveUnit: '%',
    x: 48, y: 65, w: 16, h: 18,
  },
  {
    id: 'thermistor',
    name: 'NTC Thermistor',
    subtitle: 'Temperature Sensing',
    description: 'NTC 10 kΩ sensor monitoring fuel temperature with ±0.5°C accuracy. Compensates capacitance readings for temperature drift.',
    detail: 'Type: NTC 10kΩ • Accuracy: ±0.5°C • Range: -40 to 125°C',
    color: '#ff4060',
    icon: Thermometer,
    liveDataKey: 'temperature',
    liveUnit: '°C',
    x: 38, y: 73, w: 14, h: 12,
  },
  {
    id: 'esp32',
    name: 'ESP32 MCU',
    subtitle: 'Processing Node',
    description: 'Dual-core processor handling ADC sampling, frequency-to-digital conversion, and BLE/WiFi data transmission to the dashboard.',
    detail: 'Cores: 2× 240MHz • ADC: 12-bit • Connectivity: WiFi + BLE 5.0',
    color: '#00d4ff',
    icon: Cpu,
    x: 78, y: 12, w: 20, h: 35,
  },
  {
    id: 'wifi',
    name: 'WiFi / BLE Antenna',
    subtitle: 'Wireless Communication',
    description: 'Dual-mode antenna enabling real-time data streaming to the EthanolGuard mobile app and cloud dashboard.',
    detail: 'Protocol: WiFi 802.11 b/g/n + BLE 5.0 • Range: 50m',
    color: '#00ff88',
    icon: Wifi,
    x: 72, y: 80, w: 12, h: 15,
  },
  {
    id: 'flow',
    name: 'Flow Direction',
    subtitle: 'Fuel Inlet → Outlet',
    description: 'Fuel enters through the 8mm inlet nozzle, passes through the filter mesh and sensor array, and exits through the outlet. Secured with metal hose clamps.',
    detail: 'Nozzle: 8mm barb • Housing: Transparent polymer • Length: 10cm',
    color: '#4488ff',
    icon: ArrowRight,
    x: 2, y: 42, w: 14, h: 22,
  },
  {
    id: 'signal',
    name: 'Signal Conditioning',
    subtitle: 'Voltage Divider + TLC555',
    description: 'Analog signal conditioning circuit converting raw sensor outputs to digital-ready signals. Includes voltage divider and TLC555 timer IC for frequency conversion.',
    detail: 'Components: Voltage Divider + TLC555 Timer IC',
    color: '#ffb800',
    icon: Zap,
    x: 80, y: 55, w: 18, h: 22,
  },
];

/* ══════════════════════════════════════════
   SIMULATED LIVE DATA (matching dashboard)
   ══════════════════════════════════════════ */
function useLiveValues() {
  const [values, setValues] = useState({ temperature: 32.4, water: 1.8, ethanol: 87.5 });
  const ref = useRef(values);

  useEffect(() => {
    const id = setInterval(() => {
      const prev = ref.current;
      const next = {
        temperature: Math.max(25, Math.min(40, prev.temperature + (Math.random() - 0.48) * 0.6)),
        water: Math.max(0, Math.min(5, prev.water + (Math.random() - 0.52) * 0.3)),
        ethanol: Math.max(70, Math.min(100, prev.ethanol + (Math.random() - 0.48) * 0.8)),
      };
      ref.current = next;
      setValues(next);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return values;
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════ */
const ModelViewer = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const liveData = useLiveValues();

  const activeComp = COMPONENTS.find((c) => c.id === activeId) ?? null;

  const getLiveValue = (comp: ComponentInfo) => {
    if (!comp.liveDataKey) return null;
    return liveData[comp.liveDataKey].toFixed(1);
  };

  return (
    <section className="section model-section" id="3d-model">
      <div className="bg-glow model-glow" />
      <div className="container">
        {/* Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-badge">Interactive Viewer</div>
          <h2 className="section-title">Interactive System Diagram</h2>
          <p className="section-subtitle">
            Click components to explore the EthanolGuard fuel filtration system and its sensor architecture.
          </p>
        </motion.div>

        {/* Diagram wrapper */}
        <motion.div
          className="diagram-wrapper"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
        >
          <div className="diagram-image-area">
            {/* Base image */}
            <img
              src="/images/system-diagram.jpg"
              alt="EthanolGuard In-line Flow Chamber & ESP32 System Architecture"
              className="diagram-base-image"
              draggable={false}
            />

            {/* Flow animation overlay */}
            <div className="flow-arrow-overlay">
              <div className="flow-particle fp-1" />
              <div className="flow-particle fp-2" />
              <div className="flow-particle fp-3" />
            </div>

            {/* Hotspots */}
            {COMPONENTS.map((comp) => {
              const isHovered = hoveredId === comp.id;
              const isActive = activeId === comp.id;

              return (
                <button
                  key={comp.id}
                  className={`hotspot ${isHovered ? 'hovered' : ''} ${isActive ? 'active' : ''}`}
                  style={{
                    left: `${comp.x}%`,
                    top: `${comp.y}%`,
                    width: `${comp.w}%`,
                    height: `${comp.h}%`,
                    '--hotspot-color': comp.color,
                  } as React.CSSProperties}
                  onClick={() => setActiveId(isActive ? null : comp.id)}
                  onMouseEnter={() => setHoveredId(comp.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  aria-label={`Explore ${comp.name}`}
                >
                  {/* Pulse ring */}
                  <span className="hotspot-pulse" />
                  {/* Corner accent dot */}
                  <span className="hotspot-dot" />
                </button>
              );
            })}

            {/* Hover tooltip */}
            <AnimatePresence>
              {hoveredId && !activeId && (() => {
                const c = COMPONENTS.find((x) => x.id === hoveredId);
                if (!c) return null;
                const Icon = c.icon;
                return (
                  <motion.div
                    className="hover-tooltip"
                    key={hoveredId}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      left: `${Math.min(c.x + c.w / 2, 75)}%`,
                      top: `${Math.max(c.y - 6, 2)}%`,
                      '--tt-color': c.color,
                    } as React.CSSProperties}
                  >
                    <Icon size={12} />
                    <span>{c.name}</span>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>

          {/* Info panel */}
          <AnimatePresence mode="wait">
            {activeComp && (
              <motion.div
                className="info-panel"
                key={activeComp.id}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              >
                <button
                  className="info-panel-close"
                  onClick={() => setActiveId(null)}
                  aria-label="Close"
                >
                  <X size={14} />
                </button>

                <div className="info-panel-header">
                  <div className="info-panel-icon" style={{ background: `${activeComp.color}15`, borderColor: `${activeComp.color}30`, color: activeComp.color }}>
                    <activeComp.icon size={18} />
                  </div>
                  <div>
                    <h3 className="info-panel-name" style={{ color: activeComp.color }}>{activeComp.name}</h3>
                    <p className="info-panel-subtitle">{activeComp.subtitle}</p>
                  </div>
                </div>

                {/* Live data badge */}
                {activeComp.liveDataKey && (
                  <div className="info-panel-live" style={{ borderColor: `${activeComp.color}25` }}>
                    <span className="live-pulse" style={{ background: activeComp.color }} />
                    <span className="live-label">LIVE</span>
                    <span className="live-value" style={{ color: activeComp.color }}>
                      {getLiveValue(activeComp)}{activeComp.liveUnit}
                    </span>
                  </div>
                )}

                <p className="info-panel-desc">{activeComp.description}</p>

                <div className="info-panel-detail">
                  <span className="detail-label">SPECS</span>
                  <p>{activeComp.detail}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Parts legend (bottom) */}
          <div className="diagram-legend">
            {COMPONENTS.slice(0, 6).map((comp) => {
              const Icon = comp.icon;
              return (
                <button
                  key={comp.id}
                  className={`legend-chip ${activeId === comp.id ? 'active' : ''}`}
                  onClick={() => setActiveId(activeId === comp.id ? null : comp.id)}
                  style={{ '--chip-color': comp.color } as React.CSSProperties}
                >
                  <Icon size={12} />
                  <span>{comp.name}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModelViewer;

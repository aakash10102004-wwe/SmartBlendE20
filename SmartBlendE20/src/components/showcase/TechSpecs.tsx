import { motion } from 'framer-motion';
import { Cpu, Radio, Thermometer, Droplet, Gauge, FlaskConical } from 'lucide-react';
import './TechSpecs.css';

const specs = [
  {
    icon: <Cpu size={22} />,
    label: 'Microcontroller',
    value: 'ESP32-WROOM-32',
    detail: 'Dual-core 240 MHz, WiFi + BLE',
  },
  {
    icon: <Radio size={22} />,
    label: 'Ethanol Sensor',
    value: 'Capacitive Grid Array',
    detail: '18–25% range, ±0.3% accuracy',
  },
  {
    icon: <Thermometer size={22} />,
    label: 'Temperature',
    value: 'NTC Thermistor 10kΩ',
    detail: '-40°C to +125°C range',
  },
  {
    icon: <Droplet size={22} />,
    label: 'Water Detection',
    value: 'Dual-Pin Binary Sensor',
    detail: 'Resistance-based, < 0.1s response',
  },
  {
    icon: <Gauge size={22} />,
    label: 'Flow Rate',
    value: 'Hall-Effect Sensor',
    detail: '1–30 L/min, pulse output',
  },
  {
    icon: <FlaskConical size={22} />,
    label: 'Ethanol Range',
    value: 'E0 – E85 Compatible',
    detail: 'Full flex-fuel spectrum support',
  },
];

const TechSpecs = () => {
  return (
    <section className="section tech-specs" id="tech-specs">
      <div className="bg-glow ts-glow" />
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-badge">Specifications</div>
          <h2 className="section-title">Technical Overview</h2>
          <p className="section-subtitle">
            Industrial-grade components engineered for precision and durability 
            in real-world fuel environments.
          </p>
        </motion.div>

        <motion.div
          className="specs-grid"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          {specs.map((spec, index) => (
            <motion.div
              className="spec-item"
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.08, duration: 0.6 }}
            >
              <div className="spec-icon">{spec.icon}</div>
              <div className="spec-info">
                <span className="spec-label">{spec.label}</span>
                <span className="spec-value">{spec.value}</span>
                <span className="spec-detail">{spec.detail}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechSpecs;

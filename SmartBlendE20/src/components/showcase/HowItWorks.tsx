import { motion } from 'framer-motion';
import { Fuel, ScanSearch, Cpu, Monitor } from 'lucide-react';
import './HowItWorks.css';

const steps = [
  {
    number: '01',
    icon: <Fuel size={24} />,
    title: 'Fuel Enters Chamber',
    description: 'E20 blended fuel flows into the inline filtration chamber through the inlet pipe at standard fuel line pressure.',
  },
  {
    number: '02',
    icon: <ScanSearch size={24} />,
    title: 'Sensors Scan',
    description: 'Capacitive grid, NTC thermistor, and water sensing pins simultaneously analyze fuel composition and temperature.',
  },
  {
    number: '03',
    icon: <Cpu size={24} />,
    title: 'Microcontroller Analyzes',
    description: 'ESP32 processes multi-sensor fusion data in real-time, applying threshold algorithms and anomaly detection.',
  },
  {
    number: '04',
    icon: <Monitor size={24} />,
    title: 'Dashboard Updates',
    description: 'Live metrics stream to your IoT dashboard — fuel quality, water levels, temperature, and efficiency scores.',
  },
];

const HowItWorks = () => {
  return (
    <section className="section how-it-works" id="how-it-works">
      <div className="bg-glow hiw-glow" />
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-badge">The Process</div>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            From fuel intake to dashboard insight — four seamless stages 
            of intelligent monitoring.
          </p>
        </motion.div>

        <div className="hiw-timeline">
          {steps.map((step, index) => (
            <motion.div
              className="hiw-step"
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: index * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="hiw-step-number">
                <span>{step.number}</span>
                <div className="hiw-step-dot" />
              </div>
              <div className="hiw-step-card glass-card">
                <div className="icon-box cyan">{step.icon}</div>
                <h3 className="hiw-step-title">{step.title}</h3>
                <p className="hiw-step-desc">{step.description}</p>
              </div>
              {index < steps.length - 1 && <div className="hiw-connector" />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

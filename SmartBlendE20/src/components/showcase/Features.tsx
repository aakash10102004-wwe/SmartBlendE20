import { motion } from 'framer-motion';
import { Activity, Droplets, Cpu, Zap } from 'lucide-react';
import './Features.css';

const features = [
  {
    icon: <Activity size={24} />,
    color: 'cyan',
    title: 'Real-Time Fuel Monitoring',
    description:
      'Continuous ethanol percentage tracking with capacitive grid sensors, delivering live fuel composition data every 2 seconds.',
  },
  {
    icon: <Droplets size={24} />,
    color: 'green',
    title: 'Water Contamination Detection',
    description:
      'Binary water sensing pins detect moisture intrusion at molecular level, triggering instant alerts before engine damage occurs.',
  },
  {
    icon: <Zap size={24} />,
    color: 'amber',
    title: 'Smart Efficiency Optimization',
    description:
      'AI-driven analysis of fuel composition optimizes engine parameters, improving mileage by up to 12% with E20 blends.',
  },
  {
    icon: <Cpu size={24} />,
    color: 'cyan',
    title: 'ESP32 IoT Integration',
    description:
      'Industrial-grade ESP32 microcontroller processes sensor fusion data and streams it to your dashboard in real-time.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const Features = () => {
  return (
    <section className="section features" id="features">
      <div className="bg-glow features-glow" />
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-badge">Core Capabilities</div>
          <h2 className="section-title">Engineered for Intelligence</h2>
          <p className="section-subtitle">
            Four integrated sensor systems work in concert to monitor, analyze, 
            and optimize your E20 fuel in real-time.
          </p>
        </motion.div>

        <motion.div
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {features.map((feature, index) => (
            <motion.div
              className="glass-card feature-card"
              key={index}
              variants={cardVariants}
            >
              <div className={`icon-box ${feature.color}`}>{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className={`feature-line ${feature.color}`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;

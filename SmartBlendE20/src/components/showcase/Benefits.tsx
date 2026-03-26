import { motion } from 'framer-motion';
import { Fuel, ShieldCheck, Waves, BarChart3 } from 'lucide-react';
import './Benefits.css';

const benefits = [
  {
    icon: <Fuel size={28} />,
    title: 'Improved Mileage',
    value: '+12%',
    description: 'Optimized fuel-air ratio through precise ethanol monitoring delivers measurably better kilometers per liter.',
    color: 'cyan',
  },
  {
    icon: <ShieldCheck size={28} />,
    title: 'Engine Protection',
    value: '99.2%',
    description: 'Proactive contamination alerts prevent corrosion, injector damage, and costly engine repairs.',
    color: 'green',
  },
  {
    icon: <Waves size={28} />,
    title: 'Water Removal',
    value: '97.8%',
    description: 'Advanced multi-stage filtration eliminates water contamination before it reaches critical engine components.',
    color: 'amber',
  },
  {
    icon: <BarChart3 size={28} />,
    title: 'Real-Time Insights',
    value: '24/7',
    description: 'Continuous IoT dashboard streaming delivers actionable fuel quality data to your phone and desktop.',
    color: 'cyan',
  },
];

const Benefits = () => {
  return (
    <section className="section benefits" id="benefits">
      <div className="bg-glow benefits-glow" />
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-badge">Why Smart Blend</div>
          <h2 className="section-title">Measurable Advantages</h2>
          <p className="section-subtitle">
            Every metric that matters — from mileage to engine longevity — gets 
            a quantifiable boost with Smart Blend E20.
          </p>
        </motion.div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <motion.div
              className="benefit-card"
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={`benefit-icon-wrap ${benefit.color}`}>
                {benefit.icon}
                <div className={`benefit-icon-glow ${benefit.color}`} />
              </div>
              <div className="benefit-content">
                <div className="benefit-top">
                  <h3 className="benefit-title">{benefit.title}</h3>
                  <span className={`benefit-value ${benefit.color}`}>{benefit.value}</span>
                </div>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;

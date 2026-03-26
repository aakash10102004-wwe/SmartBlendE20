import { motion } from 'framer-motion';
import { Box, RotateCcw, ZoomIn, Move } from 'lucide-react';
import './ModelPlaceholder.css';

const ModelPlaceholder = () => {
  return (
    <section className="section model-section" id="3d-model">
      <div className="bg-glow model-glow" />
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-badge">Interactive Viewer</div>
          <h2 className="section-title">System Components</h2>
          <p className="section-subtitle">
            Explore the fuel filtration chamber in full 3D — click on parts to 
            understand each sensor and its function.
          </p>
        </motion.div>

        <motion.div
          className="model-placeholder"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
        >
          <div className="model-viewport">
            {/* Decorative rings */}
            <div className="model-ring model-ring-1" />
            <div className="model-ring model-ring-2" />
            <div className="model-ring model-ring-3" />

            {/* Floating dots */}
            <div className="model-dot model-dot-1" />
            <div className="model-dot model-dot-2" />
            <div className="model-dot model-dot-3" />
            <div className="model-dot model-dot-4" />
            <div className="model-dot model-dot-5" />

            {/* Center icon */}
            <div className="model-center">
              <Box size={48} strokeWidth={1.2} />
              <span className="model-center-pulse" />
            </div>

            <p className="model-label">Interactive 3D Model</p>
            <p className="model-sublabel">Coming Soon</p>
          </div>

          {/* Controls hint */}
          <div className="model-controls">
            <div className="model-control-hint">
              <RotateCcw size={14} />
              <span>Rotate</span>
            </div>
            <div className="model-control-hint">
              <ZoomIn size={14} />
              <span>Zoom</span>
            </div>
            <div className="model-control-hint">
              <Move size={14} />
              <span>Pan</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModelPlaceholder;

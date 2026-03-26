import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">E20</span>
            <span className="logo-text">SmartBlend</span>
          </div>
          <p className="footer-tagline">
            Intelligent E20 Fuel Filtration System — engineered for safety, efficiency, and performance.
          </p>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Navigate</h4>
          <a href="#features" className="footer-link">Features</a>
          <a href="#benefits" className="footer-link">Benefits</a>
          <a href="#how-it-works" className="footer-link">How It Works</a>
          <a href="#tech-specs" className="footer-link">Tech Specs</a>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Technology</h4>
          <span className="footer-link">ESP32 Platform</span>
          <span className="footer-link">Capacitive Sensing</span>
          <span className="footer-link">IoT Dashboard</span>
          <span className="footer-link">Sensor Fusion</span>
        </div>
      </div>

      <div className="container">
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} SmartBlend E20. All rights reserved.
          </p>
          <p className="footer-credit">
            Built with precision. Powered by innovation.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

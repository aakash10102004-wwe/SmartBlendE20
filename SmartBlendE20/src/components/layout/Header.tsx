import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import type { AppView } from '../../App';
import './Header.css';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Specs', href: '#tech-specs' },
];

const Header = ({ onNavigate }: { onNavigate: (view: AppView) => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnchorClick = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-inner">
        <a href="#hero" className="header-logo" onClick={handleAnchorClick('#hero')}>
          <span className="logo-icon">E20</span>
          <span className="logo-text">SmartBlend</span>
        </a>

        <nav className="header-nav">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link"
              onClick={handleAnchorClick(link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          className="btn btn-primary header-cta"
          onClick={() => onNavigate('dashboard')}
        >
          <LayoutDashboard size={16} />
          Dashboard
        </button>

        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="mobile-link"
                onClick={handleAnchorClick(link.href)}
              >
                {link.label}
              </a>
            ))}
            <button
              className="btn btn-primary mobile-cta"
              onClick={() => {
                setMobileOpen(false);
                onNavigate('dashboard');
              }}
            >
              <LayoutDashboard size={16} />
              View Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

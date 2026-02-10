import { motion } from 'framer-motion';
import { Home, Ticket, Clock, User, Gift, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

interface FooterProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

function Footer({ activeTab = 'home', onTabChange }: FooterProps) {
  const navItems = [
    { id: 'home', label: 'Главная', icon: Home },
    { id: 'lotteries', label: 'Лотереи', icon: Ticket },
    { id: 'history', label: 'История', icon: Clock },
    { id: 'verify', label: 'Проверка', icon: ShieldCheck },
    { id: 'profile', label: 'Профиль', icon: User },
    { id: 'referral', label: 'Реферал', icon: Gift },
  ];

  return (
    <motion.footer
      className="footer-nav"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="footer-content">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            className={`footer-nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange?.(item.id)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="footer-icon-wrapper"
              animate={activeTab === item.id ? { y: [0, -4, 0] } : {}}
              transition={{ duration: 0.6, repeat: activeTab === item.id ? 3 : 0, repeatDelay: 2 }}
            >
              <item.icon size={24} />
            </motion.div>
            <span className="footer-label">{item.label}</span>
            {activeTab === item.id && (
              <motion.div
                className="footer-active-indicator"
                layoutId="activeTab"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
      
      {/* Legal Links */}
      <div className="footer-legal">
        <Link to="/terms" className="footer-legal-link" aria-label="Условия использования">Условия</Link>
        <span className="footer-legal-divider">•</span>
        <Link to="/privacy" className="footer-legal-link" aria-label="Политика конфиденциальности">Конфиденциальность</Link>
      </div>
    </motion.footer>
  );
}

export default Footer;

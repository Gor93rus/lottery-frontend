import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { TrendingUp, Users, Trophy } from 'lucide-react';
import './Hero.css';

function Hero() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.section
      ref={ref}
      className="hero"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ staggerChildren: 0.2 }}
    >
      <motion.h1
        className="hero-title"
        initial={{ y: 30, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
        transition={{ duration: 0.6, delay: 0 }}
      >
        <span className="hero-title-gradient">Weekend Millions</span>
      </motion.h1>

      <motion.p
        className="hero-subtitle"
        initial={{ y: 30, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Криптовалютная лотерея нового поколения на блокчейне TON
      </motion.p>

      <motion.div
        className="hero-stats"
        initial={{ y: 30, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="hero-stat-item">
          <div className="hero-stat-icon">
            <Trophy size={24} />
          </div>
          <div className="hero-stat-content">
            <div className="hero-stat-value">10,000 TON</div>
            <div className="hero-stat-label">Призовой фонд</div>
          </div>
        </div>

        <div className="hero-stat-item">
          <div className="hero-stat-icon">
            <Users size={24} />
          </div>
          <div className="hero-stat-content">
            <div className="hero-stat-value">1,234</div>
            <div className="hero-stat-label">Участников</div>
          </div>
        </div>

        <div className="hero-stat-item">
          <div className="hero-stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="hero-stat-content">
            <div className="hero-stat-value">24ч</div>
            <div className="hero-stat-label">До розыгрыша</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="hero-features"
        initial={{ y: 30, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="hero-feature">
          <div className="feature-check">✓</div>
          <span>Прозрачность блокчейна</span>
        </div>
        <div className="hero-feature">
          <div className="feature-check">✓</div>
          <span>Мгновенные выплаты</span>
        </div>
        <div className="hero-feature">
          <div className="feature-check">✓</div>
          <span>Справедливые розыгрыши</span>
        </div>
      </motion.div>
    </motion.section>
  );
}

export default Hero;

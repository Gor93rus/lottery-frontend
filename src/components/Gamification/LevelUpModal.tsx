import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Sparkles, Crown, Gem } from 'lucide-react';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import './LevelUpModal.css';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
  rewards?: {
    tickets?: number;
    badges?: string[];
    vipStatus?: 'bronze' | 'gold' | 'diamond';
  };
}

function LevelUpModal({ isOpen, onClose, level, rewards }: LevelUpModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti when modal opens
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      
      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        confetti({
          particleCount: 3,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
          colors: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1']
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const getVipIcon = (status?: string) => {
    switch (status) {
      case 'bronze':
        return <Trophy className="vip-icon bronze" />;
      case 'gold':
        return <Crown className="vip-icon gold" />;
      case 'diamond':
        return <Gem className="vip-icon diamond" />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="level-up-modal"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <button className="close-button" onClick={onClose}>
              <X size={24} />
            </button>

            <div className="modal-content">
              {/* Sparkle decoration */}
              <motion.div
                className="sparkle-decoration"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              >
                <Sparkles size={48} className="sparkle-large" />
              </motion.div>

              {/* Level number */}
              <motion.div
                className="level-display"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Trophy size={64} className="level-trophy" />
                <h2 className="level-number">{level}</h2>
              </motion.div>

              <motion.h1
                className="modal-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Поздравляем!
              </motion.h1>

              <motion.p
                className="modal-subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Вы достигли уровня {level}!
              </motion.p>

              {/* Rewards */}
              {rewards && (
                <motion.div
                  className="rewards-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="rewards-title">🎁 Награды:</h3>
                  <div className="rewards-list">
                    {rewards.tickets && rewards.tickets > 0 && (
                      <div className="reward-item">
                        <span className="reward-icon">🎟️</span>
                        <span className="reward-text">
                          +{rewards.tickets} {rewards.tickets === 1 ? 'билет' : 'билетов'}
                        </span>
                      </div>
                    )}
                    {rewards.badges && rewards.badges.length > 0 && (
                      <div className="reward-item">
                        <span className="reward-icon">🏆</span>
                        <span className="reward-text">
                          {rewards.badges.length} {rewards.badges.length === 1 ? 'значок' : 'значков'}
                        </span>
                      </div>
                    )}
                    {rewards.vipStatus && (
                      <div className="reward-item vip">
                        {getVipIcon(rewards.vipStatus)}
                        <span className="reward-text">
                          VIP статус: {rewards.vipStatus.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Close button */}
              <motion.button
                className="confirm-button"
                onClick={onClose}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Отлично!
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default LevelUpModal;

import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';
import './RewardModal.css';

interface Reward {
  type: 'xp' | 'ticket' | 'badge' | 'ton';
  amount?: number;
  value?: number;
  description?: string;
}

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward: Reward | null;
  achievementName?: string;
  onClaim?: () => void;
  isClaiming?: boolean;
}

function RewardModal({ isOpen, onClose, reward, achievementName, onClaim, isClaiming }: RewardModalProps) {
  
  // Trigger confetti when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!reward) return null;

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'xp': return '⭐';
      case 'ticket': return '🎫';
      case 'badge': return '🏆';
      case 'ton': return '💎';
      default: return '🎁';
    }
  };

  const getRewardLabel = (type: string) => {
    switch (type) {
      case 'xp': return 'XP';
      case 'ticket': return 'Билеты';
      case 'badge': return 'Значок';
      case 'ton': return 'TON';
      default: return 'Награда';
    }
  };

  const rewardAmount = reward.amount || reward.value || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="reward-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="reward-modal"
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="reward-modal-close"
              onClick={onClose}
              aria-label="Закрыть"
            >
              <X size={24} />
            </button>

            <motion.div
              className="reward-icon-container"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', damping: 15 }}
            >
              <Gift className="reward-gift-icon" size={48} />
            </motion.div>

            <motion.h2
              className="reward-modal-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Поздравляем!
            </motion.h2>

            {achievementName && (
              <motion.p
                className="reward-achievement-name"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {achievementName}
              </motion.p>
            )}

            <motion.div
              className="reward-display"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="reward-icon-large">
                {getRewardIcon(reward.type)}
              </div>
              <div className="reward-amount">
                +{rewardAmount} {getRewardLabel(reward.type)}
              </div>
              {reward.description && (
                <p className="reward-description">{reward.description}</p>
              )}
            </motion.div>

            {onClaim ? (
              <motion.button
                className="reward-claim-button"
                onClick={onClaim}
                disabled={isClaiming}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isClaiming ? (
                  <>
                    <div className="claim-spinner" />
                    Получение...
                  </>
                ) : (
                  'Забрать награду'
                )}
              </motion.button>
            ) : (
              <motion.button
                className="reward-ok-button"
                onClick={onClose}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Отлично!
              </motion.button>
            )}

            {/* Decorative particles */}
            <div className="reward-particles">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="particle"
                  initial={{ 
                    opacity: 0,
                    x: 0,
                    y: 0,
                    scale: 0
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: Math.cos((i / 8) * Math.PI * 2) * 100,
                    y: Math.sin((i / 8) * Math.PI * 2) * 100,
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 0.3 + i * 0.05,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default RewardModal;

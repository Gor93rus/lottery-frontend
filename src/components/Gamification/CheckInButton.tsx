import { motion } from 'framer-motion';
import { Calendar, Flame, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import './CheckInButton.css';

interface CheckInButtonProps {
  currentStreak: number;
  canCheckIn: boolean;
  isCheckingIn: boolean;
  onCheckIn: () => void;
  checkInResult?: {
    xpEarned: number;
    newStreak: number;
    milestoneReached: {
      days: number;
      reward: {
        type: string;
        value: number;
      };
    } | null;
  } | null;
}

function CheckInButton({
  currentStreak,
  canCheckIn,
  isCheckingIn,
  onCheckIn,
  checkInResult
}: CheckInButtonProps) {
  const [showFeedback, setShowFeedback] = useState(false);

  // Show feedback and confetti when check-in is successful
  useEffect(() => {
    if (checkInResult) {
      setShowFeedback(true);
      
      // Fire confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Extra confetti for milestone
      if (checkInResult.milestoneReached) {
        setTimeout(() => {
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#FF69B4']
          });
        }, 300);
      }

      // Hide feedback after 5 seconds
      setTimeout(() => {
        setShowFeedback(false);
      }, 5000);
    }
  }, [checkInResult]);

  return (
    <div className="check-in-button-container">
      {canCheckIn ? (
        <motion.button
          className="check-in-button active"
          onClick={onCheckIn}
          disabled={isCheckingIn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="button-content">
            <motion.div
              className="icon-wrapper"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Calendar size={24} />
            </motion.div>
            <div className="button-text">
              <span className="button-title">
                {isCheckingIn ? 'Отмечаем...' : 'Ежедневная отметка'}
              </span>
              <span className="button-subtitle">
                Получи XP и продли streak!
              </span>
            </div>
            <Sparkles size={20} className="sparkle-icon" />
          </div>
        </motion.button>
      ) : (
        <div className="check-in-button disabled">
          <div className="button-content">
            <Flame size={24} className="flame-icon" />
            <div className="button-text">
              <span className="button-title">Уже отмечено сегодня!</span>
              <span className="button-subtitle">
                Streak: {currentStreak} {currentStreak === 1 ? 'день' : 'дней'} 🔥
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Feedback animation */}
      {showFeedback && checkInResult && (
        <motion.div
          className="check-in-feedback"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <div className="feedback-content">
            <div className="feedback-header">
              <Sparkles size={24} />
              <h3>Отлично!</h3>
            </div>
            <p className="xp-earned">+{checkInResult.xpEarned} XP</p>
            <p className="streak-info">
              Streak: {checkInResult.newStreak} дней 🔥
            </p>
            {checkInResult.milestoneReached && (
              <div className="milestone-reward">
                <p className="milestone-title">
                  🎉 Достижение: {checkInResult.milestoneReached.days} дней!
                </p>
                <p className="reward-info">
                  Награда: +{checkInResult.milestoneReached.reward.value}{' '}
                  {checkInResult.milestoneReached.reward.type === 'xp' ? 'XP' : 'Билетов'}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default CheckInButton;

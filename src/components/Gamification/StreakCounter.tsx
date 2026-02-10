import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import './StreakCounter.css';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

function StreakCounter({ currentStreak, longestStreak }: StreakCounterProps) {
  const maxStreak = 7;
  const isOnFire = currentStreak >= 3;

  // Generate streak history for the last 7 days
  const streakHistory = Array.from({ length: maxStreak }, (_, i) => i < currentStreak);

  return (
    <motion.div
      className="streak-counter-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="streak-card">
        <div className="streak-header">
          <motion.div
            className={`streak-flame ${isOnFire ? 'active' : ''}`}
            animate={isOnFire ? { scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Flame size={32} />
          </motion.div>
          <div className="streak-info">
            <h3 className="streak-title">
              <motion.span
                key={currentStreak}
                initial={{ scale: 1.5, color: '#fbbf24' }}
                animate={{ scale: 1, color: '#fff' }}
                transition={{ duration: 0.3 }}
              >
                {currentStreak}
              </motion.span>{' '}
              дней подряд с нами!
            </h3>
            <p className="streak-subtitle">
              {currentStreak > 0 ? 'Продолжай в том же духе! 🔥' : 'Начни свою серию сегодня! 💪'}
            </p>
            {longestStreak > currentStreak && (
              <p className="longest-streak">
                Лучшая серия: {longestStreak} дней
              </p>
            )}
          </div>
        </div>

        <div className="streak-progress">
          <div className="days-container">
            {Array.from({ length: maxStreak }).map((_, index) => {
              const hasStreak = streakHistory[index];
              return (
                <motion.div
                  key={index}
                  className={`day-item ${hasStreak ? 'completed' : 'pending'}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {hasStreak ? (
                    <motion.div
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      🔥
                    </motion.div>
                  ) : (
                    <div className="day-empty">○</div>
                  )}
                  <span className="day-label">День {index + 1}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="streak-rewards">
          <h4 className="rewards-title">🎁 Награды за streak</h4>
          <div className="rewards-grid">
            <div className={`reward-item ${currentStreak >= 7 ? 'unlocked' : ''}`}>
              <span className="reward-icon">🎟️</span>
              <span className="reward-text">7 дней: +10 XP</span>
            </div>
            <div className={`reward-item ${currentStreak >= 14 ? 'unlocked' : ''}`}>
              <span className="reward-icon">💎</span>
              <span className="reward-text">14 дней: +30 XP</span>
            </div>
            <div className={`reward-item ${currentStreak >= 30 ? 'unlocked' : ''}`}>
              <span className="reward-icon">👑</span>
              <span className="reward-text">30 дней: +100 XP</span>
            </div>
          </div>
        </div>

        {currentStreak > 0 && currentStreak < maxStreak && (
          <motion.div
            className="streak-warning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            ⚠️ Не забудь зайти завтра, чтобы не потерять streak!
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default StreakCounter;

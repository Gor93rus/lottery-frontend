import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import confetti from 'canvas-confetti';
import './AchievementBadges.css';
import type { AchievementProgress } from '../../types/gamification';

interface AchievementBadgesProps {
  achievements: AchievementProgress[];
  onClaim?: (achievementId: string) => void;
  isClaiming?: boolean;
}

function AchievementBadges({ achievements, onClaim, isClaiming }: AchievementBadgesProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementProgress | null>(null);

  const handleBadgeClick = (achievementProgress: AchievementProgress) => {
    setSelectedAchievement(achievementProgress);

    if (achievementProgress.unlocked) {
      // Trigger confetti for unlocked achievements
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return '🥉';
      case 'gold':
        return '🥇';
      case 'diamond':
        return '💎';
      default:
        return '🏆';
    }
  };

  return (
    <motion.div
      className="achievements-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="achievements-header">
        <h3>🏆 Достижения</h3>
        <div className="achievements-progress">
          <span className="progress-count">
            {unlockedCount}/{totalCount}
          </span>
          <div className="mini-progress-bar">
            <motion.div
              className="mini-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>

      <div className="badges-grid">
        {achievements.length === 0 ? (
          <div className="no-achievements">
            <p>Нет доступных достижений</p>
          </div>
        ) : (
          achievements.map((achievementProgress, index) => {
            const achievement = achievementProgress.achievement;
            const canClaim = achievementProgress.unlocked && 
                           achievementProgress.userAchievement && 
                           !achievementProgress.userAchievement.claimed;

            return (
              <motion.div
                key={achievement.id}
                className={`badge-item ${achievementProgress.unlocked ? 'unlocked' : 'locked'} ${canClaim ? 'claimable' : ''}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -4 }}
                onClick={() => handleBadgeClick(achievementProgress)}
              >
                <div className="badge-icon-container">
                  <div className="badge-icon">
                    {achievement.icon || getTierIcon(achievement.tier)}
                  </div>
                  {achievementProgress.unlocked && <div className="badge-shine" />}
                  {canClaim && <div className="claim-indicator">!</div>}
                </div>
                <div className="badge-title">{achievement.title}</div>
                {!achievementProgress.unlocked && (
                  <div className="badge-progress-text">
                    {achievementProgress.currentValue}/{achievement.requirement}
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            className="achievement-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              className="achievement-modal"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setSelectedAchievement(null)}
              >
                <X size={24} />
              </button>

              <div className="modal-icon-large">
                {selectedAchievement.achievement.icon || getTierIcon(selectedAchievement.achievement.tier)}
              </div>

              <h2 className="modal-title">{selectedAchievement.achievement.title}</h2>
              <p className="modal-description">{selectedAchievement.achievement.description}</p>

              {selectedAchievement.unlocked ? (
                <div className="modal-unlocked">
                  <div className="unlocked-badge">✓ Получено!</div>
                  {selectedAchievement.userAchievement && (
                    <p className="unlock-date">
                      {new Date(selectedAchievement.userAchievement.unlockedAt).toLocaleDateString('ru-RU')}
                    </p>
                  )}
                  {selectedAchievement.userAchievement && !selectedAchievement.userAchievement.claimed && onClaim && (
                    <motion.button
                      className="claim-reward-button"
                      onClick={() => {
                        onClaim(selectedAchievement.achievement.id);
                        setSelectedAchievement(null);
                      }}
                      disabled={isClaiming}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Забрать награду (+{selectedAchievement.achievement.rewardXp} XP)
                    </motion.button>
                  )}
                </div>
              ) : (
                <div className="modal-locked">
                  <div className="locked-badge">🔒 Заблокировано</div>
                  <div className="modal-progress">
                    <div className="modal-progress-bar">
                      <motion.div
                        className="modal-progress-fill"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            (selectedAchievement.currentValue /
                              selectedAchievement.achievement.requirement) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <p className="modal-progress-text">
                      {selectedAchievement.currentValue}/{selectedAchievement.achievement.requirement} до получения
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default AchievementBadges;

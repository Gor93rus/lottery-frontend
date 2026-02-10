import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock, Gift } from 'lucide-react';
import './DailyQuests.css';
import type { UserQuest } from '../../types/gamification';

interface DailyQuestsProps {
  quests: UserQuest[];
  onClaim?: (questId: string) => void;
  isClaiming?: boolean;
}

// Helper function to map reward types to icons
const getRewardIcon = (rewardType: 'xp' | 'ticket' | 'badge'): string => {
  switch (rewardType) {
    case 'xp':
      return 'XP';
    case 'ticket':
      return '🎟️';
    case 'badge':
      return '🏆';
    default:
      return '';
  }
};

function DailyQuests({ quests, onClaim, isClaiming }: DailyQuestsProps) {
  // Calculate time until midnight for reset timer (in seconds)
  const getTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0);
    return Math.floor((tomorrow.getTime() - now.getTime()) / 1000);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}ч ${minutes}м`;
  };

  const timeUntilReset = getTimeUntilReset();

  return (
    <motion.div
      className="daily-quests-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="quests-header">
        <div className="quests-title-section">
          <h3>📋 Ежедневные задания</h3>
          <p className="quests-subtitle">Выполни задания и получи награды!</p>
        </div>
        <div className="reset-timer">
          <Clock size={16} />
          <span>Обновится через {formatTime(timeUntilReset)}</span>
        </div>
      </div>

      <div className="quests-list">
        {quests.length === 0 ? (
          <div className="no-quests">
            <p>Нет доступных заданий</p>
          </div>
        ) : (
          quests.map((userQuest, index) => {
            const quest = userQuest.quest;
            const progressPercent = (userQuest.progress / quest.target) * 100;
            const canClaim = userQuest.completed && !userQuest.claimed;

            return (
              <motion.div
                key={userQuest.id}
                className={`quest-item ${userQuest.completed ? 'completed' : ''} ${canClaim ? 'claimable' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="quest-icon">
                  {userQuest.completed ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <CheckCircle size={24} className="completed-icon" />
                    </motion.div>
                  ) : (
                    <Circle size={24} className="pending-icon" />
                  )}
                </div>

                <div className="quest-content">
                  <h4 className="quest-title">{quest.title}</h4>
                  <p className="quest-description">{quest.description}</p>

                  <div className="quest-progress-section">
                    <div className="progress-bar-container">
                      <motion.div
                        className="progress-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="progress-text">
                      {userQuest.progress}/{quest.target}
                    </span>
                  </div>
                </div>

                <div className="quest-reward">
                  {canClaim ? (
                    <motion.button
                      className="claim-button"
                      onClick={() => onClaim?.(userQuest.id)}
                      disabled={isClaiming}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Gift size={16} />
                      <span>Забрать</span>
                    </motion.button>
                  ) : (
                    <div className="reward-badge">
                      {userQuest.claimed && <div className="reward-checkmark">✓</div>}
                      <span className="reward-amount">
                        +{quest.rewardValue} {getRewardIcon(quest.rewardType)}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}

export default DailyQuests;

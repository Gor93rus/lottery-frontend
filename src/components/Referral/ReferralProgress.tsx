import { motion } from 'framer-motion';
import './ReferralProgress.css';

interface ReferralMilestone {
  target: number;
  reward: number;
  unlocked: boolean;
  current?: number;
}

interface ReferralProgressProps {
  currentReferrals?: number;
  milestones?: ReferralMilestone[];
}

const defaultMilestones: ReferralMilestone[] = [
  { target: 5, reward: 50, unlocked: true, current: 5 },
  { target: 10, reward: 150, unlocked: false, current: 7 },
  { target: 25, reward: 500, unlocked: false, current: 7 },
  { target: 50, reward: 1500, unlocked: false, current: 7 },
];

function ReferralProgress({
  currentReferrals = 7,
  milestones = defaultMilestones,
}: ReferralProgressProps) {
  const totalPossibleReward = milestones.reduce((sum, m) => sum + m.reward, 0);
  const earnedReward = milestones.filter((m) => m.unlocked).reduce((sum, m) => sum + m.reward, 0);

  const getMilestoneIcon = (index: number, unlocked: boolean) => {
    if (unlocked) return '✅';
    const icons = ['🎁', '💎', '👑', '🏆'];
    return icons[index] || '🎁';
  };

  const getMilestoneClass = (index: number) => {
    const classes = ['common', 'rare', 'epic', 'legendary'];
    return classes[index] || 'common';
  };

  return (
    <motion.div
      className="referral-progress"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="progress-header">
        <h3 className="progress-title">🎯 Цели и вехи</h3>
        <p className="progress-subtitle">
          Приглашай друзей и получай награды за достижения
        </p>
      </div>

      {/* Current Progress Summary */}
      <div className="progress-summary">
        <div className="summary-card">
          <div className="summary-icon">👥</div>
          <div className="summary-content">
            <div className="summary-label">Всего приглашено</div>
            <div className="summary-value">{currentReferrals}</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">💰</div>
          <div className="summary-content">
            <div className="summary-label">Вы заработали</div>
            <div className="summary-value">
              {earnedReward} <span className="summary-currency">TON</span>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="milestones-list">
        {milestones.map((milestone, index) => {
          const progress = Math.min((currentReferrals / milestone.target) * 100, 100);
          const isNearComplete = progress >= 70 && progress < 100;

          return (
            <motion.div
              key={index}
              className={`milestone ${getMilestoneClass(index)} ${
                milestone.unlocked ? 'unlocked' : ''
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="milestone-icon-wrapper">
                <div className={`milestone-icon ${isNearComplete ? 'pulse' : ''}`}>
                  {getMilestoneIcon(index, milestone.unlocked)}
                </div>
              </div>

              <div className="milestone-content">
                <div className="milestone-header">
                  <div className="milestone-title">
                    Пригласи {milestone.target} друзей
                  </div>
                  <div className="milestone-reward">
                    {milestone.unlocked ? '✅' : '🔒'} {milestone.reward} TON
                  </div>
                </div>

                <div className="progress-bar-container">
                  <div className="progress-bar-bg">
                    <motion.div
                      className="progress-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                  <div className="progress-text">
                    {milestone.unlocked
                      ? 'Выполнено!'
                      : `${currentReferrals}/${milestone.target}`}
                  </div>
                </div>

                {!milestone.unlocked && progress < 100 && (
                  <div className="milestone-remaining">
                    До награды: <strong>{milestone.target - currentReferrals}</strong> друга
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Overall Progress */}
      <div className="overall-progress">
        <div className="overall-header">
          <span className="overall-label">Общий прогресс наград</span>
          <span className="overall-value">
            {earnedReward} / {totalPossibleReward} TON
          </span>
        </div>
        <div className="overall-bar-bg">
          <motion.div
            className="overall-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${(earnedReward / totalPossibleReward) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>

      {/* Next Milestone */}
      {(() => {
        const nextMilestone = milestones.find((m) => !m.unlocked);
        if (nextMilestone) {
          return (
            <div className="next-milestone-banner">
              <div className="banner-icon">🎯</div>
              <div className="banner-text">
                <strong>До следующей награды:</strong>{' '}
                {nextMilestone.target - currentReferrals} друга
              </div>
              <div className="banner-reward">+{nextMilestone.reward} TON</div>
            </div>
          );
        }
        return (
          <div className="next-milestone-banner completed">
            <div className="banner-icon">🏆</div>
            <div className="banner-text">
              <strong>Поздравляем!</strong> Все награды получены!
            </div>
          </div>
        );
      })()}
    </motion.div>
  );
}

export default ReferralProgress;

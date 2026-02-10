import { motion } from 'framer-motion';
import type { AchievementProgress } from '../types/gamification';
import './AchievementCard.css';

interface AchievementCardProps {
  achievementProgress: AchievementProgress;
  onClick?: () => void;
  index?: number;
}

const tierColors: Record<string, string> = {
  bronze: '#CD7F32',
  gold: '#FFD700',
  diamond: '#B9F2FF'
};

const getTierIcon = (tier: string) => {
  switch (tier) {
    case 'bronze': return '🥉';
    case 'gold': return '🥇';
    case 'diamond': return '💎';
    default: return '🏆';
  }
};

function AchievementCard({ achievementProgress, onClick, index = 0 }: AchievementCardProps) {
  const achievement = achievementProgress.achievement;
  const canClaim = achievementProgress.unlocked && 
                   achievementProgress.userAchievement && 
                   !achievementProgress.userAchievement.claimed;

  const progressPercentage = achievement.requirement > 0
    ? (achievementProgress.currentValue / achievement.requirement) * 100
    : 0;

  return (
    <motion.div
      className={`achievement-card ${achievementProgress.unlocked ? 'unlocked' : 'locked'} ${canClaim ? 'claimable' : ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.03, y: -4 }}
      onClick={onClick}
      style={{
        borderColor: achievementProgress.unlocked 
          ? tierColors[achievement.tier] 
          : 'rgba(255,255,255,0.1)'
      }}
    >
      {/* Tier Badge */}
      <div 
        className="achievement-tier-badge" 
        style={{ 
          background: achievementProgress.unlocked ? tierColors[achievement.tier] : '#666'
        }}
      >
        {getTierIcon(achievement.tier)}
      </div>

      {/* Claim Badge */}
      {canClaim && (
        <div className="claim-badge">
          Забрать награду!
        </div>
      )}

      {/* Icon */}
      <div className="achievement-icon-large">
        {achievement.icon || getTierIcon(achievement.tier)}
      </div>

      {/* Title & Description */}
      <h3 className="achievement-title">{achievement.title}</h3>
      <p className="achievement-description">{achievement.description}</p>

      {/* Progress Bar (only for locked achievements) */}
      {!achievementProgress.unlocked && (
        <div className="achievement-progress-section">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            />
          </div>
          <div className="progress-text">
            {achievementProgress.currentValue}/{achievement.requirement}
          </div>
        </div>
      )}

      {/* Rewards */}
      <div className="achievement-rewards">
        {achievement.rewardXp > 0 && (
          <span className="reward-badge">+{achievement.rewardXp} XP</span>
        )}
        {achievement.rewardTickets > 0 && (
          <span className="reward-badge">+{achievement.rewardTickets} билетов</span>
        )}
      </div>

      {/* Unlocked Date */}
      {achievementProgress.unlocked && achievementProgress.userAchievement && (
        <div className="unlocked-date">
          Получено {new Date(achievementProgress.userAchievement.unlockedAt).toLocaleDateString('ru-RU')}
        </div>
      )}
    </motion.div>
  );
}

export default AchievementCard;

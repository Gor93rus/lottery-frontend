import { motion } from 'framer-motion';
import { useAchievementProgress } from '../hooks/useAchievementProgress';
import './AchievementProgress.css';

interface AchievementProgressProps {
  achievementId: string;
  showDetails?: boolean;
}

function AchievementProgress({ achievementId, showDetails = true }: AchievementProgressProps) {
  const { progress, progressPercentage, isLoading, error } = useAchievementProgress(achievementId);

  if (isLoading) {
    return (
      <div className="achievement-progress-loading">
        <div className="progress-spinner" />
      </div>
    );
  }

  if (error || !progress) {
    return (
      <div className="achievement-progress-error">
        Не удалось загрузить прогресс
      </div>
    );
  }

  const achievement = progress.achievement;

  return (
    <div className="achievement-progress-component">
      {showDetails && (
        <div className="achievement-progress-header">
          <div className="achievement-icon-small">
            {achievement.icon || '🏆'}
          </div>
          <div className="achievement-info">
            <h4 className="achievement-name">{achievement.title}</h4>
            <p className="achievement-category">{getCategoryLabel(achievement.category)}</p>
          </div>
        </div>
      )}

      <div className="progress-bar-container">
        <div className="progress-bar-bg">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
            style={{
              background: progress.unlocked
                ? 'linear-gradient(90deg, #4CAF50, #45a049)'
                : 'linear-gradient(90deg, #667eea, #764ba2)'
            }}
          />
        </div>
        <div className="progress-stats">
          <span className="progress-current">{progress.currentValue}</span>
          <span className="progress-separator">/</span>
          <span className="progress-target">{achievement.requirement}</span>
        </div>
      </div>

      {progress.unlocked ? (
        <div className="progress-status unlocked">
          <span className="status-icon">✓</span>
          <span className="status-text">Выполнено!</span>
        </div>
      ) : (
        <div className="progress-status locked">
          <span className="status-text">
            Осталось: {achievement.requirement - progress.currentValue}
          </span>
        </div>
      )}

      {showDetails && (
        <div className="achievement-rewards-preview">
          {achievement.rewardXp > 0 && (
            <span className="reward-preview">⭐ +{achievement.rewardXp} XP</span>
          )}
          {achievement.rewardTickets > 0 && (
            <span className="reward-preview">🎫 +{achievement.rewardTickets}</span>
          )}
        </div>
      )}
    </div>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    tickets: 'Билеты',
    wins: 'Победы',
    streak: 'Серии',
    referrals: 'Рефералы',
    level: 'Уровень'
  };
  return labels[category] || category;
}

export default AchievementProgress;

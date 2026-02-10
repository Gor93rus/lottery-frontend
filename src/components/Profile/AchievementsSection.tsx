import './AchievementsSection.css';

interface Achievement {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

interface AchievementsSectionProps {
  achievements?: Achievement[];
  loading: boolean;
}

export default function AchievementsSection({ achievements, loading }: AchievementsSectionProps) {
  if (loading) {
    return <div className="achievements-skeleton">Загрузка...</div>;
  }

  if (!achievements || achievements.length === 0) {
    return <div className="achievements-empty">Нет достижений</div>;
  }

  return (
    <div className="achievements-grid">
      {achievements.map(achievement => (
        <div 
          key={achievement.id} 
          className={`achievement-badge ${achievement.unlockedAt ? 'unlocked' : 'locked'}`}
          title={`${achievement.name}: ${achievement.description}`}
        >
          <span className="achievement-icon">
            {achievement.unlockedAt ? achievement.icon : '🔒'}
          </span>
          <span className="achievement-name">
            {achievement.unlockedAt ? achievement.name : '???'}
          </span>
        </div>
      ))}
    </div>
  );
}

import './StatsSection.css';

interface StatsSectionProps {
  stats?: {
    ticketsBought: number;
    totalWins: number;
    totalWonAmount: number;
    currentStreak: number;
    referralsCount: number;
  };
  loading: boolean;
}

export default function StatsSection({ stats, loading }: StatsSectionProps) {
  if (loading) {
    return <div className="stats-skeleton">Загрузка...</div>;
  }

  if (!stats) {
    return <div className="stats-empty">Нет данных</div>;
  }

  return (
    <div className="stats-list">
      <div className="stats-item">
        <span className="stats-icon">🎫</span>
        <span className="stats-label">Билетов куплено:</span>
        <span className="stats-value">{stats.ticketsBought}</span>
      </div>
      <div className="stats-item">
        <span className="stats-icon">🏆</span>
        <span className="stats-label">Выигрышей:</span>
        <span className="stats-value">{stats.totalWins}</span>
      </div>
      <div className="stats-item">
        <span className="stats-icon">💰</span>
        <span className="stats-label">Всего выиграно:</span>
        <span className="stats-value">{stats.totalWonAmount.toFixed(1)} TON</span>
      </div>
      <div className="stats-item">
        <span className="stats-icon">🔥</span>
        <span className="stats-label">Дней подряд:</span>
        <span className="stats-value">{stats.currentStreak}</span>
      </div>
      <div className="stats-item">
        <span className="stats-icon">👥</span>
        <span className="stats-label">Рефералов:</span>
        <span className="stats-value">{stats.referralsCount}</span>
      </div>
    </div>
  );
}

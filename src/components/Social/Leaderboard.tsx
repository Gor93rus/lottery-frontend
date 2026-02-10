import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';
import './Leaderboard.css';

export interface LeaderboardEntry {
  rank: number;
  username: string;
  totalWinnings: number;
  level: string;
  avatar?: string;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserRank?: number;
}

function Leaderboard({ entries, currentUserRank }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'week' | 'month' | 'all'>('week');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy size={24} className="rank-icon gold" />;
      case 2:
        return <Medal size={24} className="rank-icon silver" />;
      case 3:
        return <Award size={24} className="rank-icon bronze" />;
      default:
        return <span className="rank-number">#{rank}</span>;
    }
  };

  const getRankClass = (rank: number) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    return '';
  };

  return (
    <motion.div
      className="leaderboard-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="leaderboard-header">
        <h3>🏆 Таблица лидеров</h3>
        <div className="leaderboard-tabs">
          <button
            className={`tab-button ${activeTab === 'week' ? 'active' : ''}`}
            onClick={() => setActiveTab('week')}
          >
            Неделя
          </button>
          <button
            className={`tab-button ${activeTab === 'month' ? 'active' : ''}`}
            onClick={() => setActiveTab('month')}
          >
            Месяц
          </button>
          <button
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Всё время
          </button>
        </div>
      </div>

      <div className="leaderboard-list">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.rank}
            className={`leaderboard-item ${getRankClass(entry.rank)} ${
              entry.rank === currentUserRank ? 'current-user' : ''
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, x: 4 }}
          >
            <div className="rank-container">{getRankIcon(entry.rank)}</div>

            <div className="user-avatar">
              {entry.avatar ? (
                <img src={entry.avatar} alt={entry.username} />
              ) : (
                <div className="avatar-placeholder">
                  {entry.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="user-info">
              <div className="username">{entry.username}</div>
              <div className="user-level">{entry.level}</div>
            </div>

            <div className="winnings">
              <div className="winnings-amount">
                {entry.totalWinnings.toLocaleString()} TON
              </div>
              <div className="winnings-label">Выигрыш</div>
            </div>
          </motion.div>
        ))}
      </div>

      {currentUserRank && currentUserRank > 10 && (
        <div className="current-user-rank">
          <p>Ваша позиция: #{currentUserRank}</p>
        </div>
      )}
    </motion.div>
  );
}

export default Leaderboard;

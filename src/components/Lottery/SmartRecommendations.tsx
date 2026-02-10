import React from 'react';
import { motion } from 'framer-motion';
import './SmartRecommendations.css';

interface Recommendation {
  id: string;
  lotteryName: string;
  type: 'history' | 'popular' | 'time' | 'prize';
  reason: string;
  icon: string;
  prizePool?: number;
  ticketPrice: number;
  drawDate: string;
  participants?: number;
}

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    lotteryName: 'TON Mega Lottery',
    type: 'prize',
    reason: 'Огромный призовой фонд!',
    icon: '💰',
    prizePool: 10000,
    ticketPrice: 5,
    drawDate: '2024-01-20 20:00',
    participants: 5420
  },
  {
    id: '2',
    lotteryName: 'Lucky 6',
    type: 'history',
    reason: 'Вы часто играете в эту лотерею',
    icon: '🎯',
    ticketPrice: 2,
    drawDate: '2024-01-19 18:00',
    participants: 3210
  },
  {
    id: '3',
    lotteryName: 'Daily Jackpot',
    type: 'time',
    reason: 'Розыгрыш уже сегодня!',
    icon: '⏰',
    prizePool: 2500,
    ticketPrice: 3,
    drawDate: 'Сегодня в 21:00',
    participants: 1890
  },
  {
    id: '4',
    lotteryName: 'Weekend Special',
    type: 'popular',
    reason: 'Самая популярная эта неделя',
    icon: '⭐',
    prizePool: 5000,
    ticketPrice: 4,
    drawDate: '2024-01-21 19:00',
    participants: 8340
  },
  {
    id: '5',
    lotteryName: 'Crypto Fortune',
    type: 'prize',
    reason: 'Растущий джекпот',
    icon: '🚀',
    prizePool: 7800,
    ticketPrice: 6,
    drawDate: '2024-01-22 20:00',
    participants: 4560
  },
  {
    id: '6',
    lotteryName: 'Quick Win',
    type: 'time',
    reason: 'Быстрый розыгрыш через 2 часа',
    icon: '⚡',
    prizePool: 1200,
    ticketPrice: 1.5,
    drawDate: 'Через 2 часа',
    participants: 2100
  }
];

const SmartRecommendations: React.FC = () => {
  const getTypeColor = (type: Recommendation['type']) => {
    switch (type) {
      case 'history':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'popular':
        return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'time':
        return 'linear-gradient(135deg, #ffa585 0%, #ffeda0 100%)';
      case 'prize':
        return 'linear-gradient(135deg, #df600c 0%, #f45da6 100%)';
      default:
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  const getTypeLabel = (type: Recommendation['type']) => {
    switch (type) {
      case 'history':
        return 'На основе истории';
      case 'popular':
        return 'Популярное';
      case 'time':
        return 'Срочно';
      case 'prize':
        return 'Большой приз';
      default:
        return '';
    }
  };

  return (
    <div className="smart-recommendations">
      <div className="recommendations-header">
        <h2>✨ Рекомендуем для вас</h2>
        <p className="recommendations-subtitle">
          Персональные рекомендации на основе вашей активности
        </p>
      </div>

      <div className="recommendations-grid">
        {mockRecommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            className="recommendation-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -5 }}
          >
            <div className="card-badge" style={{ background: getTypeColor(rec.type) }}>
              {getTypeLabel(rec.type)}
            </div>

            <div className="card-content">
              <div className="card-icon">{rec.icon}</div>
              
              <h3 className="lottery-name">{rec.lotteryName}</h3>
              
              <div className="reason-badge">
                <span className="sparkle">✨</span>
                <span>{rec.reason}</span>
              </div>

              <div className="card-info">
                {rec.prizePool && (
                  <div className="info-item prize">
                    <span className="info-label">Призовой фонд:</span>
                    <span className="info-value">{rec.prizePool.toLocaleString()} TON</span>
                  </div>
                )}
                
                <div className="info-item">
                  <span className="info-label">Цена билета:</span>
                  <span className="info-value">{rec.ticketPrice} TON</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Розыгрыш:</span>
                  <span className="info-value">{rec.drawDate}</span>
                </div>

                {rec.participants && (
                  <div className="info-item">
                    <span className="info-label">Участников:</span>
                    <span className="info-value">{rec.participants.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <motion.button
                className="quick-buy-btn"
                style={{ background: getTypeColor(rec.type) }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎫 Купить билет
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="recommendations-footer">
        <p>🔄 Рекомендации обновляются каждый час</p>
      </div>
    </div>
  );
};

export default SmartRecommendations;

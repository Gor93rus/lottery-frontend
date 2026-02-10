import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ActivityFeed.css';

export interface ActivityEvent {
  id: string;
  type: 'win' | 'purchase' | 'achievement' | 'streak' | 'referral';
  username: string;
  description: string;
  timestamp: Date;
  icon: string;
}

interface ActivityFeedProps {
  maxEvents?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

// Generate mock activity events
const generateMockEvent = (): ActivityEvent => {
  const types: ActivityEvent['type'][] = ['win', 'purchase', 'achievement', 'streak', 'referral'];
  const type = types[Math.floor(Math.random() * types.length)];

  const usernames = [
    'lucky_user',
    'crypto_fan',
    'player123',
    'streak_master',
    'referral_pro',
    'ton_winner',
    'mega_player',
    'blockchain_king',
    'lottery_lover',
    'coin_hunter',
  ];

  const lotteries = ['Weekend Millions', 'Daily Lottery', 'Mega Jackpot', 'Golden Draw'];

  const username = usernames[Math.floor(Math.random() * usernames.length)];
  const lottery = lotteries[Math.floor(Math.random() * lotteries.length)];
  const amount = Math.floor(Math.random() * 5000) + 100;

  let description = '';
  let icon = '';

  switch (type) {
    case 'win':
      description = `выиграл ${amount.toLocaleString('ru-RU')} TON в ${lottery}`;
      icon = '🏆';
      break;
    case 'purchase': {
      const tickets = Math.floor(Math.random() * 10) + 1;
      description = `купил ${tickets} билет${tickets > 1 ? 'а' : ''} на ${lottery}`;
      icon = '🎫';
      break;
    }
    case 'achievement': {
      const achievements = [
        'Первый выигрыш',
        'Коллекционер',
        'Удачливый игрок',
        'Миллионер',
        'Везунчик',
      ];
      const achievement = achievements[Math.floor(Math.random() * achievements.length)];
      description = `получил достижение '${achievement}'`;
      icon = '🎖️';
      break;
    }
    case 'streak': {
      const days = Math.floor(Math.random() * 50) + 7;
      description = `достиг ${days} дней streak!`;
      icon = '🔥';
      break;
    }
    case 'referral': {
      const refs = Math.floor(Math.random() * 20) + 5;
      description = `пригласил ${refs} друзей`;
      icon = '👥';
      break;
    }
  }

  return {
    id: `event-${Date.now()}-${Math.random()}`,
    type,
    username,
    description,
    timestamp: new Date(),
    icon,
  };
};

// Format time ago
const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds} секунд назад`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} минут назад`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} часов назад`;
  return `${Math.floor(seconds / 86400)} дней назад`;
};

function ActivityFeed({
  maxEvents = 20,
  autoRefresh = true,
  refreshInterval = 8000,
}: ActivityFeedProps) {
  const [events, setEvents] = useState<ActivityEvent[]>(() => {
    // Initialize with some mock events
    return Array.from({ length: 5 }, () => {
      const event = generateMockEvent();
      const secondsAgo = Math.floor(Math.random() * 300);
      event.timestamp = new Date(Date.now() - secondsAgo * 1000);
      return event;
    });
  });

  const [filter, setFilter] = useState<'all' | 'wins' | 'achievements'>('all');

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      const newEvent = generateMockEvent();
      setEvents((prev) => {
        const updated = [newEvent, ...prev].slice(0, maxEvents);
        return updated;
      });
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, maxEvents]);

  const filteredEvents = events.filter((event) => {
    if (filter === 'all') return true;
    if (filter === 'wins') return event.type === 'win';
    if (filter === 'achievements') return event.type === 'achievement';
    return true;
  });

  const getEventColor = (type: ActivityEvent['type']): string => {
    switch (type) {
      case 'win':
        return '#00ff88';
      case 'purchase':
        return '#4a9eff';
      case 'achievement':
        return '#ff8000';
      case 'streak':
        return '#ff4444';
      case 'referral':
        return '#f45da6';
      default:
        return '#ffffff';
    }
  };

  return (
    <motion.div
      className="activity-feed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="feed-header">
        <h3 className="feed-title">📰 Лента активности</h3>
        <p className="feed-subtitle">Что происходит прямо сейчас</p>
      </div>

      {/* Filters */}
      <div className="feed-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Все события
        </button>
        <button
          className={`filter-btn ${filter === 'wins' ? 'active' : ''}`}
          onClick={() => setFilter('wins')}
        >
          🏆 Выигрыши
        </button>
        <button
          className={`filter-btn ${filter === 'achievements' ? 'active' : ''}`}
          onClick={() => setFilter('achievements')}
        >
          🎖️ Достижения
        </button>
      </div>

      {/* Events List */}
      <div className="events-list">
        <AnimatePresence mode="popLayout">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              className="event-card"
              layout
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div
                className="event-icon-wrapper"
                style={{ background: `${getEventColor(event.type)}20` }}
              >
                <div className="event-icon" style={{ color: getEventColor(event.type) }}>
                  {event.icon}
                </div>
              </div>

              <div className="event-content">
                <div className="event-text">
                  <span className="event-username">@{event.username}</span>{' '}
                  <span className="event-description">{event.description}</span>
                </div>
                <div className="event-time">{formatTimeAgo(event.timestamp)}</div>
              </div>

              <div className="event-avatar">
                <span className="avatar-initial">{event.username.charAt(0).toUpperCase()}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show More Button */}
      {filteredEvents.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-text">Нет событий для отображения</div>
        </div>
      )}

      {filteredEvents.length >= maxEvents && (
        <div className="load-more">
          <button className="load-more-btn">Показать больше</button>
        </div>
      )}
    </motion.div>
  );
}

export default ActivityFeed;

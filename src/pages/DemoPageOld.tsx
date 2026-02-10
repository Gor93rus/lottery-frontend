import { useState } from 'react';
import { motion } from 'framer-motion';
import PlayerLevel from '../components/Gamification/PlayerLevel';
import StreakCounter from '../components/Gamification/StreakCounter';
import DailyQuests from '../components/Gamification/DailyQuests';
import AchievementBadges from '../components/Gamification/AchievementBadges';
import CountdownTimer from '../components/Statistics/CountdownTimer';
import LivePrizeCounter from '../components/Statistics/LivePrizeCounter';
import Leaderboard, { type LeaderboardEntry } from '../components/Social/Leaderboard';
import ParticleBackground from '../components/Animations/ParticleBackground';
import SkeletonLoader from '../components/Animations/SkeletonLoader';
import './DemoPage.css';

function DemoPage() {
  const [showSkeletons, setShowSkeletons] = useState(false);

  // Mock data
  const playerLevelData = {
    level: 15,
    xp: 7500,
    xpToNextLevel: 10000,
    progress: 75,
  };

  const longestStreak = 12;
  const currentStreak = 5;

  const quests: never[] = [];
  const achievements: never[] = [];

  const leaderboardEntries: LeaderboardEntry[] = [
    { rank: 1, username: 'CryptoKing', totalWinnings: 15000, level: 'Platinum' },
    { rank: 2, username: 'LuckyPlayer', totalWinnings: 12500, level: 'Diamond' },
    { rank: 3, username: 'TONMaster', totalWinnings: 10000, level: 'Gold' },
    { rank: 4, username: 'WinnerPro', totalWinnings: 8500, level: 'Gold' },
    { rank: 5, username: 'BlockchainFan', totalWinnings: 7200, level: 'Silver' },
    { rank: 6, username: 'User123', totalWinnings: 6100, level: 'Silver' },
    { rank: 7, username: 'LotteryLover', totalWinnings: 5500, level: 'Bronze' },
    { rank: 8, username: 'CryptoWhale', totalWinnings: 4800, level: 'Bronze' },
    { rank: 9, username: 'YouCurrentUser', totalWinnings: 4200, level: 'Bronze' },
    { rank: 10, username: 'NewPlayer', totalWinnings: 3500, level: 'Bronze' },
  ];

  const targetDate = new Date();
  targetDate.setHours(targetDate.getHours() + 24);

  return (
    <div className="demo-page">
      <ParticleBackground particleCount={20} enabled={true} />

      <div className="demo-content">
        <motion.div
          className="demo-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>🎮 Демо новых компонентов</h1>
          <p className="demo-subtitle">
            Посмотрите все новые функции лотерейного приложения
          </p>
          <button
            className="skeleton-toggle"
            onClick={() => setShowSkeletons(!showSkeletons)}
          >
            {showSkeletons ? 'Показать компоненты' : 'Показать скелетоны'}
          </button>
        </motion.div>

        {showSkeletons ? (
          <div className="skeletons-demo">
            <h2>Skeleton Loaders</h2>
            <SkeletonLoader type="lottery-card" count={3} />
            <SkeletonLoader type="list-item" count={5} />
            <SkeletonLoader type="leaderboard" count={3} />
          </div>
        ) : (
          <>
            <section className="demo-section">
              <h2>📊 Живая статистика</h2>
              <div className="components-grid">
                <LivePrizeCounter value={1234567} currency="TON" updateInterval={3000} />
                <CountdownTimer targetDate={targetDate} />
              </div>
            </section>

            <section className="demo-section">
              <h2>🎯 Геймификация</h2>
              <PlayerLevel {...playerLevelData} />
              <StreakCounter currentStreak={currentStreak} longestStreak={longestStreak} />
              <DailyQuests quests={quests} />
              <AchievementBadges achievements={achievements} />
            </section>

            <section className="demo-section">
              <h2>👥 Социальные функции</h2>
              <Leaderboard entries={leaderboardEntries} currentUserRank={9} />
            </section>

            <section className="demo-section">
              <h2>ℹ️ Информация</h2>
              <div className="info-card">
                <h3>✅ Реализованные компоненты (Phase 1-2)</h3>
                <ul>
                  <li>✓ PlayerLevel - Система уровней игрока</li>
                  <li>✓ StreakCounter - Счетчик дней подряд</li>
                  <li>✓ DailyQuests - Ежедневные задания</li>
                  <li>✓ AchievementBadges - Коллекция достижений</li>
                  <li>✓ CountdownTimer - Таймер обратного отсчета</li>
                  <li>✓ LivePrizeCounter - Анимированный счетчик призов</li>
                  <li>✓ ParticleBackground - Фоновые частицы</li>
                  <li>✓ SkeletonLoader - Skeleton loaders</li>
                  <li>✓ Leaderboard - Таблица лидеров</li>
                  <li>✓ SoundManager - Система звуков (в контексте)</li>
                  <li>✓ i18n - Мультиязычность (RU/EN)</li>
                </ul>
                <p className="info-note">
                  📝 Все компоненты добавлены БЕЗ изменения существующего кода!
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default DemoPage;

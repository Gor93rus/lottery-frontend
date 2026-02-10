import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Phase 1-2 Components
import PlayerLevel from '../components/Gamification/PlayerLevel';
import StreakCounter from '../components/Gamification/StreakCounter';
import DailyQuests from '../components/Gamification/DailyQuests';
import AchievementBadges from '../components/Gamification/AchievementBadges';
import CountdownTimer from '../components/Statistics/CountdownTimer';
import LivePrizeCounter from '../components/Statistics/LivePrizeCounter';
import Leaderboard, { type LeaderboardEntry } from '../components/Social/Leaderboard';
import ParticleBackground from '../components/Animations/ParticleBackground';
import SkeletonLoader from '../components/Animations/SkeletonLoader';

// Phase 3 Components
import WinningsChart from '../components/Statistics/WinningsChart';
import ReferralQR from '../components/Referral/ReferralQR';
import ReferralTree from '../components/Referral/ReferralTree';
import ReferralProgress from '../components/Referral/ReferralProgress';
import ActivityFeed from '../components/Social/ActivityFeed';
import ShareWin from '../components/Social/ShareWin';
import MyTicketsCarousel from '../components/Lottery/MyTicketsCarousel';
import QuickPick from '../components/Lottery/QuickPick';
import SmartRecommendations from '../components/Lottery/SmartRecommendations';
import { FloatingCoins, HolographicCard, GlitchText, CyberpunkBanner } from '../components/Animations';

// Phase 4 Components
import { AIChatbot } from '../components/Advanced/AIChatbot';
import { PullToRefresh } from '../components/Advanced/PullToRefresh';
import { InstallPrompt } from '../components/Advanced/InstallPrompt';
import { TONBalance } from '../components/Web3/TONBalance';
import { TransactionHistory } from '../components/Web3/TransactionHistory';

import './DemoPage.css';

function DemoPage() {
  const [showSkeletons, setShowSkeletons] = useState(false);
  const [activePhase, setActivePhase] = useState<'1-2' | '3' | '4'>('1-2');

  // Mock data for Phase 1-2
  const playerLevelData = {
    level: 15,
    xp: 7500,
    xpToNextLevel: 10000,
    progress: 75,
  };

  const currentStreak = 5;
  const longestStreak = 12;

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

  const handleRefresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Refreshed!');
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="demo-page">
        <ParticleBackground particleCount={20} enabled={true} />
        <FloatingCoins coinCount={8} enabled={true} />

        <div className="demo-content">
          <motion.div
            className="demo-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1>🎮 Демо всех компонентов</h1>
            <GlitchText text="Weekend Millions" trigger="auto" intensity="soft" />
            <p className="demo-subtitle">
              Полный набор компонентов для лотерейного приложения
            </p>

            {/* Navigation */}
            <div className="demo-nav">
              <Link to="/" className="nav-link">← На главную</Link>
              <Link to="/lottery-demo" className="nav-link">Лотереи →</Link>
              <Link to="/animations-demo" className="nav-link">Анимации →</Link>
            </div>

            {/* Phase Selector */}
            <div className="phase-selector">
              <button
                className={`phase-btn ${activePhase === '1-2' ? 'active' : ''}`}
                onClick={() => setActivePhase('1-2')}
              >
                Phase 1-2
              </button>
              <button
                className={`phase-btn ${activePhase === '3' ? 'active' : ''}`}
                onClick={() => setActivePhase('3')}
              >
                Phase 3
              </button>
              <button
                className={`phase-btn ${activePhase === '4' ? 'active' : ''}`}
                onClick={() => setActivePhase('4')}
              >
                Phase 4
              </button>
            </div>

            <button
              className="skeleton-toggle"
              onClick={() => setShowSkeletons(!showSkeletons)}
            >
              {showSkeletons ? 'Показать компоненты' : 'Показать скелетоны'}
            </button>
          </motion.div>

          {/* Phase 1-2 Components */}
          {activePhase === '1-2' && !showSkeletons && (
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
            </>
          )}

          {/* Phase 3 Components */}
          {activePhase === '3' && !showSkeletons && (
            <>
              <CyberpunkBanner
                title="🎰 PHASE 3: NICE TO HAVE"
                description="Продвинутые функции и эффекты"
                ctaText="Explore"
                onCtaClick={() => console.log('Clicked!')}
              />

              <section className="demo-section">
                <h2>📈 Статистика и графики</h2>
                <WinningsChart />
              </section>

              <section className="demo-section">
                <h2>👥 Реферальная программа</h2>
                <ReferralQR />
                <ReferralProgress />
                <ReferralTree />
              </section>

              <section className="demo-section">
                <h2>📰 Социальные функции</h2>
                <ActivityFeed />
                <ShareWin amount={1500} lotteryName="Weekend Millions" />
              </section>

              <section className="demo-section">
                <h2>🎫 Лотерейные функции</h2>
                <SmartRecommendations />
                <QuickPick />
                <MyTicketsCarousel />
              </section>

              <section className="demo-section">
                <h2>✨ Продвинутые эффекты</h2>
                <HolographicCard intensity="strong">
                  <div style={{ padding: '40px', textAlign: 'center' }}>
                    <h3 style={{ margin: 0, color: 'white' }}>VIP Lottery</h3>
                    <p style={{ margin: '10px 0', color: 'rgba(255,255,255,0.8)' }}>
                      Эксклюзивный доступ для Premium игроков
                    </p>
                  </div>
                </HolographicCard>
              </section>
            </>
          )}

          {/* Phase 4 Components */}
          {activePhase === '4' && !showSkeletons && (
            <>
              <section className="demo-section">
                <h2>🌐 Web3 Integration</h2>
                <TONBalance />
                <TransactionHistory />
              </section>

              <section className="demo-section">
                <h2>📱 PWA Components</h2>
                <InstallPrompt />
                <div className="info-card">
                  <h3>ℹ️ PWA Features</h3>
                  <ul>
                    <li>✅ Service Worker with offline support</li>
                    <li>✅ App manifest with icons</li>
                    <li>✅ Install prompt component</li>
                    <li>✅ Push notifications ready</li>
                    <li>✅ Pull-to-refresh (try it!)</li>
                  </ul>
                </div>
              </section>

              <section className="demo-section">
                <h2>ℹ️ Complete Feature List</h2>
                <div className="info-card">
                  <h3>✅ Phase 1-2 (Base Components)</h3>
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
                    <li>✓ SoundManager - Система звуков</li>
                  </ul>

                  <h3>✅ Phase 3 (Nice to Have)</h3>
                  <ul>
                    <li>✓ WinningsChart - График выигрышей (3 типа)</li>
                    <li>✓ ReferralQR - QR код для рефералов</li>
                    <li>✓ ReferralTree - Дерево рефералов</li>
                    <li>✓ ReferralProgress - Прогресс бонусов</li>
                    <li>✓ ActivityFeed - Лента активности</li>
                    <li>✓ ShareWin - Шаринг выигрыша</li>
                    <li>✓ MyTicketsCarousel - 3D карусель билетов</li>
                    <li>✓ QuickPick - Генератор случайных чисел</li>
                    <li>✓ SmartRecommendations - Умные рекомендации</li>
                    <li>✓ FloatingCoins - 3D летающие монеты</li>
                    <li>✓ HolographicCard - Голографический эффект</li>
                    <li>✓ GlitchText - Глитч эффекты</li>
                    <li>✓ CyberpunkBanner - Киберпанк баннер</li>
                  </ul>

                  <h3>✅ Phase 4 (Advanced)</h3>
                  <ul>
                    <li>✓ AIChatbot - FAQ чат-бот</li>
                    <li>✓ InteractiveTicket - Интерактивный билет</li>
                    <li>✓ PWA Support - Полная поддержка PWA</li>
                    <li>✓ TONBalance - Показ баланса</li>
                    <li>✓ TransactionHistory - История транзакций</li>
                    <li>✓ PullToRefresh - Pull-to-refresh</li>
                    <li>✓ useHaptic - Тактильная обратная связь</li>
                    <li>✓ usePWA - PWA хуки</li>
                  </ul>

                  <p className="info-note">
                    📝 Все 25+ компонентов реализованы без изменения существующего кода Phase 1-2!
                  </p>
                </div>
              </section>
            </>
          )}

          {/* Skeletons */}
          {showSkeletons && (
            <div className="skeletons-demo">
              <h2>Skeleton Loaders</h2>
              <SkeletonLoader type="lottery-card" count={3} />
              <SkeletonLoader type="list-item" count={5} />
              <SkeletonLoader type="leaderboard" count={3} />
            </div>
          )}
        </div>

        {/* AI Chatbot - Always visible */}
        <AIChatbot />
      </div>
    </PullToRefresh>
  );
}

export default DemoPage;

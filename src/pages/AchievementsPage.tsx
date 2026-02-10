import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Ticket, Target, Users, TrendingUp, Filter, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAchievements } from '../hooks/useAchievements';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import AnimatedBackground from '../components/AnimatedBackground/AnimatedBackground';
import confetti from 'canvas-confetti';
import type { AchievementCategory } from '../types/gamification';
import './AchievementsPage.css';

const categoryIcons: Record<AchievementCategory, { icon: typeof Trophy; label: string }> = {
  tickets: { icon: Ticket, label: 'Билеты' },
  wins: { icon: Trophy, label: 'Победы' },
  streak: { icon: Target, label: 'Серии' },
  referrals: { icon: Users, label: 'Рефералы' },
  level: { icon: TrendingUp, label: 'Уровень' }
};

const tierColors: Record<string, string> = {
  bronze: '#CD7F32',
  gold: '#FFD700',
  diamond: '#B9F2FF'
};

function AchievementsPage() {
  const { user } = useAuth();
  const userId = user?.id?.toString();
  const { progress, isLoading, claimAchievement, isClaiming, error } = useAchievements(userId);
  
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<typeof progress[number] | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  // Filter achievements by category
  const filteredAchievements = selectedCategory === 'all' 
    ? progress 
    : progress.filter((p: typeof progress[number]) => p.achievement.category === selectedCategory);

  // Calculate stats
  const unlockedCount = progress.filter((p: typeof progress[number]) => p.unlocked).length;
  const totalCount = progress.length;
  const progressPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  const handleAchievementClick = (achievementProgress: typeof progress[number]) => {
    setSelectedAchievement(achievementProgress);
    
    if (achievementProgress.unlocked) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleClaimReward = (achievementId: string) => {
    claimAchievement(achievementId);
    setSelectedAchievement(null);
    
    // Celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return '🥉';
      case 'gold': return '🥇';
      case 'diamond': return '💎';
      default: return '🏆';
    }
  };

  return (
    <div className="achievements-page">
      <AnimatedBackground />
      <Header />
      
      <div className="achievements-container">
        {/* Header Section */}
        <motion.div
          className="achievements-header-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="header-title">
            <Trophy className="header-icon" size={32} />
            <h1>Достижения</h1>
          </div>
          
          <div className="achievements-stats">
            <div className="stat-card">
              <div className="stat-value">{unlockedCount}/{totalCount}</div>
              <div className="stat-label">Открыто</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{progressPercentage.toFixed(0)}%</div>
              <div className="stat-label">Прогресс</div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="overall-progress">
            <motion.div
              className="overall-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Filter Section */}
        <div className="filter-section">
          <button
            className="filter-toggle"
            onClick={() => setShowFilter(!showFilter)}
          >
            <Filter size={20} />
            Категории
          </button>

          <AnimatePresence>
            {showFilter && (
              <motion.div
                className="filter-options"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <button
                  className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('all')}
                >
                  <Star size={18} />
                  Все
                </button>
                {Object.entries(categoryIcons).map(([category, { icon: Icon, label }]) => (
                  <button
                    key={category}
                    className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category as AchievementCategory)}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Achievements Grid */}
        {isLoading ? (
          <div className="achievements-loading">
            <div className="spinner" />
            <p>Загрузка достижений...</p>
          </div>
        ) : error ? (
          <div className="achievements-error">
            <p>Ошибка загрузки достижений</p>
            <p className="error-message">{String(error)}</p>
          </div>
        ) : filteredAchievements.length === 0 ? (
          <div className="achievements-empty">
            <Trophy size={48} opacity={0.3} />
            <p>Нет достижений в этой категории</p>
          </div>
        ) : (
          <motion.div
            className="achievements-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredAchievements.map((achievementProgress: typeof progress[number], index: number) => {
              const achievement = achievementProgress.achievement;
              const canClaim = achievementProgress.unlocked && 
                             achievementProgress.userAchievement && 
                             !achievementProgress.userAchievement.claimed;

              return (
                <motion.div
                  key={achievement.id}
                  className={`achievement-card ${achievementProgress.unlocked ? 'unlocked' : 'locked'} ${canClaim ? 'claimable' : ''}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  onClick={() => handleAchievementClick(achievementProgress)}
                  style={{
                    borderColor: achievementProgress.unlocked 
                      ? tierColors[achievement.tier] 
                      : 'rgba(255,255,255,0.1)'
                  }}
                >
                  <div className="achievement-tier-badge" style={{ 
                    background: achievementProgress.unlocked ? tierColors[achievement.tier] : '#666'
                  }}>
                    {getTierIcon(achievement.tier)}
                  </div>

                  {canClaim && (
                    <div className="claim-badge">
                      Забрать награду!
                    </div>
                  )}

                  <div className="achievement-icon-large">
                    {achievement.icon || getTierIcon(achievement.tier)}
                  </div>

                  <h3 className="achievement-title">{achievement.title}</h3>
                  <p className="achievement-description">{achievement.description}</p>

                  {!achievementProgress.unlocked && (
                    <div className="achievement-progress-section">
                      <div className="progress-bar">
                        <motion.div
                          className="progress-fill"
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${(achievementProgress.currentValue / achievement.requirement) * 100}%` 
                          }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                        />
                      </div>
                      <div className="progress-text">
                        {achievementProgress.currentValue}/{achievement.requirement}
                      </div>
                    </div>
                  )}

                  <div className="achievement-rewards">
                    {achievement.rewardXp > 0 && (
                      <span className="reward-badge">+{achievement.rewardXp} XP</span>
                    )}
                    {achievement.rewardTickets > 0 && (
                      <span className="reward-badge">+{achievement.rewardTickets} билетов</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Achievement Detail Modal */}
        <AnimatePresence>
          {selectedAchievement && (
            <motion.div
              className="achievement-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAchievement(null)}
            >
              <motion.div
                className="achievement-modal"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="modal-close"
                  onClick={() => setSelectedAchievement(null)}
                >
                  <X size={24} />
                </button>

                <div 
                  className="modal-tier-badge-large" 
                  style={{ 
                    background: selectedAchievement.unlocked 
                      ? tierColors[selectedAchievement.achievement.tier] 
                      : '#666'
                  }}
                >
                  {getTierIcon(selectedAchievement.achievement.tier)}
                </div>

                <div className="modal-icon-large">
                  {selectedAchievement.achievement.icon || getTierIcon(selectedAchievement.achievement.tier)}
                </div>

                <h2 className="modal-title">{selectedAchievement.achievement.title}</h2>
                <p className="modal-description">{selectedAchievement.achievement.description}</p>

                <div className="modal-rewards">
                  <h4>Награда:</h4>
                  <div className="reward-list">
                    {selectedAchievement.achievement.rewardXp > 0 && (
                      <span className="reward-item">⭐ +{selectedAchievement.achievement.rewardXp} XP</span>
                    )}
                    {selectedAchievement.achievement.rewardTickets > 0 && (
                      <span className="reward-item">🎫 +{selectedAchievement.achievement.rewardTickets} билетов</span>
                    )}
                  </div>
                </div>

                {selectedAchievement.unlocked ? (
                  <div className="modal-unlocked">
                    <div className="unlocked-badge">✓ Получено!</div>
                    {selectedAchievement.userAchievement && (
                      <p className="unlock-date">
                        {new Date(selectedAchievement.userAchievement.unlockedAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                    {selectedAchievement.userAchievement && !selectedAchievement.userAchievement.claimed && (
                      <motion.button
                        className="claim-reward-button"
                        onClick={() => handleClaimReward(selectedAchievement.achievement.id)}
                        disabled={isClaiming}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isClaiming ? 'Получение...' : 'Забрать награду'}
                      </motion.button>
                    )}
                  </div>
                ) : (
                  <div className="modal-locked">
                    <div className="locked-badge">🔒 Заблокировано</div>
                    <div className="modal-progress">
                      <div className="modal-progress-bar">
                        <motion.div
                          className="modal-progress-fill"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${
                              (selectedAchievement.currentValue /
                                selectedAchievement.achievement.requirement) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <p className="modal-progress-text">
                        {selectedAchievement.currentValue}/{selectedAchievement.achievement.requirement} до получения
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}

export default AchievementsPage;

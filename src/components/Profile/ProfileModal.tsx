import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileHeader from './ProfileHeader';
import BalanceCards from './BalanceCards';
import CollapsibleSection from './CollapsibleSection';
import StatsSection from './StatsSection';
import DailyTasksSection from './DailyTasksSection';
import AchievementsSection from './AchievementsSection';
import NotificationSettings from './NotificationSettings';
import ProfileLinks from './ProfileLinks';
import { getGamificationData, getUserStats } from '../../lib/api/gamification';
import { getNotificationSettings } from '../../lib/api/userSettings';
import './ProfileModal.css';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    telegramId: string;
    username?: string;
    firstName?: string;
    photoUrl?: string;
  };
}

interface GamificationData {
  level: {
    level: number;
    name: string;
    currentXp: number;
    xpForNextLevel: number;
    totalXp: number;
  } | null;
  dailyTasks: Array<{
    id: string;
    type: string;
    description: string;
    xpReward: number;
    tonReward?: number;
    progress: number;
    target: number;
    completed: boolean;
    claimed: boolean;
  }>;
  achievements: Array<{
    id: string;
    type: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt?: string;
  }>;
}

interface Stats {
  ticketsBought: number;
  totalWins: number;
  totalWonAmount: number;
  currentStreak: number;
  referralsCount: number;
}

interface NotificationSettingsData {
  drawReminder: boolean;
  drawResults: boolean;
  referrals: boolean;
}

export default function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  const [gamificationData, setGamificationData] = useState<GamificationData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  async function loadData() {
    setLoading(true);
    try {
      const [gamification, userStats, notifications] = await Promise.all([
        getGamificationData(),
        getUserStats(),
        getNotificationSettings()
      ]);
      setGamificationData(gamification as GamificationData);
      setStats(userStats);
      setNotificationSettings(notifications.settings);
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="profile-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="profile-modal"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <button className="profile-modal-close" onClick={onClose}>
              ✕
            </button>

            <div className="profile-modal-content">
              <ProfileHeader 
                user={user} 
                level={gamificationData?.level || undefined}
                loading={loading}
              />

              <BalanceCards />

              <div className="profile-sections">
                <CollapsibleSection 
                  icon="📊" 
                  title="Статистика"
                  defaultOpen={false}
                >
                  <StatsSection stats={stats || undefined} loading={loading} />
                </CollapsibleSection>

                <CollapsibleSection 
                  icon="📅" 
                  title="Ежедневные задания"
                  badge={gamificationData?.dailyTasks ? 
                    `${gamificationData.dailyTasks.filter(t => t.completed).length}/${gamificationData.dailyTasks.length}` : 
                    null
                  }
                  defaultOpen={false}
                >
                  <DailyTasksSection 
                    tasks={gamificationData?.dailyTasks} 
                    loading={loading}
                    onClaim={loadData}
                  />
                </CollapsibleSection>

                <CollapsibleSection 
                  icon="🏆" 
                  title="Достижения"
                  badge={gamificationData?.achievements ?
                    `${gamificationData.achievements.filter(a => a.unlockedAt).length}/${gamificationData.achievements.length}` :
                    null
                  }
                  defaultOpen={false}
                >
                  <AchievementsSection 
                    achievements={gamificationData?.achievements} 
                    loading={loading}
                  />
                </CollapsibleSection>

                <CollapsibleSection 
                  icon="🔔" 
                  title="Уведомления"
                  defaultOpen={false}
                >
                  <NotificationSettings 
                    settings={notificationSettings || undefined}
                    onChange={setNotificationSettings}
                    loading={loading}
                  />
                </CollapsibleSection>
              </div>

              <ProfileLinks />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

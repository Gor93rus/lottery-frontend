import type { AxiosInstance } from 'axios';
import axios from 'axios';
import type {
  Achievement,
  AchievementProgress,
  CheckInResult,
  GamificationProfile,
  LeaderboardPeriod,
  LeaderboardResponse,
  LeaderboardType,
  ReferralStats,
  ReferralUser,
  StreakInfo,
  UserReward,
  UserQuest,
} from '../types/gamification';
import { TokenManager } from '../lib/auth/token';

const apiClient: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/gamification`,
  headers: { 'Content-Type': 'application/json' },
});

// Helper function to get user identification
function getUserIdForApi(): string | null {
  // Priority 1: stored user_id (CUID from database after login)
  const storedUserId = TokenManager.getUserId();
  if (storedUserId) {
    return storedUserId;
  }
  
  // Priority 2: stored telegram_id 
  const telegramId = TokenManager.getTelegramId();
  if (telegramId) {
    return telegramId;
  }
  
  // Priority 3: directly from Telegram WebApp
  try {
    const win = window as typeof window & {
      Telegram?: {
        WebApp?: {
          initDataUnsafe?: {
            user?: {
              id: number;
            };
          };
        };
      };
    };
    return win.Telegram?.WebApp?.initDataUnsafe?.user?.id ? String(win.Telegram.WebApp.initDataUnsafe.user.id) : null;
  } catch (e) {
    console.error("Error getting Telegram user ID:", e);
    return null;
  }
}

apiClient.interceptors.request.use(
  (config) => {
    // Try JWT token first
    const token = TokenManager.getToken();
    if (token && !TokenManager.isTokenExpired(token)) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Also add x-user-id header for backend compatibility
    const userId = getUserIdForApi();
    if (userId) {
      config.headers['x-user-id'] = userId;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export const gamificationApi = {
  // Profile
  getProfile: (): Promise<{ profile: GamificationProfile }> => apiClient.get('/profile').then(res => res.data),

  // Streaks
  getStreak: (): Promise<{ streak: StreakInfo }> => apiClient.get('/streak').then(res => res.data),
  checkIn: (): Promise<CheckInResult> => apiClient.post('/check-in').then(res => res.data),

  // Achievements
  getMyAchievements: (): Promise<{ achievements: Achievement[] }> => apiClient.get('/achievements').then(res => res.data),
  getAchievementProgress: (achievementId: string): Promise<{ progress: AchievementProgress[] }> => 
    apiClient.get(`/achievements/${achievementId}/progress`).then(res => res.data),
  claimAchievement: (achievementId: string): Promise<{ reward: UserReward }> => 
    apiClient.post(`/achievements/${achievementId}/claim`).then(res => res.data),

  // Quests
  getMyQuests: (): Promise<{ quests: UserQuest[] }> => apiClient.get('/quests').then(res => res.data),
  claimQuest: (questId: string): Promise<{ reward: UserReward }> => 
    apiClient.post(`/quests/${questId}/claim`).then(res => res.data),

  // Leaderboard & Referrals
  getLeaderboard: (type: LeaderboardType, period: LeaderboardPeriod): Promise<LeaderboardResponse> =>
    apiClient.get(`/leaderboard?type=${type}&period=${period}`).then(res => res.data),
  getReferralStats: (): Promise<{ stats: ReferralStats }> => apiClient.get('/referrals/stats').then(res => res.data),
  getReferrals: (): Promise<{ referrals: ReferralUser[] }> => apiClient.get('/referrals').then(res => res.data),
  applyReferralCode: (code: string): Promise<{ success: boolean; message: string }> => 
    apiClient.post('/referrals/apply', { code }).then(res => res.data),
};

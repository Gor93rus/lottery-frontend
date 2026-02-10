/**
 * Hook for fetching user statistics
 */
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api/client';

export interface UserStats {
  userId: string;
  totalTicketsBought: number;
  totalSpent: {
    ton: number;
    usdt: number;
  };
  totalWins: number;
  totalWinnings: {
    ton: number;
    usdt: number;
  };
  currentBalance: {
    ton: number;
    usdt: number;
  };
  winRate: number;
  favoriteNumbers: number[];
  memberSince: string;
  lastActivity: string;
  currentStreak: number;
  bestStreak: number;
}

interface UserStatsResponse {
  success: boolean;
  stats: UserStats;
}

// Default stats object used as fallback when data is unavailable
const DEFAULT_STATS: UserStats = {
  userId: '',
  totalTicketsBought: 0,
  totalSpent: { ton: 0, usdt: 0 },
  totalWins: 0,
  totalWinnings: { ton: 0, usdt: 0 },
  currentBalance: { ton: 0, usdt: 0 },
  currentStreak: 0,
  bestStreak: 0,
  winRate: 0,
  favoriteNumbers: [],
  memberSince: '',
  lastActivity: '',
};

export function useUserStats() {
  const query = useQuery<UserStatsResponse>({
    queryKey: ['user', 'stats'],
    queryFn: async () => {
      const response = await apiClient.getUserStats();
      return response;
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
  });

  // Return safe defaults on error
  if (query.error) {
    return {
      data: null,
      stats: DEFAULT_STATS,
      isLoading: false,
      error: query.error,
    };
  }

  return {
    ...query,
    stats: query.data?.stats ?? DEFAULT_STATS,
  };
}

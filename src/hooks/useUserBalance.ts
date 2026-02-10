/**
 * Hook for user balance management
 */
import { useMemo } from 'react';
import { useUserStats } from './useUserStats';

export interface UserBalance {
  ton: number;
  usdt: number;
  totalValueUSD: number;
}

export function useUserBalance(): UserBalance {
  const { data: statsData } = useUserStats();
  
  return useMemo(() => {
    const stats = statsData?.stats;
    
    return {
      ton: stats?.currentBalance?.ton || 0,
      usdt: stats?.currentBalance?.usdt || 0,
      totalValueUSD: 0, // TODO: Calculate based on current exchange rates
    };
  }, [statsData]);
}

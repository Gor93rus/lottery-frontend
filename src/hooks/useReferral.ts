import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamificationApi } from '../services/gamificationApi';
import { useState } from 'react';

/**
 * Hook for referral system with stats, referrals list, and Telegram share link
 */
export function useReferral(userId?: string) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Get referral stats
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['gamification', 'referral', 'stats', userId],
    queryFn: async () => {
      const response = await gamificationApi.getReferralStats();
      return response;
    },
    enabled: !!userId
  });

  // Get referrals list
  const { data: referralsData, isLoading: isLoadingList } = useQuery({
    queryKey: ['gamification', 'referral', 'list', userId],
    queryFn: async () => {
      const response = await gamificationApi.getReferrals();
      return response;
    },
    enabled: !!userId
  });

  const stats = statsData?.stats || null;
  const referrals = referralsData?.referrals || [];

  // Apply referral code mutation
  const applyCodeMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await gamificationApi.applyReferralCode(code);
      return response;
    },
    onSuccess: () => {
      // Invalidate referral queries
      queryClient.invalidateQueries({ queryKey: ['gamification', 'referral'] });
      queryClient.invalidateQueries({ queryKey: ['gamification', 'profile'] });
      setError(null);
    },
    onError: (err: unknown) => {
      const errorMessage = err instanceof Error ? err.message : 'Failed to apply referral code';
      setError(errorMessage);
    }
  });

  // Get referral code
  const code = stats?.code || null;

  // Generate Telegram bot share link
  const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'LotteryTONBot';
  const shareLink = code 
    ? `https://t.me/${botUsername.replace('@', '')}?start=${code}`
    : null;

  return {
    // Data
    stats,
    referrals,
    code,
    shareLink,
    error,

    // Loading states
    isLoading: isLoadingStats || isLoadingList,

    // Actions
    applyCode: applyCodeMutation.mutate,
    isApplying: applyCodeMutation.isPending,
  };
}

export default useReferral;

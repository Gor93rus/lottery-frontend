import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamificationClient } from '../lib/api/gamificationClient';
import type { Reward } from '../lib/api/gamificationClient';
import { useState } from 'react';

/**
 * Hook for reward system functionality
 */
export function useRewards(userId?: string) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Get available rewards
  const { data: availableRewards, isLoading: isLoadingAvailable } = useQuery({
    queryKey: ['rewards', 'available', userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await gamificationClient.getAvailableRewards(userId) as { rewards?: Reward[] };
      return (response?.rewards || []) as Reward[];
    },
    enabled: !!userId
  });

  // Get claimed rewards
  const { data: claimedRewards, isLoading: isLoadingClaimed } = useQuery({
    queryKey: ['rewards', 'claimed', userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await gamificationClient.getClaimedRewards(userId) as { rewards?: Reward[] };
      return (response?.rewards || []) as Reward[];
    },
    enabled: !!userId
  });

  // Claim reward mutation
  const claimRewardMutation = useMutation({
    mutationFn: async (rewardId: string) => {
      if (!userId) throw new Error('User ID is required');
      return await gamificationClient.claimReward(userId, rewardId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      queryClient.invalidateQueries({ queryKey: ['gamification', 'profile'] });
      setError(null);
    },
    onError: (err: unknown) => {
      let errorMessage = 'Failed to claim reward';
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { data?: { error?: string } } }).response;
        errorMessage = response?.data?.error || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }
  });

  // Computed values
  const totalAvailableValue = availableRewards?.reduce((sum, r) => sum + Number(r.value), 0) || 0;
  const expiringSoon = availableRewards?.filter(r => {
    if (!r.expiresAt) return false;
    const expiryDate = new Date(r.expiresAt);
    const now = new Date();
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    return expiryDate.getTime() - now.getTime() < threeDays;
  }) || [];

  const rewardsByType = availableRewards?.reduce((acc, reward) => {
    if (!acc[reward.type]) {
      acc[reward.type] = [];
    }
    acc[reward.type].push(reward);
    return acc;
  }, {} as Record<string, Reward[]>) || {};

  return {
    // Data
    availableRewards,
    claimedRewards,
    totalAvailableValue,
    expiringSoon,
    rewardsByType,
    error,

    // Loading states
    isLoading: isLoadingAvailable || isLoadingClaimed,

    // Actions
    claimReward: claimRewardMutation.mutate,
    isClaiming: claimRewardMutation.isPending,

    // Helpers
    hasAvailableRewards: (availableRewards?.length || 0) > 0,
    getRewardsByCategory: (type: string) => rewardsByType[type] || []
  };
}

export default useRewards;

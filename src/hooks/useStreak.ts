import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamificationApi } from '../services/gamificationApi';
import type { CheckInResult } from '../types/gamification';
import { useState } from 'react';

/**
 * Hook for streak data and check-in functionality
 */
export function useStreak(userId?: string) {
  const queryClient = useQueryClient();
  const [checkInResult, setCheckInResult] = useState<CheckInResult | null>(null);

  // Get current streak
  const { data: streakData, isLoading } = useQuery({
    queryKey: ['gamification', 'streak', userId],
    queryFn: async () => {
      const response = await gamificationApi.getStreak();
      return response;
    },
    enabled: !!userId,
    refetchInterval: 60000 // Refetch every minute to update canCheckIn status
  });

  const streak = streakData?.streak ?? null;

  // Check-in mutation
  const { mutate: checkIn, isPending: isCheckingIn } = useMutation({
    mutationFn: gamificationApi.checkIn,
    onSuccess: (data) => {
      // Store the check-in result
      setCheckInResult(data);
      
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['gamification', 'streak'] });
      queryClient.invalidateQueries({ queryKey: ['gamification', 'profile'] });
    },
    onError: (error) => {
      // Handle errors
      console.error("Check-in failed:", error);
    }
  });

  // Computed values with safe defaults
  const canCheckIn = streak?.canCheckIn ?? false;
  const currentStreak = streak?.currentStreak ?? 0;
  const longestStreak = streak?.longestStreak ?? 0;
  const totalCheckIns = streak?.totalCheckIns ?? 0;
  const lastCheckIn = streak?.lastCheckIn ?? null;
  const nextMilestone = streak?.nextMilestone ?? null;

  return {
    // Data
    streak,
    currentStreak,
    longestStreak,
    totalCheckIns,
    lastCheckIn,
    nextMilestone,
    canCheckIn,
    checkInResult,

    // Loading states
    isLoading,

    // Actions
    checkIn,
    isCheckingIn,
    
    // Helper to clear check-in result
    clearCheckInResult: () => setCheckInResult(null),
  };
}

export default useStreak;

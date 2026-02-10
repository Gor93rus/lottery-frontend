import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamificationApi } from '../services/gamificationApi';
import type { Achievement, UserAchievement } from '../types/gamification';

export function useAchievements(userId?: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['achievements', userId],
    queryFn: gamificationApi.getMyAchievements,
    enabled: !!userId,
  });

  const { mutate: claimAchievement, isPending: isClaiming } = useMutation({
    mutationFn: (achievementId: string) => gamificationApi.claimAchievement(achievementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });

  const achievements = data?.achievements ?? [];

  // Safe filtering with null checks
  const unlockedAchievements = achievements.filter((a: Achievement) => a?.unlockedAt);
  const lockedAchievements = achievements.filter((a: Achievement) => !a?.unlockedAt);

  // Add a function to get achievement progress
  const getAchievementProgress = (achievementId: string) => {
    const achievement = achievements.find((a: Achievement) => a?.id === achievementId);
    if (!achievement) return null;
    return {
      current: achievement.unlockedAt ? achievement.requirement : 0,
      target: achievement.requirement ?? 0,
      percentage: achievement.unlockedAt ? 100 : 0,
    };
  };

  return {
    allAchievements: achievements,
    unlockedAchievements,
    lockedAchievements,
    isLoading,
    isClaiming,
    error: error as Error | null,
    claimAchievement,
    progress: achievements.map((a: Achievement) => ({
      achievement: a,
      current: a?.unlockedAt ? (a.requirement ?? 0) : 0,
      target: a?.requirement ?? 0,
      percentage: a?.unlockedAt ? 100 : 0,
      unlocked: !!a?.unlockedAt,
      currentValue: a?.unlockedAt ? (a.requirement ?? 0) : 0,
      userAchievement: (a?.unlockedAt ? {
        id: a.id,
        achievement: a,
        unlockedAt: a.unlockedAt,
        claimed: false,
        claimedAt: null,
      } : null) as UserAchievement | null,
    })),
    getAchievementProgress,
  };
}

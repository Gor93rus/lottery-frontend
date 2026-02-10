import { useMemo } from 'react';
import { useAchievements } from './useAchievements';

export function useAchievementProgress(achievementId: string) {
  const { allAchievements, isLoading, error } = useAchievements();

  const progressData = useMemo(() => {
    const achievement = allAchievements.find(a => a.id === achievementId);
    
    if (!achievement) {
      return null;
    }
    
    // Get progress based on whether achievement is unlocked
    const currentProgress = achievement.unlockedAt ? achievement.requirement : 0;
    const unlocked = !!achievement.unlockedAt;

    return {
      achievement,
      currentValue: currentProgress,
      unlocked,
    };
  }, [allAchievements, achievementId]);

  const progressPercentage = progressData 
    ? (progressData.achievement.requirement > 0 
        ? (progressData.currentValue / progressData.achievement.requirement) * 100 
        : 0)
    : 0;

  return {
    progress: progressData,
    progressPercentage,
    isCompleted: progressData?.unlocked || false,
    isLoading,
    error,
  };
}

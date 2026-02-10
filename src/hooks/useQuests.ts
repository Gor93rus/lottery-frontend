import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamificationApi } from '../services/gamificationApi';
import type { UserQuest, QuestType } from '../types/gamification';

export function useQuests(userId?: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['quests', userId],
    queryFn: gamificationApi.getMyQuests,
    enabled: !!userId
  });

  const { mutate: claimQuest, isPending: isClaiming } = useMutation({
    mutationFn: (questId: string) => gamificationApi.claimQuest(questId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests', userId] });
    }
  });

  const quests: UserQuest[] = data?.quests ?? [];

  // Safe filtering with null checks
  const dailyQuests = quests.filter((q) => q?.quest?.type === 'daily');
  const specialQuests = quests.filter((q) => q?.quest?.type === 'special' as QuestType);
  const onetimeQuests = quests.filter((q) => q?.quest?.type === 'onetime');
  const completedCount = quests.filter((q) => q?.completed && !q?.claimed).length;

  return {
    allQuests: quests,
    dailyQuests,
    specialQuests,
    onetimeQuests,
    completedCount,
    isLoading,
    isClaiming,
    error,
    claimQuest,
  };
}

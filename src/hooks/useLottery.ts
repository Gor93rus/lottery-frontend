/**
 * Hook for fetching a single lottery's details
 */
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api/client';
import type { Lottery, Draw } from '../types/api';

export type LotteryDetails = Lottery;
export type NextDraw = Draw;

interface LotteryResponse {
  success: boolean;
  lottery: Lottery;
  nextDraw: Draw | null;
}

export function useLottery(slug: string) {
  return useQuery<LotteryResponse>({
    queryKey: ['lottery', slug],
    queryFn: async () => {
      const response = await apiClient.getLotteryInfo(slug);
      return response;
    },
    enabled: !!slug,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
}

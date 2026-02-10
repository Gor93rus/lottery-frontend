/**
 * Hook for fetching user purchase and transaction history
 */
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api/client';

export interface HistoryFilters {
  page?: number;
  limit?: number;
  type?: 'purchase' | 'win' | 'all';
  lotteryId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface HistoryTransaction {
  id: string;
  type: 'purchase' | 'win';
  lotteryId: string;
  lotteryName: string;
  amount: number;
  currency: 'TON' | 'USDT';
  numbers: number[];
  status: 'completed' | 'pending' | 'paid';
  createdAt: string;
  txHash: string;
  prize?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UserHistoryResponse {
  success: boolean;
  history: HistoryTransaction[];
  pagination: Pagination;
}

export function useUserHistory(filters?: HistoryFilters) {
  return useQuery<UserHistoryResponse>({
    queryKey: ['user', 'history', filters],
    queryFn: async () => {
      const response = await apiClient.getUserHistory(filters);
      return response;
    },
    staleTime: 60 * 1000, // 1 minute
    retry: 2,
  });
}

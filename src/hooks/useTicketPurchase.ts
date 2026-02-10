/**
 * Hook for purchasing lottery tickets
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api/client';

export interface TicketPurchaseData {
  lotterySlug: string;
  numbers: number[];
  txHash: string;
  currency: 'TON' | 'USDT';
}

export interface PurchasedTicket {
  id: string;
  numbers: number[];
  purchasedAt: string;
  status: 'active' | 'won' | 'lost' | 'pending';
  drawId?: string;
  drawDate?: string;
  prizeAmount?: number;
  ticketNumber?: string;
  txHash?: string;
}

interface TicketPurchaseResponse {
  success: boolean;
  ticket: PurchasedTicket;
}

export function useTicketPurchase() {
  const queryClient = useQueryClient();

  return useMutation<TicketPurchaseResponse, Error, TicketPurchaseData>({
    mutationFn: async (purchaseData: TicketPurchaseData) => {
      const response = await apiClient.buyTicket(
        purchaseData.lotterySlug,
        purchaseData.numbers,
        purchaseData.txHash
      );
      return response;
    },
    onSuccess: (_responseData, variables) => {
      // Refresh user profile/balance
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      // Refresh lottery data to update participant count and prize pool
      queryClient.invalidateQueries({ queryKey: ['lotteries'] });
      queryClient.invalidateQueries({ queryKey: ['lottery', variables.lotterySlug] });
      
      // Refresh user's tickets
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['myTickets'] });
    },
  });
}

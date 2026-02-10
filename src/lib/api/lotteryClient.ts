import { apiClient } from './client';

export interface BuyTicketRequest {
  selectedNumbers: number[];
  txHash: string;
  walletAddress: string;
}

export interface BuyMultipleTicketsRequest {
  tickets: Array<{ selectedNumbers: number[] }>;
  txHash: string;
  walletAddress: string;
  totalAmount: number;
  discount: number;
}

export interface Ticket {
  id: string;
  numbers: number[];
  purchasedAt: string;
  status: 'active' | 'won' | 'lost' | 'pending';
  drawId?: string;
  drawDate?: string;
  prizeAmount?: number;
  ticketNumber?: string;
  txHash?: string;
  walletAddress?: string;
  blockNumber?: number;
  blockTimestamp?: string;
  price?: number;
  currency?: string;
}

export interface LotteryInfo {
  id: string;
  slug: string;
  name: string;
  description?: string;
  numbersToSelect: number;
  numbersPool: number;
  ticketPrice: number;
  lotteryWallet: string;
  currentJackpot: number;
  prizeStructure: Record<string, number | string>;
  isActive: boolean;
}

export interface NextDraw {
  id: string;
  scheduledAt: string;
  status: string;
}

class LotteryClient {
  /**
   * Buy a lottery ticket
   */
  async buyTicket(slug: string, request: BuyTicketRequest): Promise<Ticket> {
    const response = await apiClient.buyTicket(
      slug,
      request.selectedNumbers,
      request.txHash
    );
    return response.ticket;
  }

  /**
   * Buy multiple lottery tickets
   */
  async buyTickets(slug: string, request: BuyMultipleTicketsRequest): Promise<{ tickets: Ticket[] }> {
    // For now, we'll buy tickets one by one since the backend doesn't have a bulk endpoint yet
    // In the future, this should be replaced with a single bulk API call
    const tickets: Ticket[] = [];
    
    for (const ticketData of request.tickets) {
      const response = await apiClient.buyTicket(
        slug,
        ticketData.selectedNumbers,
        request.txHash
      );
      tickets.push(response.ticket);
    }
    
    return { tickets };
  }

  /**
   * Get user's tickets for a lottery
   */
  async getMyTickets(slug: string, page = 1, limit = 20): Promise<{ 
    tickets: Ticket[]; 
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages?: number;
    }
  }> {
    const response = await apiClient.getMyTickets(slug, page, limit);
    return {
      tickets: response.tickets,
      pagination: response.pagination
    };
  }

  /**
   * Get lottery information
   */
  async getLotteryInfo(slug: string): Promise<{ lottery: LotteryInfo; nextDraw: NextDraw | null }> {
    const response = await apiClient.getLotteryInfo(slug);
    return {
      lottery: response.lottery as LotteryInfo,
      nextDraw: response.nextDraw as NextDraw | null
    };
  }
}

export const lotteryClient = new LotteryClient();

const API_URL = import.meta.env.VITE_API_URL || 'https://lottery-backend-gm4j.onrender.com/api';

export interface TicketPurchaseData {
  lotterySlug: string;
  numbers: number[];
  txHash: string;
  walletAddress: string;
  price: number;
  currency?: 'TON' | 'USDT';  // Payment currency
}

export interface PurchasedTicket {
  id: string;
  lotterySlug: string;
  numbers: number[];
  txHash: string;
  walletAddress: string;
  price: number;
  purchasedAt: string;
  status: 'active' | 'won' | 'lost' | 'pending';
  currency?: string;
  blockNumber?: number;
  blockTimestamp?: string;
  prizeAmount?: number;
  matchedNumbers?: number;
  createdAt?: string;
}

interface GetUserTicketsResponse {
  tickets: PurchasedTicket[];
  count: number;
}

// Verification API types
export interface VerificationResult {
  ticket: {
    id: string;
    lotteryId: string;
    lotteryName: string;
    numbers: number[];
    drawDate: string;
    price: number;
  };
  draw: {
    winningNumbers: number[];
    drawDate: string;
  };
  result: {
    matchCount: number;
    matchedNumbers: number[];
    prize: number;
    won: boolean;
  };
  lottery: {
    name: string;
    prizeStructure: {
      match5: number;
      match4: number;
      match3: number;
      match2: number;
      match1: number;
    };
  };
  blockchain: {
    txHash: string;
    blockNumber: number;
    timestamp: string;
    explorerUrl: string;
  };
}

export const ticketApi = {
  // Save single ticket
  async saveTicket(data: TicketPurchaseData): Promise<PurchasedTicket> {
    const response = await fetch(`${API_URL}/tickets/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to save ticket');
    }

    return response.json();
  },

  // Save multiple tickets (cart)
  async saveTickets(tickets: TicketPurchaseData[]): Promise<PurchasedTicket[]> {
    const response = await fetch(`${API_URL}/tickets/purchase-bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tickets }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to save tickets');
    }

    return response.json();
  },

  // Get user's tickets
  async getUserTickets(walletAddress: string): Promise<PurchasedTicket[]> {
    const response = await fetch(`${API_URL}/tickets/user/${walletAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch user tickets');
    }

    const data: GetUserTicketsResponse = await response.json();
    // API returns { tickets: [...], count: N }, extract tickets array
    return Array.isArray(data.tickets) ? data.tickets : [];
  },

  // Verify ticket
  async verifyTicket(ticketId: string): Promise<VerificationResult> {
    const response = await fetch(`${API_URL}/tickets/${ticketId}/verify`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to verify ticket');
    }

    return response.json();
  },
};

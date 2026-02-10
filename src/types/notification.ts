export interface Notification {
  id: string;
  type: 'win' | 'draw_soon' | 'purchase' | 'draw_complete' | 'prize_claimed' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  metadata?: {
    amount?: number;
    currency?: string;
    lotteryName?: string;
    ticketId?: string;
  };
}

export const NOTIFICATION_CONFIG = {
  win: {
    icon: '🎉',
    color: '#10b981',
    bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))'
  },
  draw_soon: {
    icon: '⏰',
    color: '#f59e0b',
    bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))'
  },
  purchase: {
    icon: '✅',
    color: '#3b82f6',
    bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))'
  },
  draw_complete: {
    icon: '🔮',
    color: '#8b5cf6',
    bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(109, 40, 217, 0.1))'
  },
  prize_claimed: {
    icon: '💰',
    color: '#10b981',
    bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))'
  },
  system: {
    icon: '⚠️',
    color: '#ef4444',
    bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))'
  }
} as const;

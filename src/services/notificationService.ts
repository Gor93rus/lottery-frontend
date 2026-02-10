import type { Notification } from '../types/notification';

const STORAGE_KEY = 'lottery_notifications';
const HOUR_IN_MS = 60 * 60 * 1000;
const DAY_IN_MS = 24 * HOUR_IN_MS;

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'win',
    title: 'Congratulations! 🎉',
    message: 'You won 500 TON in Weekend Special!',
    timestamp: new Date(Date.now() - 2 * HOUR_IN_MS), // 2 hours ago
    read: false,
    actionUrl: '/my-tickets',
    metadata: {
      amount: 500,
      currency: 'TON',
      lotteryName: 'Weekend Special'
    }
  },
  {
    id: '2',
    type: 'draw_soon',
    title: 'Draw Starting Soon ⏰',
    message: 'Mega Jackpot draw starts in 1 hour',
    timestamp: new Date(Date.now() - 23 * HOUR_IN_MS), // 23 hours ago
    read: false,
    actionUrl: '/lottery/mega-jackpot',
    metadata: {
      lotteryName: 'Mega Jackpot'
    }
  },
  {
    id: '3',
    type: 'purchase',
    title: 'Ticket Purchased ✅',
    message: 'Your ticket for Weekend Special is confirmed',
    timestamp: new Date(Date.now() - 2 * DAY_IN_MS), // 2 days ago
    read: true,
    actionUrl: '/my-tickets',
    metadata: {
      ticketId: 'WS-00001-000123',
      lotteryName: 'Weekend Special'
    }
  },
  {
    id: '4',
    type: 'draw_complete',
    title: 'Draw Results Ready 🔮',
    message: 'Weekend Special draw #42 results are available',
    timestamp: new Date(Date.now() - 3 * DAY_IN_MS), // 3 days ago
    read: true,
    actionUrl: '/draw/weekend-special-42/results',
    metadata: {
      lotteryName: 'Weekend Special'
    }
  },
  {
    id: '5',
    type: 'prize_claimed',
    title: 'Prize Sent 💰',
    message: '50 TON has been sent to your wallet',
    timestamp: new Date(Date.now() - 5 * DAY_IN_MS), // 5 days ago
    read: true,
    actionUrl: '/history',
    metadata: {
      amount: 50,
      currency: 'TON'
    }
  },
  {
    id: '6',
    type: 'system',
    title: 'Scheduled Maintenance ⚠️',
    message: 'System will be down for maintenance on Saturday 2:00 AM UTC',
    timestamp: new Date(Date.now() - 7 * DAY_IN_MS), // 7 days ago
    read: true,
    actionUrl: undefined
  }
];

class NotificationService {
  /**
   * Get notifications (mock data + localStorage)
   */
  async getNotifications(): Promise<Notification[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Array<Omit<Notification, 'timestamp'> & { timestamp: string }>;
        return parsed.map((n) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
      }
      
      // First time - use mock data
      this.saveNotifications(MOCK_NOTIFICATIONS);
      return MOCK_NOTIFICATIONS;
    } catch (error) {
      console.error('Failed to load notifications from localStorage:', error);
      return MOCK_NOTIFICATIONS;
    }
  }

  /**
   * Save notifications to localStorage
   */
  saveNotifications(notifications: Notification[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }

  /**
   * Request browser notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return await Notification.requestPermission();
  }

  /**
   * Show browser notification (if permitted)
   */
  showBrowserNotification(notification: Notification): void {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo.png',
        badge: '/badge.png',
        tag: notification.id
      });
    }
  }

  /**
   * Play notification sound
   */
  playSound(): void {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(err => {
        console.log('Sound play failed (user interaction required):', err);
      });
    } catch (error) {
      console.log('Sound not available:', error);
    }
  }

  /**
   * Format timestamp to relative time
   */
  formatTimestamp(date: Date): string {
    const now = Date.now();
    const diff = now - date.getTime();
    
    const minutes = Math.floor(diff / (60 * 1000));
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  }
}

export const notificationService = new NotificationService();

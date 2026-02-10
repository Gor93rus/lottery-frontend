import { CURRENT_CONFIG, LOTTERY_CONFIG as CONTRACT_CONFIG } from './contracts';

// Lottery Configuration Constants
export const LOTTERY_CONFIG = {
  // Use contract configuration
  WALLET_ADDRESS: CURRENT_CONFIG.LOTTERY_WALLET,
  
  // Ticket price in TON
  TICKET_PRICE: CONTRACT_CONFIG.TICKET_PRICE_TON,
  
  // Discount threshold (5+ tickets = 5% off)
  DISCOUNT_THRESHOLD: 5,
  DISCOUNT_PERCENT: 0.05,
};

// Weekend Special Lottery Configuration
export const WEEKEND_SPECIAL_CONFIG = {
  slug: 'weekend-special',
  name: 'Weekend Special',
  format: '5/36',
  numbersToSelect: 5,
  numbersPool: 36,
  ticketPrice: LOTTERY_CONFIG.TICKET_PRICE,
  ticketPriceNano: (CONTRACT_CONFIG.TICKET_PRICE_TON * 1e9).toString(),
  lotteryWallet: CURRENT_CONFIG.LOTTERY_WALLET,
  prizes: {
    5: 500,    // TON
    4: 50,
    3: 5,
    2: 0.5,
    1: 'free_ticket' as const
  },
  drawTime: '18:00',
  timezone: 'Europe/Moscow'
};

// Design Theme: "Sunset Gold"
export const WEEKEND_THEME = {
  primary: '#FFD700',        // золотой
  secondary: '#FF6B35',      // закатный оранжевый
  accent: '#9B59B6',         // королевский фиолетовый
  bg: 'linear-gradient(135deg, #1a1a2e, #16213e)'
};

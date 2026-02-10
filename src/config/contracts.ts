// Lottery Contract Configuration
export const LOTTERY_CONFIG = {
  // Network
  NETWORK: 'mainnet' as const,
  
  // Mainnet Configuration
  MAINNET: {
    // Lottery wallet (receives ticket payments)
    LOTTERY_WALLET: 'UQDAy6M4QQRcIy8jLl4n4acb7IxmDnPZiBqz7A_6xvY90NwS',
    
    // USDT Jetton Master Contract
    USDT_JETTON: 'UQAfATgmh11oc6BFRBa6Jta8cIO0vvuLn3jUHSaMNdeneSbk',
    
    // TON API Endpoint (use jsonRPC endpoint for TonClient)
    TON_API: 'https://toncenter.com/api/v2/jsonRPC',
    TON_API_KEY: '', // Optional: add if you have API key
  },
  
  // Testnet Configuration (for future use)
  TESTNET: {
    LOTTERY_WALLET: '0QDAy6M4QQRcIy8jLl4n4acb7IxmDnPZiBqz7A_6xvY90GeY',
    USDT_JETTON: '', // Testnet USDT not available yet
    TON_API: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    TON_API_KEY: '',
  },
  
  // Ticket Prices
  TICKET_PRICE_TON: 1, // 1 TON per ticket
  TICKET_PRICE_USDT: 5.2, // 5.2 USDT per ticket
  
  // Exchange Rate (fallback)
  TON_TO_USDT_RATE: 5.2,
};

// Helper to get current config based on network
export function getLotteryConfig() {
  const network = LOTTERY_CONFIG.NETWORK;
  return LOTTERY_CONFIG[network.toUpperCase() as 'MAINNET' | 'TESTNET'];
}

// Export current config
export const CURRENT_CONFIG = getLotteryConfig();

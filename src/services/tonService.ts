import { TonClient, Address } from '@ton/ton';
import { CURRENT_CONFIG } from '../config/contracts';

// Constants
const MIN_TX_HASH_LENGTH = 20; // Minimum length for a valid TON transaction hash

// Initialize TON Client
const tonClient = new TonClient({
  endpoint: CURRENT_CONFIG.TON_API,
  apiKey: CURRENT_CONFIG.TON_API_KEY || undefined,
});

/**
 * Get TON balance for an address
 */
export async function getTonBalance(address: string): Promise<number> {
  try {
    const balance = await tonClient.getBalance(Address.parse(address));
    // Convert from nanotons to TON (1 TON = 10^9 nanotons)
    const balanceTON = Number(balance) / 1e9;
    console.log(`💎 TON Balance for ${address}: ${balanceTON.toFixed(4)} TON`);
    return balanceTON;
  } catch (error) {
    console.error('Failed to get TON balance:', error);
    return 0;
  }
}

/**
 * Get USDT Jetton balance for an address
 */
export async function getUsdtBalance(address: string): Promise<number> {
  // Import the real implementation from jettonService
  const { getUsdtBalance: getRealUsdtBalance } = await import('../lib/ton/jettonService');
  return getRealUsdtBalance(address);
}

/**
 * Verify a transaction exists and is valid
 */
export async function verifyTransaction(
  txHash: string,
  expectedDestination: string,
  expectedAmountTON?: number
): Promise<boolean> {
  try {
    // Query transaction from blockchain
    // Note: This is a simplified check - full implementation would query transaction details
    console.log(`🔍 Verifying transaction: ${txHash}`);
    console.log(`   Expected destination: ${expectedDestination}`);
    if (expectedAmountTON) {
      console.log(`   Expected amount: ${expectedAmountTON} TON`);
    }
    
    // TODO: Implement full transaction verification
    // For now, assume valid if txHash is provided and meets minimum length
    const isValid = !!(txHash && txHash.length > MIN_TX_HASH_LENGTH);
    
    console.log(`   Result: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    return isValid;
  } catch (error) {
    console.error('Failed to verify transaction:', error);
    return false;
  }
}

interface TransactionDetails {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
}

/**
 * Get transaction details
 */
export async function getTransactionDetails(txHash: string): Promise<TransactionDetails | null> {
  try {
    // TODO: Implement transaction query via TON API
    console.log(`📜 Getting transaction details: ${txHash}`);
    
    // Mock response for now
    return {
      hash: txHash,
      from: 'UQ...',
      to: CURRENT_CONFIG.LOTTERY_WALLET,
      value: '1000000000', // 1 TON in nanotons
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Failed to get transaction details:', error);
    return null;
  }
}

/**
 * Format address for display (truncate middle)
 * Returns full address if it's too short to format meaningfully
 */
export function formatAddress(address: string, chars: number = 6): string {
  if (!address) return '';
  // Only format if address is long enough to make truncation meaningful
  if (address.length <= chars * 2 + 3) return address; // +3 for "..."
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Convert nanotons to TON
 */
export function fromNano(nanotons: string | number): number {
  return Number(nanotons) / 1e9;
}

/**
 * Convert TON to nanotons
 */
export function toNano(tons: number): string {
  return (tons * 1e9).toString();
}

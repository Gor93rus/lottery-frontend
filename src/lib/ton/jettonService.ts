import { TonClient, Address } from '@ton/ton';
import { beginCell } from '@ton/core';
import { CURRENT_CONFIG } from '../../config/contracts';
import { tonRpcCache } from './cache';

// Initialize TON Client
const tonClient = new TonClient({
  endpoint: CURRENT_CONFIG.TON_API,
  apiKey: CURRENT_CONFIG.TON_API_KEY || undefined,
});

// USDT has 6 decimal places
const USDT_DECIMALS = 1_000_000;

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Retry logic with exponential backoff for network requests
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<T> {
  try {
    await tonRpcCache.checkRateLimit();
    return await fn();
  } catch (error: any) {
    // Check if it's a 429 rate limit error
    if (error?.message?.includes('429') || error?.message?.includes('Too Many Requests')) {
      tonRpcCache.handleRateLimitError();
    }

    if (retries > 0) {
      console.warn(
        `⚠️  Request failed, retrying in ${delay}ms. Retries left: ${retries}`,
        error?.message
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries - 1, delay * 1.5);
    }

    throw error;
  }
}

/**
 * Get Jetton wallet address for a given owner address
 * @param jettonMasterAddress - Address of the Jetton Master contract
 * @param ownerAddress - Address of the wallet owner
 * @returns The Jetton wallet address
 */
export async function getJettonWalletAddress(
  jettonMasterAddress: string,
  ownerAddress: string
): Promise<string> {
  const cacheKey = `jetton-wallet-${jettonMasterAddress}-${ownerAddress}`;
  
  // Check cache first (10 minutes TTL for wallet addresses)
  const cached = tonRpcCache.get<string>(cacheKey);
  if (cached) {
    console.log('📦 Using cached Jetton wallet address');
    return cached;
  }

  try {
    return await retryWithBackoff(async () => {
      const jettonMaster = Address.parse(jettonMasterAddress);
      const owner = Address.parse(ownerAddress);
      
      // Create a cell containing the owner address
      const ownerCell = beginCell().storeAddress(owner).endCell();
      
      // Call get_wallet_address on Jetton Master
      const result = await tonClient.runMethod(jettonMaster, 'get_wallet_address', [
        { type: 'slice', cell: ownerCell }
      ]);
      
      // Parse the returned address
      const jettonWalletAddress = result.stack.readAddress();
      const addressStr = jettonWalletAddress.toString();
      
      // Cache the result (10 minutes)
      tonRpcCache.set(cacheKey, addressStr, 10 * 60 * 1000);
      
      return addressStr;
    });
  } catch (error) {
    console.error('Failed to get Jetton wallet address:', error);
    throw error;
  }
}

/**
 * Get Jetton balance for a wallet
 * @param jettonWalletAddress - Address of the Jetton wallet
 * @returns The balance as a bigint in Jetton units
 */
export async function getJettonWalletBalance(
  jettonWalletAddress: string
): Promise<bigint> {
  const cacheKey = `jetton-balance-${jettonWalletAddress}`;
  
  // Check cache first (2 minutes TTL for balances - more frequent refresh)
  const cached = tonRpcCache.get<bigint>(cacheKey);
  if (cached) {
    console.log('📦 Using cached Jetton balance');
    return cached;
  }

  try {
    return await retryWithBackoff(async () => {
      const walletAddress = Address.parse(jettonWalletAddress);
      
      // Call get_wallet_data on Jetton Wallet
      const result = await tonClient.runMethod(walletAddress, 'get_wallet_data', []);
      
      // Parse result: get_wallet_data returns (int balance, slice owner, slice jetton, cell jetton_wallet_code)
      const balance = result.stack.readBigNumber();
      
      // Cache the result (2 minutes)
      tonRpcCache.set(cacheKey, balance, 2 * 60 * 1000);
      
      return balance;
    });
  } catch (error) {
    console.error('Failed to get Jetton wallet balance:', error);
    throw error;
  }
}

/**
 * Get USDT balance for an owner address
 * @param ownerAddress - Address of the wallet owner
 * @returns The USDT balance as a number (with decimals)
 */
export async function getUsdtBalance(ownerAddress: string): Promise<number> {
  const cacheKey = `usdt-balance-${ownerAddress}`;
  
  // Check cache first (2 minutes TTL)
  const cached = tonRpcCache.get<number>(cacheKey);
  if (cached) {
    console.log('📦 Using cached USDT balance');
    return cached;
  }

  try {
    return await retryWithBackoff(async () => {
      // 1. Get the user's USDT Jetton wallet address
      const jettonWalletAddress = await getJettonWalletAddress(
        CURRENT_CONFIG.USDT_JETTON,
        ownerAddress
      );
      
      console.log(`💵 USDT Jetton Wallet for ${ownerAddress}:`, jettonWalletAddress);
      
      // 2. Get balance from Jetton wallet
      const balanceRaw = await getJettonWalletBalance(jettonWalletAddress);
      
      // 3. Convert from Jetton units to USDT (6 decimals)
      const balance = Number(balanceRaw) / USDT_DECIMALS;
      
      console.log(`💵 USDT Balance: ${balance.toFixed(2)} USDT`);
      
      // Cache the result (2 minutes)
      tonRpcCache.set(cacheKey, balance, 2 * 60 * 1000);
      
      return balance;
    });
  } catch (error) {
    console.error('Failed to get USDT balance:', error);
    // Return 0 on error instead of throwing to prevent UI breaks
    return 0;
  }
}

/**
 * Convert USDT amount to Jetton units (6 decimals)
 * @param usdtAmount - Amount in USDT
 * @returns Amount in Jetton units as bigint
 */
export function usdtToJettonUnits(usdtAmount: number): bigint {
  return BigInt(Math.floor(usdtAmount * USDT_DECIMALS));
}

/**
 * Convert Jetton units to USDT amount (6 decimals)
 * @param jettonUnits - Amount in Jetton units
 * @returns Amount in USDT
 */
export function jettonUnitsToUsdt(jettonUnits: bigint): number {
  return Number(jettonUnits) / USDT_DECIMALS;
}

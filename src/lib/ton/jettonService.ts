import { TonClient, Address } from '@ton/ton';
import { beginCell } from '@ton/core';
import { CURRENT_CONFIG } from '../../config/contracts';

// Initialize TON Client
const tonClient = new TonClient({
  endpoint: CURRENT_CONFIG.TON_API,
  apiKey: CURRENT_CONFIG.TON_API_KEY || undefined,
});

// USDT has 6 decimal places
const USDT_DECIMALS = 1_000_000;

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
  try {
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
    return jettonWalletAddress.toString();
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
  try {
    const walletAddress = Address.parse(jettonWalletAddress);
    
    // Call get_wallet_data on Jetton Wallet
    const result = await tonClient.runMethod(walletAddress, 'get_wallet_data', []);
    
    // Parse result: get_wallet_data returns (int balance, slice owner, slice jetton, cell jetton_wallet_code)
    const balance = result.stack.readBigNumber();
    
    return balance;
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
  try {
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
    return balance;
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

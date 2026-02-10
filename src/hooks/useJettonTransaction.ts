import { useState } from 'react';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { toNano } from '@ton/core';
import { createJettonTransferTransaction } from '../lib/ton/jettonTransfer';
import { getJettonWalletAddress } from '../lib/ton/jettonService';
import { CURRENT_CONFIG } from '../config/contracts';

export function useJettonTransaction() {
  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  /**
   * Send a Jetton transfer
   * @param jettonAmount - Amount in Jetton units (bigint)
   * @param destinationAddress - Lottery TON wallet address
   * @param gasAmount - TON for gas (default 0.1)
   * @param forwardTonAmount - TON for forward notification (default 0.05)
   * @returns Transaction BOC
   */
  const sendJettonTransfer = async (
    jettonAmount: bigint,
    destinationAddress: string,
    gasAmount: bigint = toNano('0.1'),
    forwardTonAmount: bigint = toNano('0.05')
  ): Promise<string> => {
    if (!userAddress) {
      const err = new Error('Wallet not connected');
      setError(err);
      throw err;
    }

    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      // 1. Get user's USDT Jetton wallet address
      const jettonWalletAddress = await getJettonWalletAddress(
        CURRENT_CONFIG.USDT_JETTON,
        userAddress
      );

      console.log('💳 Sending Jetton transfer:');
      console.log('  - User Jetton Wallet:', jettonWalletAddress);
      console.log('  - Amount:', jettonAmount.toString());
      console.log('  - Destination:', destinationAddress);

      // 2. Create transaction
      const transaction = createJettonTransferTransaction(
        jettonWalletAddress,
        jettonAmount,
        destinationAddress,
        userAddress,
        gasAmount,
        forwardTonAmount
      );

      // 3. Send via TON Connect
      const result = await tonConnectUI.sendTransaction(transaction);
      
      const hash = result.boc;
      setTxHash(hash);

      console.log('✅ Jetton transfer sent:', hash);
      return hash;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Jetton transfer failed');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Purchase lottery ticket with USDT
   * @param usdtAmount - Amount in USDT (will be converted to Jetton units)
   * @param lotteryWallet - Lottery TON wallet address
   * @returns Transaction BOC
   */
  const buyLotteryTicketWithUsdt = async (
    usdtAmount: number,
    lotteryWallet: string
  ): Promise<string> => {
    // Convert USDT to Jetton units (6 decimals) using the utility function
    const { usdtToJettonUnits } = await import('../lib/ton/jettonService');
    const jettonAmount = usdtToJettonUnits(usdtAmount);
    
    return sendJettonTransfer(
      jettonAmount,
      lotteryWallet,
      toNano('0.1'),  // Gas
      toNano('0.05')  // Forward amount for notification
    );
  };

  return {
    sendJettonTransfer,
    buyLotteryTicketWithUsdt,
    isLoading,
    error,
    txHash,
    isConnected: !!userAddress,
    address: userAddress
  };
}

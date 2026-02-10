import { useState } from 'react';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { beginCell, toNano } from '@ton/core';

export interface TransactionParams {
  to: string;
  amount: string; // in nanotons
  payload?: string; // encoded data
}

export function useTonTransaction() {
  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const sendTransaction = async (params: TransactionParams): Promise<string> => {
    if (!userAddress) {
      const err = new Error('Wallet not connected');
      setError(err);
      throw err;
    }

    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 180, // 3 minutes
        messages: [
          {
            address: params.to,
            amount: params.amount,
            ...(params.payload && { payload: params.payload })
          }
        ]
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      
      // Get transaction hash from BOC
      const hash = result.boc;
      setTxHash(hash);
      
      return hash;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Transaction failed');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Helper method for lottery ticket purchase
   */
  const buyLotteryTicket = async (
    lotteryWallet: string,
    ticketPriceInTON: number,
    selectedNumbers: number[]
  ): Promise<string> => {
    // Create payload with selected numbers stored as uints
    const payload = beginCell()
      .storeUint(0, 32) // op code
      .storeUint(selectedNumbers.length, 8) // number count
      // Store each number as uint8
      .storeRef(
        beginCell()
          .storeUint(selectedNumbers[0] || 0, 8)
          .storeUint(selectedNumbers[1] || 0, 8)
          .storeUint(selectedNumbers[2] || 0, 8)
          .storeUint(selectedNumbers[3] || 0, 8)
          .storeUint(selectedNumbers[4] || 0, 8)
          .endCell()
      )
      .endCell();

    return sendTransaction({
      to: lotteryWallet,
      amount: toNano(ticketPriceInTON).toString(),
      payload: payload.toBoc().toString('base64')
    });
  };

  return {
    sendTransaction,
    buyLotteryTicket,
    isLoading,
    error,
    txHash,
    isConnected: !!userAddress,
    address: userAddress
  };
}

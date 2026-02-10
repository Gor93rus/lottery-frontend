import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { beginCell, toNano } from '@ton/core';

export function useLotteryTransaction() {
  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress();

  const buyTicket = async (
    lotteryWallet: string,
    ticketPrice: string,
    numbers: number[]
  ) => {
    if (!userAddress) {
      throw new Error('Wallet not connected');
    }

    try {
      // Создаём payload с номерами билета
      const payload = beginCell()
        .storeUint(0, 32) // op code
        .storeBuffer(Buffer.from(numbers.join(',')))
        .endCell();

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360, // 6 minutes
        messages: [
          {
            address: lotteryWallet,
            amount: toNano(ticketPrice).toString(),
            payload: payload.toBoc().toString('base64'),
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      
      // Получаем hash транзакции
      const txHash = result.boc;
      
      return txHash;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  return {
    buyTicket,
    isConnected: !!userAddress,
    address: userAddress,
  };
}

import { useState, useEffect, useCallback } from 'react';
import { getUsdtBalance } from '../lib/ton/jettonService';

export function useUsdtBalance(address: string | undefined) {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!address) {
      setBalance(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bal = await getUsdtBalance(address);
      setBalance(bal);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch USDT balance');
      setError(error);
      console.error('Error fetching USDT balance:', error);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchBalance();

    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000);

    return () => clearInterval(interval);
  }, [fetchBalance]);

  return {
    balance,
    loading,
    error,
    refetch: fetchBalance
  };
}

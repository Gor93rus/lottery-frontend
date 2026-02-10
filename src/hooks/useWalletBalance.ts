import { useState, useEffect, useCallback } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { getTonBalance, getUsdtBalance } from '../services/tonService';

interface WalletBalance {
  ton: number;
  usdt: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const REFRESH_INTERVAL = 10000; // 10 seconds
const CACHE_KEY = 'wallet_balance_cache';

export function useWalletBalance(): WalletBalance {
  const userAddress = useTonAddress();
  const [ton, setTon] = useState(0);
  const [usdt, setUsdt] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Start as loading
  const [error, setError] = useState<string | null>(null);

  // Load cached balance on mount
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { ton: cachedTon, usdt: cachedUsdt, timestamp } = JSON.parse(cached);
        // Use cache if less than 30 seconds old
        if (Date.now() - timestamp < 30000) {
          setTon(cachedTon);
          setUsdt(cachedUsdt);
        }
      } catch (err) {
        console.error('Failed to load cached balance:', err);
      }
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!userAddress) {
      setTon(0);
      setUsdt(0);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch balances in parallel
      const [tonBalance, usdtBalance] = await Promise.all([
        getTonBalance(userAddress),
        getUsdtBalance(userAddress),
      ]);

      setTon(tonBalance);
      setUsdt(usdtBalance);

      // Cache the result
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          ton: tonBalance,
          usdt: usdtBalance,
          timestamp: Date.now(),
        })
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load balance';
      setError(errorMessage);
      console.error('Failed to refresh balance:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userAddress]);

  // Auto-refresh on mount and when address changes
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!userAddress) return;

    const interval = setInterval(() => {
      refresh();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [userAddress, refresh]);

  return {
    ton,
    usdt,
    isLoading,
    error,
    refresh,
  };
}

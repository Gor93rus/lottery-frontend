import { useState, useEffect } from 'react';

export function useJackpot(initialJackpot: number, enableRealTime: boolean = true) {
  const [jackpot, setJackpot] = useState(initialJackpot);

  useEffect(() => {
    if (!enableRealTime) return;

    const interval = setInterval(() => {
      setJackpot(prev => prev + Math.floor(Math.random() * 10));
    }, 3000);

    return () => clearInterval(interval);
  }, [enableRealTime]);

  return jackpot;
}

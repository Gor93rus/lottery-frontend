import { useCallback } from 'react';

type HapticFeedbackType = 'light' | 'medium' | 'heavy';

interface HapticOptions {
  enabled?: boolean;
}

export const useHaptic = (options: HapticOptions = {}) => {
  const { enabled = true } = options;

  const vibrate = useCallback((pattern: number | number[]) => {
    if (!enabled) return;
    
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, [enabled]);

  const light = useCallback(() => {
    vibrate(10);
  }, [vibrate]);

  const medium = useCallback(() => {
    vibrate(20);
  }, [vibrate]);

  const heavy = useCallback(() => {
    vibrate([30, 10, 30]);
  }, [vibrate]);

  const trigger = useCallback((type: HapticFeedbackType) => {
    switch (type) {
      case 'light':
        light();
        break;
      case 'medium':
        medium();
        break;
      case 'heavy':
        heavy();
        break;
    }
  }, [light, medium, heavy]);

  return {
    light,
    medium,
    heavy,
    trigger,
    vibrate
  };
};

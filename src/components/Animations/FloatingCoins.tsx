import { useMemo } from 'react';
import './FloatingCoins.css';

interface FloatingCoinsProps {
  coinCount?: number;
  enabled?: boolean;
}

interface CoinConfig {
  id: number;
  size: 'small' | 'medium' | 'large';
  delay: number;
  duration: number;
  x: number;
  y: number;
}

const SIZES = {
  small: 20,
  medium: 30,
  large: 40,
};

function FloatingCoins({ coinCount = 8, enabled = true }: FloatingCoinsProps) {
  const coins = useMemo<CoinConfig[]>(() => {
    const count = Math.max(6, Math.min(8, coinCount));
    const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: sizes[i % 3],
      delay: Math.random() * 4,
      duration: 6 + Math.random() * 4,
      x: 10 + (i * 80 / count) + Math.random() * 20,
      y: 10 + Math.random() * 80,
    }));
  }, [coinCount]);

  if (!enabled) return null;

  return (
    <div className="floating-coins-container">
      {coins.map((coin) => (
        <div
          key={coin.id}
          className={`floating-coin floating-coin--${coin.size}`}
          style={{
            left: `${coin.x}%`,
            top: `${coin.y}%`,
            width: `${SIZES[coin.size]}px`,
            height: `${SIZES[coin.size]}px`,
            animationDelay: `${coin.delay}s`,
            animationDuration: `${coin.duration}s`,
          }}
        >
          <div className="coin-inner">
            <div className="coin-face coin-face--front">◎</div>
            <div className="coin-face coin-face--back">◎</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FloatingCoins;

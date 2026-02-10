import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LivePrizeCounter.css';

interface LivePrizeCounterProps {
  value: number;
  currency?: string;
  updateInterval?: number; // milliseconds
  onUpdate?: (newValue: number) => void;
}

function LivePrizeCounter({
  value,
  currency = 'TON',
  updateInterval = 5000,
  onUpdate,
}: LivePrizeCounterProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const [digits, setDigits] = useState<string[]>([]);
  const [lastIncrease, setLastIncrease] = useState(0);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    // Format number with separators
    const formatted = currentValue.toLocaleString('en-US');
    setDigits(formatted.split(''));
  }, [currentValue]);

  useEffect(() => {
    // Simulate live updates (in real app, this would come from backend)
    const interval = setInterval(() => {
      const randomIncrease = Math.floor(Math.random() * 100) + 1;
      setLastIncrease(randomIncrease);
      setCurrentValue((prev) => {
        const newValue = prev + randomIncrease;
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 500);
        onUpdate?.(newValue);
        return newValue;
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval, onUpdate]);

  const updateText = useMemo(() => `↑ +${lastIncrease} TON`, [lastIncrease]);

  return (
    <motion.div
      className={`live-prize-counter ${isAnimating ? 'animating' : ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="counter-label">💰 Призовой фонд</div>
      
      <div className="counter-display">
        <div className="digits-container">
          <AnimatePresence mode="popLayout">
            {digits.map((digit, index) => (
              <motion.span
                key={`${index}-${digit}`}
                className={digit === ',' ? 'separator' : 'digit'}
                initial={{ y: -20, opacity: 0, scale: 0.5 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
              >
                {digit}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
        <span className="currency">{currency}</span>
      </div>

      {isAnimating && (
        <motion.div
          className="update-indicator"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {updateText}
        </motion.div>
      )}

      <div className="pulse-ring" />
    </motion.div>
  );
}

export default LivePrizeCounter;

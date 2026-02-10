import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';
import './CountdownTimer.css';

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function CountdownTimer({ targetDate, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsComplete(true);
        onComplete?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Initial calculation - this is intentional and not a cascading render
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const isCritical = timeLeft.days === 0 && timeLeft.hours < 1;

  if (isComplete) {
    return (
      <motion.div
        className="countdown-complete"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="complete-icon">🎉</div>
        <h3>Розыгрыш начинается!</h3>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`countdown-container ${isCritical ? 'critical' : ''}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="countdown-header">
        <Clock size={24} />
        <h3>До розыгрыша</h3>
      </div>

      <div className="countdown-blocks">
        <TimeBlock value={timeLeft.days} label="Дней" isCritical={isCritical} />
        <TimeBlock value={timeLeft.hours} label="Часов" isCritical={isCritical} />
        <TimeBlock value={timeLeft.minutes} label="Минут" isCritical={isCritical} />
        <TimeBlock value={timeLeft.seconds} label="Секунд" isCritical={isCritical} />
      </div>

      {isCritical && (
        <motion.div
          className="critical-warning"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          ⚡ Скоро розыгрыш! Успей купить билет!
        </motion.div>
      )}
    </motion.div>
  );
}

function TimeBlock({
  value,
  label,
  isCritical,
}: {
  value: number;
  label: string;
  isCritical: boolean;
}) {
  return (
    <div className={`time-block ${isCritical ? 'critical' : ''}`}>
      <div className="time-value-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            className="time-value"
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {String(value).padStart(2, '0')}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="time-label">{label}</div>
    </div>
  );
}

export default CountdownTimer;

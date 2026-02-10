import { useState, useEffect } from 'react';
import './DrawCountdown.css';

interface DrawCountdownProps {
  targetDate: Date;
  drawNumber?: number;
}

export default function DrawCountdown({ targetDate, drawNumber }: DrawCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="ws-draw-countdown">
      <div className="ws-countdown-header">
        ⏱️ Тираж №{drawNumber || '00001'} через:
      </div>
      <div className="ws-countdown-timer">
        <div className="ws-time-unit">
          <span className="ws-time-value">{timeLeft.days.toString().padStart(2, '0')}</span>
          <span className="ws-time-label">д</span>
        </div>
        <span className="ws-time-separator">:</span>
        <div className="ws-time-unit">
          <span className="ws-time-value">{timeLeft.hours.toString().padStart(2, '0')}</span>
          <span className="ws-time-label">ч</span>
        </div>
        <span className="ws-time-separator">:</span>
        <div className="ws-time-unit">
          <span className="ws-time-value">{timeLeft.minutes.toString().padStart(2, '0')}</span>
          <span className="ws-time-label">м</span>
        </div>
        <span className="ws-time-separator">:</span>
        <div className="ws-time-unit">
          <span className="ws-time-value">{timeLeft.seconds.toString().padStart(2, '0')}</span>
          <span className="ws-time-label">с</span>
        </div>
      </div>
    </div>
  );
}

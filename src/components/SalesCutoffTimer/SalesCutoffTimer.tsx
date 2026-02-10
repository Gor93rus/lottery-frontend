import { useEffect, useState } from 'react';
import './SalesCutoffTimer.css';

interface SalesCutoffTimerProps {
  scheduledAt: string;
  ticketSalesOpen: boolean;
}

export default function SalesCutoffTimer({ scheduledAt, ticketSalesOpen }: SalesCutoffTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isClosed, setIsClosed] = useState(!ticketSalesOpen);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const drawTime = new Date(scheduledAt);
      const cutoffTime = new Date(drawTime.getTime() - 10 * 60 * 1000); // -10 min

      const diff = cutoffTime.getTime() - now.getTime();

      if (diff <= 0) {
        setIsClosed(true);
        setTimeRemaining('Продажа закрыта');
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(`${hours}ч ${minutes}м ${seconds}с до закрытия продаж`);
    }, 1000);

    return () => clearInterval(interval);
  }, [scheduledAt]);

  if (isClosed) {
    return (
      <div className="sales-cutoff-banner closed">
        🛑 Продажа билетов закрыта
        <br />
        <small>Розыгрыш скоро начнётся!</small>
      </div>
    );
  }

  return (
    <div className="sales-cutoff-timer">
      ⏰ {timeRemaining}
    </div>
  );
}

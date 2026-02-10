import './TicketsSoldCounter.css';

interface TicketsSoldCounterProps {
  count: number;
}

export default function TicketsSoldCounter({ count }: TicketsSoldCounterProps) {
  return (
    <div className="ws-tickets-sold">
      🎫 Куплено: <strong>{count}</strong> билетов
    </div>
  );
}

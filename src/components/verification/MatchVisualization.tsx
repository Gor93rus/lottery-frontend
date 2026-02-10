import NumberBadge from './NumberBadge';

interface MatchVisualizationProps {
  ticketNumbers: number[];
  winningNumbers: number[];
  matchedNumbers: number[];
  lotteryName: string;
  drawDate: string;
  ticketId: string;
  matchCount: number;
  prize: number;
  onNext: () => void;
}

export default function MatchVisualization({
  ticketNumbers,
  winningNumbers,
  matchedNumbers,
  lotteryName,
  drawDate,
  ticketId,
  matchCount,
  prize,
  onNext,
}: MatchVisualizationProps) {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="match-visualization glass-card">
      <div className="verification-header">
        <h2 className="verification-title">✅ Ticket Verified</h2>
      </div>

      <div className="ticket-info">
        <div className="info-row">
          <span className="info-label">🎰 Lottery:</span>
          <span className="info-value">{lotteryName}</span>
        </div>
        <div className="info-row">
          <span className="info-label">📅 Draw:</span>
          <span className="info-value">{formatDate(drawDate)}</span>
        </div>
        <div className="info-row">
          <span className="info-label">🎫 Ticket:</span>
          <span className="info-value">#{ticketId}</span>
        </div>
      </div>

      <div className="numbers-section">
        <h3 className="numbers-title">Your Numbers:</h3>
        <div className="numbers-grid">
          {ticketNumbers.map((num, idx) => (
            <NumberBadge
              key={idx}
              number={num}
              isMatched={matchedNumbers.includes(num)}
              delay={idx * 100}
            />
          ))}
        </div>
      </div>

      <div className="numbers-section">
        <h3 className="numbers-title">Winning Numbers:</h3>
        <div className="numbers-grid">
          {winningNumbers.map((num, idx) => (
            <NumberBadge key={idx} number={num} delay={idx * 100} />
          ))}
        </div>
      </div>

      <div className="match-result">
        <div className="match-count">
          <span className="match-text">Match: {matchCount}/5</span>
          <span className="stars">{'⭐'.repeat(matchCount)}</span>
        </div>
        <div className="prize-amount">
          <span className="prize-label">Prize:</span>
          <span className="prize-value">{prize} TON 💰</span>
        </div>
      </div>

      <button onClick={onNext} className="next-btn cta-button">
        Next: View Prizes →
      </button>
    </div>
  );
}

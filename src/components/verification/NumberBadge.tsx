interface NumberBadgeProps {
  number: number;
  isMatched?: boolean;
  delay?: number;
}

export default function NumberBadge({ number, isMatched = false, delay = 0 }: NumberBadgeProps) {
  return (
    <div
      className={`number-badge ${isMatched ? 'matched' : 'not-matched'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="number">{number}</span>
      {isMatched && <span className="checkmark">✓</span>}
    </div>
  );
}

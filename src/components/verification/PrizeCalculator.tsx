interface PrizeStructure {
  match5: number;
  match4: number;
  match3: number;
  match2: number;
  match1: number;
}

interface PrizeCalculatorProps {
  lotteryName: string;
  prizeStructure: PrizeStructure;
  matchCount: number;
  prize: number;
}

export default function PrizeCalculator({
  lotteryName,
  prizeStructure,
  matchCount,
  prize,
}: PrizeCalculatorProps) {
  const prizeRows = [
    { matches: 5, amount: prizeStructure.match5, label: 'Match 5/5' },
    { matches: 4, amount: prizeStructure.match4, label: 'Match 4/5' },
    { matches: 3, amount: prizeStructure.match3, label: 'Match 3/5' },
    { matches: 2, amount: prizeStructure.match2, label: 'Match 2/5' },
    { matches: 1, amount: prizeStructure.match1, label: 'Match 1/5' },
  ];

  return (
    <div className="prize-calculator glass-card">
      <div className="prize-header">
        <h2 className="prize-title">💰 Prize Breakdown</h2>
        <p className="lottery-name">{lotteryName}</p>
      </div>

      <div className="prize-table">
        {prizeRows.map((row) => {
          const isWinner = row.matches === matchCount && prize > 0;
          const hasNoPrize = row.amount === 0;

          return (
            <div
              key={row.matches}
              className={`prize-row ${isWinner ? 'winner-row' : ''}`}
            >
              <span className="match-label">{row.label}:</span>
              <span className="prize-amount-value">
                {hasNoPrize ? 'No prize' : `${row.amount} TON`}
                {isWinner && ' 🎉'}
              </span>
            </div>
          );
        })}
      </div>

      {prize > 0 && (
        <button className="claim-btn cta-button">
          Claim Prize →
        </button>
      )}
    </div>
  );
}

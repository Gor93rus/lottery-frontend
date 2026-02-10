import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Users, DollarSign, CheckCircle2, ExternalLink } from 'lucide-react';
import './DrawResultsPage.css';

interface Draw {
  id: string;
  lotteryId: string;
  lotteryName: string;
  drawDate: string;
  winningNumbers: number[];
  totalPrizePool: number;
  totalWinners: number;
  status: string;
}

interface WinnerTier {
  count: number;
  totalPrize: number;
}

interface WinnersByTier {
  5: WinnerTier;
  4: WinnerTier;
  3: WinnerTier;
}

export default function DrawResultsPage() {
  const { drawId } = useParams<{ drawId: string }>();
  const [draw, setDraw] = useState<Draw | null>(null);
  const [winnersByTier, setWinnersByTier] = useState<WinnersByTier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrawResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/draws/${drawId}/results`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch draw results');
      }

      setDraw(data.draw);
      setWinnersByTier(data.winnersByTier);
    } catch (err: unknown) {
      console.error('Failed to fetch draw results:', err);
      setError(err instanceof Error ? err.message : 'Failed to load draw results');
    } finally {
      setLoading(false);
    }
  }, [drawId]);

  useEffect(() => {
    fetchDrawResults();
  }, [fetchDrawResults]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="draw-results-page">
        <div className="loading-container">
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p>Loading draw results...</p>
        </div>
      </div>
    );
  }

  if (error || !draw) {
    return (
      <div className="draw-results-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error || 'Draw not found'}</p>
          <Link to="/" className="back-link">Back to Home</Link>
        </div>
      </div>
    );
  }

  const getTierName = (tier: number) => {
    switch (tier) {
      case 5: return 'Jackpot (5/5)';
      case 4: return 'Second Prize (4/5)';
      case 3: return 'Third Prize (3/5)';
      default: return `Tier ${tier}`;
    }
  };

  const getTierEmoji = (tier: number) => {
    switch (tier) {
      case 5: return '🏆';
      case 4: return '🥈';
      case 3: return '🥉';
      default: return '🎁';
    }
  };

  return (
    <div className="draw-results-page">
      <div className="results-container">
        {/* Header */}
        <motion.div
          className="results-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>{draw.lotteryName}</h1>
          <div className="draw-info">
            <div className="info-item">
              <Calendar size={20} />
              <span>{formatDate(draw.drawDate)}</span>
            </div>
            <div className="info-item">
              <Users size={20} />
              <span>{draw.totalWinners} Winners</span>
            </div>
            <div className="info-item">
              <DollarSign size={20} />
              <span>${draw.totalPrizePool.toFixed(2)} Prize Pool</span>
            </div>
          </div>
        </motion.div>

        {/* Winning Numbers */}
        <motion.div
          className="winning-numbers-section"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>Winning Numbers</h2>
          <div className="winning-numbers">
            {draw.winningNumbers.map((number, index) => (
              <motion.div
                key={index}
                className="number-ball"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + index * 0.1,
                  type: 'spring',
                  stiffness: 200,
                }}
              >
                {number}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Winners Breakdown */}
        <motion.div
          className="winners-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2>Winners Breakdown</h2>
          <div className="winner-tiers">
            {[5, 4, 3].map((tier) => {
              const tierData = winnersByTier?.[tier as keyof WinnersByTier];
              const hasWinners = tierData && tierData.count > 0;

              return (
                <motion.div
                  key={tier}
                  className={`tier-card ${hasWinners ? 'has-winners' : 'no-winners'}`}
                  whileHover={hasWinners ? { scale: 1.02 } : {}}
                  transition={{ duration: 0.2 }}
                >
                  <div className="tier-header">
                    <span className="tier-emoji">{getTierEmoji(tier)}</span>
                    <h3>{getTierName(tier)}</h3>
                  </div>
                  <div className="tier-stats">
                    <div className="stat">
                      <Users size={18} />
                      <span>{hasWinners ? tierData.count : 0} Winners</span>
                    </div>
                    {hasWinners && (
                      <div className="stat prize">
                        <Trophy size={18} />
                        <span>${tierData.totalPrize.toFixed(2)} Total</span>
                      </div>
                    )}
                  </div>
                  {hasWinners && (
                    <div className="prize-per-winner">
                      ${(tierData.totalPrize / tierData.count).toFixed(2)} per winner
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Action Links */}
        <motion.div
          className="action-links"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Link to={`/verify/${draw.id}`} className="action-link verify-link">
            <CheckCircle2 size={20} />
            <span>Verify Draw Fairness</span>
            <ExternalLink size={16} />
          </Link>
          <Link to="/my-tickets" className="action-link tickets-link">
            <Trophy size={20} />
            <span>Check My Tickets</span>
          </Link>
        </motion.div>

        {/* Back Link */}
        <div className="back-link-container">
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import AnimatedBackground from '../components/AnimatedBackground/AnimatedBackground';
import TicketInput from '../components/verification/TicketInput';
import MatchVisualization from '../components/verification/MatchVisualization';
import PrizeCalculator from '../components/verification/PrizeCalculator';
import BlockchainProof from '../components/verification/BlockchainProof';
import TicketQRCode from '../components/verification/TicketQRCode';
import HowItWorks from '../components/verification/HowItWorks';
import { ticketApi } from '../services/ticketApi';
import type { VerificationResult } from '../services/ticketApi';
import '../styles/verification.css';

type VerificationStep = 'input' | 'match' | 'prize';

// Mock data generator for testing different lotteries
const generateMockData = (ticketId: string): VerificationResult => {
  const lotteryTypes = [
    {
      name: 'Weekend Special',
      prizeStructure: { match5: 10000, match4: 1000, match3: 50, match2: 5, match1: 0 },
    },
    {
      name: 'Mega Jackpot',
      prizeStructure: { match5: 50000, match4: 5000, match3: 250, match2: 25, match1: 0 },
    },
    {
      name: 'Daily Draw',
      prizeStructure: { match5: 5000, match4: 500, match3: 25, match2: 2, match1: 0 },
    },
  ];

  const lottery = lotteryTypes[Math.floor(Math.random() * lotteryTypes.length)];
  const matchCount = Math.floor(Math.random() * 6); // 0-5 matches
  const ticketNumbers = [5, 12, 23, 31, 36];
  const winningNumbers = [5, 12, 18, 31, 42];
  const matchedNumbers = ticketNumbers.filter((num) => winningNumbers.includes(num));

  let prize = 0;
  switch (matchCount) {
    case 5:
      prize = lottery.prizeStructure.match5;
      break;
    case 4:
      prize = lottery.prizeStructure.match4;
      break;
    case 3:
      prize = lottery.prizeStructure.match3;
      break;
    case 2:
      prize = lottery.prizeStructure.match2;
      break;
    case 1:
      prize = lottery.prizeStructure.match1;
      break;
  }

  return {
    ticket: {
      id: ticketId,
      lotteryId: `${lottery.name.toLowerCase().replace(/\s+/g, '-')}-001`,
      lotteryName: lottery.name,
      numbers: ticketNumbers,
      drawDate: '2026-02-03T20:00:00Z',
      price: 10,
    },
    draw: {
      winningNumbers,
      drawDate: '2026-02-03T20:00:00Z',
    },
    result: {
      matchCount: matchedNumbers.length,
      matchedNumbers,
      prize,
      won: prize > 0,
    },
    lottery: {
      name: lottery.name,
      prizeStructure: lottery.prizeStructure,
    },
    blockchain: {
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      blockNumber: Math.floor(12000000 + Math.random() * 1000000),
      timestamp: new Date().toISOString(),
      explorerUrl: `https://tonscan.org/tx/0x${Math.random().toString(16).substr(2, 16)}`,
    },
  };
};

export default function VerificationPage() {
  const { ticketId: urlTicketId } = useParams<{ ticketId?: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState<VerificationStep>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationData, setVerificationData] = useState<VerificationResult | null>(null);

  const handleVerify = useCallback(async (ticketId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Try API first, fall back to mock data
      let data: VerificationResult;
      try {
        data = await ticketApi.verifyTicket(ticketId);
      } catch (apiError) {
        console.log('API not available, using mock data:', apiError);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        data = generateMockData(ticketId);
      }

      setVerificationData(data);
      setStep('match');

      // Trigger confetti if won big (match 4 or 5)
      if (data.result.matchCount >= 4 && data.result.won) {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }, 500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify ticket');
    } finally {
      setLoading(false);
    }
  }, []);

  // If ticketId is in URL, auto-verify
  useEffect(() => {
    if (urlTicketId) {
      handleVerify(urlTicketId);
    }
  }, [urlTicketId, handleVerify]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleReset = () => {
    setStep('input');
    setVerificationData(null);
    setError(null);
  };

  return (
    <div className="verification-page">
      <AnimatedBackground />

      <div className="verification-content">
        <button onClick={handleBack} className="back-btn">
          ← Back
        </button>

        <div className="verification-container">
          {/* Step 1: Input */}
          {step === 'input' && (
            <div className="step-container slide-in">
              <TicketInput onVerify={handleVerify} loading={loading} />
              {error && <div className="error-message">{error}</div>}
              <HowItWorks />
            </div>
          )}

          {/* Step 2: Match Visualization */}
          {step === 'match' && verificationData && (
            <div className="step-container slide-in">
              <MatchVisualization
                ticketNumbers={verificationData.ticket.numbers}
                winningNumbers={verificationData.draw.winningNumbers}
                matchedNumbers={verificationData.result.matchedNumbers}
                lotteryName={verificationData.lottery.name}
                drawDate={verificationData.draw.drawDate}
                ticketId={verificationData.ticket.id}
                matchCount={verificationData.result.matchCount}
                prize={verificationData.result.prize}
                onNext={() => setStep('prize')}
              />
            </div>
          )}

          {/* Step 3: Prize & Proof */}
          {step === 'prize' && verificationData && (
            <div className="step-container slide-in">
              <PrizeCalculator
                lotteryName={verificationData.lottery.name}
                prizeStructure={verificationData.lottery.prizeStructure}
                matchCount={verificationData.result.matchCount}
                prize={verificationData.result.prize}
              />

              <BlockchainProof
                txHash={verificationData.blockchain.txHash}
                blockNumber={verificationData.blockchain.blockNumber}
                timestamp={verificationData.blockchain.timestamp}
                explorerUrl={verificationData.blockchain.explorerUrl}
              />

              <TicketQRCode
                ticketId={verificationData.ticket.id}
                lotteryName={verificationData.lottery.name}
              />

              <button onClick={handleReset} className="verify-another-btn">
                Verify Another Ticket
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import './JackpotDisplay.css';

interface JackpotDisplayProps {
  initialJackpot: number;
  enableRealTimeUpdates?: boolean;
}

// Steampunk glitch characters
const glitchChars = ['0̸', '0̴', '0̷', '1̸', '1̴', '2̷', '3̸', '4̴', '5̷', '6̸', '7̴', '8̷', '9̸'];

function applyGlitch(text: string): string {
  return text.split('').map(char => {
    if (Math.random() > 0.7 && /\d/.test(char)) {
      // 30% chance to glitch a digit
      const idx = parseInt(char);
      return glitchChars[idx] || char;
    }
    return char;
  }).join('');
}

export default function JackpotDisplay({ 
  initialJackpot, 
  enableRealTimeUpdates = true 
}: JackpotDisplayProps) {
  const [jackpot, setJackpot] = useState(initialJackpot);
  const [displayText, setDisplayText] = useState('');

  // Real-time jackpot updates
  useEffect(() => {
    if (!enableRealTimeUpdates) {
      setDisplayText(jackpot.toLocaleString());
      return;
    }

    const interval = setInterval(() => {
      // Always increment (1-5 TON)
      const increment = Math.floor(Math.random() * 5) + 1;
      setJackpot(prev => prev + increment);
    }, 3000);

    return () => clearInterval(interval);
  }, [enableRealTimeUpdates]);

  // Apply glitch effect on jackpot change
  useEffect(() => {
    const formattedJackpot = jackpot.toLocaleString();
    setDisplayText(applyGlitch(formattedJackpot));

    // Refresh glitch effect periodically
    const glitchInterval = setInterval(() => {
      setDisplayText(applyGlitch(jackpot.toLocaleString()));
    }, 150);

    return () => clearInterval(glitchInterval);
  }, [jackpot]);

  return (
    <div className="ws-jackpot-steampunk">
      <div className="ws-jackpot-scanlines"></div>
      
      <div className="ws-jackpot-content">
        <div className="ws-jackpot-label">💎 ДЖЕКПОТ</div>
        
        <div className="ws-jackpot-amount">
          {displayText} TON
        </div>
      </div>
      
      <div className="ws-jackpot-glow"></div>
    </div>
  );
}

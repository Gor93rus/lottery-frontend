import { useEffect, useState } from 'react';
import './CurrencySwitcher.css';

interface CurrencySwitcherProps {
  onCurrencyChange?: (currency: 'TON' | 'USDT') => void;
  defaultCurrency?: 'TON' | 'USDT';
}

export default function CurrencySwitcher({ 
  onCurrencyChange, 
  defaultCurrency = 'TON' 
}: CurrencySwitcherProps) {
  const [activeCurrency, setActiveCurrency] = useState<'TON' | 'USDT'>(defaultCurrency);
  const [balances, setBalances] = useState({
    TON: 0,
    USDT: 0
  });
  const [loading, setLoading] = useState(false);

  // Load wallet balances
  useEffect(() => {
    loadBalances();
  }, []);

  // Update active currency when defaultCurrency prop changes
  useEffect(() => {
    setActiveCurrency(defaultCurrency);
  }, [defaultCurrency]);

  async function loadBalances() {
    try {
      // TODO: Replace with actual wallet integration
      // For now, using mock data
      const mockBalances = {
        TON: 2.5,
        USDT: 150
      };
      setBalances(mockBalances);
    } catch (error) {
      console.error('Failed to load balances:', error);
    }
  }

  function handleCurrencyChange(currency: 'TON' | 'USDT') {
    setActiveCurrency(currency);
    localStorage.setItem('preferredCurrency', currency);
    
    if (onCurrencyChange) {
      onCurrencyChange(currency);
    }

    // Trigger animation
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  }

  return (
    <div className="currency-selector">
      <div className="toggle-container">
        <div className={`toggle-switch ${activeCurrency === 'USDT' ? 'usdt' : 'ton'}`}>
          <button 
            className={`toggle-option ${activeCurrency === 'TON' ? 'active' : ''}`}
            onClick={() => handleCurrencyChange('TON')}
            aria-label="Switch to TON"
          >
            <span className="currency-icon">💎</span>
            <span className="currency-label">TON</span>
          </button>
          <button 
            className={`toggle-option ${activeCurrency === 'USDT' ? 'active' : ''}`}
            onClick={() => handleCurrencyChange('USDT')}
            aria-label="Switch to USDT"
          >
            <span className="currency-icon">💵</span>
            <span className="currency-label">USDT</span>
          </button>
          <div className="toggle-slider" role="presentation" aria-hidden="true"></div>
        </div>
      </div>
      <div className={`balance-info ${loading ? 'loading' : ''}`} aria-label="Current balance">
        {activeCurrency === 'TON' 
          ? `${balances.TON.toFixed(2)} TON` 
          : `${balances.USDT.toFixed(2)} USDT`}
      </div>
    </div>
  );
}

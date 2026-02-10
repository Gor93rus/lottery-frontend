import { useState, useEffect } from 'react';
import './CurrencyToggleMini.css';

export default function CurrencyToggleMini() {
  const [currency, setCurrency] = useState<'TON' | 'USDT'>('TON');

  useEffect(() => {
    const saved = localStorage.getItem('preferredCurrency') as 'TON' | 'USDT';
    if (saved) {
      setCurrency(saved);
      // Dispatch initial event on mount to sync with other components
      // This ensures MainScreen displays the correct currency on page load
      dispatchCurrencyChange(saved);
    }
  }, []);

  function dispatchCurrencyChange(newCurrency: 'TON' | 'USDT') {
    // Dispatch custom event
    const event = new CustomEvent('currencyChange', { 
      detail: { currency: newCurrency },
      bubbles: true,
      composed: true
    });
    window.dispatchEvent(event);
    
    console.log('🔄 Currency changed to:', newCurrency);
  }

  function handleToggle(newCurrency: 'TON' | 'USDT') {
    if (newCurrency === currency) return; // Prevent unnecessary updates
    
    console.group('💱 Currency Toggle');
    console.log('Previous:', currency);
    console.log('New:', newCurrency);
    console.log('Event dispatched:', new Date().toISOString());
    console.groupEnd();
    
    setCurrency(newCurrency);
    localStorage.setItem('preferredCurrency', newCurrency);
    dispatchCurrencyChange(newCurrency);
  }

  return (
    <div className="currency-toggle-mini">
      <button
        className={currency === 'TON' ? 'active' : ''}
        onClick={() => handleToggle('TON')}
        title="TON"
        aria-label="Switch to TON currency"
      >
        💎
      </button>
      <button
        className={currency === 'USDT' ? 'active' : ''}
        onClick={() => handleToggle('USDT')}
        title="USDT"
        aria-label="Switch to USDT currency"
      >
        💵
      </button>
    </div>
  );
}

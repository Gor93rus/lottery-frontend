import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTonAddress } from '@tonconnect/ui-react';
import { useWalletBalance } from '../hooks/useWalletBalance';
import AnimatedBackground from '../components/AnimatedBackground/AnimatedBackground';
import './SwapPage.css';

type Currency = 'TON' | 'USDT';

export default function SwapPage() {
  const navigate = useNavigate();
  const userAddress = useTonAddress();
  const { ton: tonBalance, usdt: usdtBalance } = useWalletBalance();
  
  const [fromCurrency, setFromCurrency] = useState<Currency>('TON');
  const [toCurrency, setToCurrency] = useState<Currency>('USDT');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [exchangeRate] = useState(5.2);

  function handleFlip() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  }

  function handleFromAmountChange(value: string) {
    setFromAmount(value);
    const numValue = parseFloat(value) || 0;
    if (fromCurrency === 'TON') {
      setToAmount((numValue * exchangeRate).toFixed(2));
    } else {
      setToAmount((numValue / exchangeRate).toFixed(2));
    }
  }

  function handleToAmountChange(value: string) {
    setToAmount(value);
    const numValue = parseFloat(value) || 0;
    if (toCurrency === 'USDT') {
      setFromAmount((numValue / exchangeRate).toFixed(2));
    } else {
      setFromAmount((numValue * exchangeRate).toFixed(2));
    }
  }

  async function handleSwap() {
    if (!userAddress) {
      alert('Подключите кошелёк');
      return;
    }
    
    const amount = parseFloat(fromAmount);
    if (!amount || amount <= 0) {
      alert('Введите корректную сумму');
      return;
    }

    const currentBalance = fromCurrency === 'TON' ? tonBalance : usdtBalance;
    if (amount > currentBalance) {
      alert('Недостаточно средств');
      return;
    }

    // TODO: Implement actual swap logic
    console.log('Swap:', amount, fromCurrency, '→', toAmount, toCurrency);
    alert('Обмен выполнен! (placeholder)');
  }

  return (
    <div className="swap-page">
      <AnimatedBackground />

      {/* Back button */}
      <button className="swap-back-button" onClick={() => navigate(-1)}>
        ← Назад
      </button>

      {/* Main swap card - COMPACT AND CENTERED */}
      <div className="swap-card">
        {/* Header */}
        <div className="swap-header">
          <h1 className="swap-title">💱 Обменник</h1>
          <p className="swap-subtitle">Быстрый обмен TON ↔ USDT</p>
        </div>

        {/* From section */}
        <div className="swap-input-section">
          <label className="swap-label">Отдаёте</label>
          <div className="swap-input-row">
            <input
              type="number"
              className="swap-input"
              value={fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
              placeholder="0.00"
            />
            <select
              className="swap-currency-select"
              value={fromCurrency}
              onChange={(e) => {
                const newCurrency = e.target.value as Currency;
                setFromCurrency(newCurrency);
                setToCurrency(newCurrency === 'TON' ? 'USDT' : 'TON');
              }}
            >
              <option value="TON">💎 TON</option>
              <option value="USDT">💵 USDT</option>
            </select>
          </div>
          <div className="swap-balance">
            Баланс: {(fromCurrency === 'TON' ? tonBalance : usdtBalance).toFixed(2)} {fromCurrency}
          </div>
        </div>

        {/* Flip button */}
        <button className="swap-flip-button" onClick={handleFlip} aria-label="Перевернуть">
          ⇅
        </button>

        {/* To section */}
        <div className="swap-input-section">
          <label className="swap-label">Получаете</label>
          <div className="swap-input-row">
            <input
              type="number"
              className="swap-input"
              value={toAmount}
              onChange={(e) => handleToAmountChange(e.target.value)}
              placeholder="0.00"
            />
            <select
              className="swap-currency-select"
              value={toCurrency}
              disabled
            >
              <option value="TON">💎 TON</option>
              <option value="USDT">💵 USDT</option>
            </select>
          </div>
          <div className="swap-balance">
            Баланс: {(toCurrency === 'TON' ? tonBalance : usdtBalance).toFixed(2)} {toCurrency}
          </div>
        </div>

        {/* Info */}
        <div className="swap-info">
          <div className="swap-info-item">
            <span>💱 Курс:</span>
            <span>1 TON = {exchangeRate.toFixed(2)} USDT</span>
          </div>
          <div className="swap-info-item">
            <span>⚡ Комиссия:</span>
            <span>0.1 TON (~2%)</span>
          </div>
          <div className="swap-info-item">
            <span>⏱️ Время:</span>
            <span>~30 секунд</span>
          </div>
        </div>

        {/* Submit button */}
        <button className="swap-submit-button" onClick={handleSwap}>
          💎 ОБМЕНЯТЬ
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import type { SendTransactionRequest } from '@tonconnect/sdk';
import { apiClient } from '../../lib/api/client';
import './SwapWidget.css';

interface Token {
  symbol: string;
  name: string;
  icon: string;
}

const TOKENS: Record<string, Token> = {
  TON: { symbol: 'TON', name: 'Toncoin', icon: '💎' },
  USDT: { symbol: 'USDT', name: 'Tether USD', icon: '💵' },
};

export default function SwapWidget() {
  const [tonConnectUI] = useTonConnectUI();
  const userWallet = useTonAddress();

  const [fromToken, setFromToken] = useState<Token>(TOKENS.TON);
  const [toToken, setToToken] = useState<Token>(TOKENS.USDT);
  const [fromAmount, setFromAmount] = useState<string>('10');
  const [toAmount, setToAmount] = useState<string>('0');
  const [rate, setRate] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [quote, setQuote] = useState<{
    from: string;
    to: string;
    amount: number;
    estimatedOutput: number;
    rate: number;
    priceImpact: number;
    fee: number;
  } | null>(null);

  // Load quote when amount changes
  useEffect(() => {
    if (parseFloat(fromAmount) > 0) {
      loadQuote();
    } else {
      setToAmount('0');
      setRate(0);
      setQuote(null);
    }
  }, [fromAmount, fromToken.symbol, toToken.symbol]);

  async function loadQuote() {
    try {
      setLoading(true);
      const response = await apiClient.getSwapQuote(
        fromToken.symbol,
        toToken.symbol,
        parseFloat(fromAmount)
      );

      setQuote(response.quote);
      setToAmount(response.quote.estimatedOutput.toString());
      setRate(response.quote.rate);
    } catch (error) {
      console.error('Failed to load quote:', error);
      setToAmount('0');
    } finally {
      setLoading(false);
    }
  }

  async function handleSwap() {
    if (!userWallet) {
      await tonConnectUI.openModal();
      return;
    }

    try {
      setSwapping(true);

      // Build transaction
      const response = await apiClient.buildSwapTransaction({
        from: fromToken.symbol,
        to: toToken.symbol,
        amount: parseFloat(fromAmount),
        userWallet,
        slippage: 0.5,
      });

      console.log('Swap transaction:', response.transaction);

      // Execute via TON Connect
      const result = await tonConnectUI.sendTransaction(response.transaction as SendTransactionRequest);

      if (result.boc) {
        alert(`✅ Обмен выполнен!\n\nВы получите примерно ${toAmount} ${toToken.symbol}\n\nПроверьте ваш кошелёк через несколько секунд.`);

        // Reset
        setFromAmount('');
        setToAmount('0');
        setQuote(null);
      }
    } catch (error: unknown) {
      console.error('Swap failed:', error);
      
      const errorMessage = error instanceof Error && error.message?.includes('cancel')
        ? 'Обмен отменён'
        : `Ошибка при обмене: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`;
      
      alert(errorMessage);
    } finally {
      setSwapping(false);
    }
  }

  function switchTokens() {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    
    // Swap amounts too
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  }

  const isDisabled = !userWallet || swapping || loading || parseFloat(fromAmount) <= 0;

  return (
    <motion.div
      className="swap-widget"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="swap-header">
        <h3>💱 Обмен валют</h3>
        {rate > 0 && (
          <span className="rate-badge">
            1 {fromToken.symbol} = {rate.toFixed(4)} {toToken.symbol}
          </span>
        )}
      </div>

      {/* From */}
      <div className="swap-field">
        <label>Отдаю</label>
        <div className="input-row">
          <input
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0.0"
            className="amount-input"
            min="0"
            step="0.1"
          />
          <div className="token-selector">
            {fromToken.icon} {fromToken.symbol}
          </div>
        </div>
      </div>

      {/* Switch button */}
      <div className="swap-switch">
        <button onClick={switchTokens} className="switch-btn" type="button">
          🔄
        </button>
      </div>

      {/* To */}
      <div className="swap-field">
        <label>Получу</label>
        <div className="input-row">
          <input
            type="text"
            value={loading ? 'Загрузка...' : toAmount}
            readOnly
            placeholder="0.0"
            className="amount-input readonly"
          />
          <div className="token-selector">
            {toToken.icon} {toToken.symbol}
          </div>
        </div>
      </div>

      {/* Details */}
      {quote && (
        <div className="swap-details">
          <div className="detail-row">
            <span>Курс:</span>
            <span>1 {fromToken.symbol} = {rate.toFixed(4)} {toToken.symbol}</span>
          </div>
          <div className="detail-row">
            <span>Комиссия DeDust:</span>
            <span>0.3% (~{quote.fee.toFixed(4)} {toToken.symbol})</span>
          </div>
          <div className="detail-row">
            <span>Проскальзывание:</span>
            <span>0.5%</span>
          </div>
          <div className="detail-row">
            <span>Мин. получите:</span>
            <span>{(quote.estimatedOutput * 0.995).toFixed(2)} {toToken.symbol}</span>
          </div>
          {quote.priceImpact > 1 && (
            <div className="detail-row warning">
              <span>⚠️ Влияние на цену:</span>
              <span>{quote.priceImpact.toFixed(2)}%</span>
            </div>
          )}
        </div>
      )}

      {/* Swap button */}
      <button
        className="swap-btn"
        onClick={handleSwap}
        disabled={isDisabled}
        type="button"
      >
        {!userWallet
          ? '🔗 Подключить кошелёк'
          : swapping
          ? '⏳ Обмен...'
          : '🔄 ОБМЕНЯТЬ'}
      </button>

      {/* Powered by */}
      <div className="swap-footer">
        <small>Powered by <strong>DeDust DEX</strong></small>
      </div>
    </motion.div>
  );
}

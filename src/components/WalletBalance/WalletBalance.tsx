import { motion } from 'framer-motion';
import { useWalletBalance } from '../../hooks/useWalletBalance';
import { useTonAddress } from '@tonconnect/ui-react';
import { formatAddress } from '../../services/tonService';
import { LOTTERY_CONFIG } from '../../config/contracts';
import './WalletBalance.css';

interface WalletBalanceProps {
  variant?: 'compact' | 'detailed';
  showAddress?: boolean;
}

export default function WalletBalance({ 
  variant = 'compact',
  showAddress = false 
}: WalletBalanceProps) {
  const userAddress = useTonAddress();
  const { ton, usdt, isLoading, refresh } = useWalletBalance();

  if (!userAddress) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <div className="wallet-balance-compact">
        <div className="balance-item">
          <span className="balance-icon">💎</span>
          <span className="balance-amount">
            {isLoading ? '...' : ton.toFixed(2)}
          </span>
          <span className="balance-currency">TON</span>
        </div>
        
        <div className="balance-item">
          <span className="balance-icon">💵</span>
          <span className="balance-amount">
            {isLoading ? '...' : usdt.toFixed(2)}
          </span>
          <span className="balance-currency">USDT</span>
        </div>
      </div>
    );
  }

  // Detailed variant for Profile page
  return (
    <div className="wallet-balance-detailed">
      {showAddress && (
        <div className="wallet-address-section">
          <span className="wallet-label">Wallet Address:</span>
          <div className="wallet-address">
            {formatAddress(userAddress, 8)}
            <button 
              className="copy-btn"
              onClick={() => {
                navigator.clipboard.writeText(userAddress);
                // Could add toast notification here
              }}
            >
              📋
            </button>
          </div>
        </div>
      )}

      <div className="balances-grid">
        <motion.div 
          className="balance-card ton-card"
          whileHover={{ scale: 1.02 }}
        >
          <div className="balance-card-header">
            <span className="balance-icon-large">💎</span>
            <span className="balance-name">TON</span>
          </div>
          <div className="balance-card-body">
            <div className="balance-main">
              {isLoading ? (
                <span className="balance-loading">Loading...</span>
              ) : (
                <>
                  <span className="balance-value">{ton.toFixed(4)}</span>
                  <span className="balance-symbol">TON</span>
                </>
              )}
            </div>
            <div className="balance-equivalent">
              ≈ ${(ton * LOTTERY_CONFIG.TON_TO_USDT_RATE).toFixed(2)} USD
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="balance-card usdt-card"
          whileHover={{ scale: 1.02 }}
        >
          <div className="balance-card-header">
            <span className="balance-icon-large">💵</span>
            <span className="balance-name">USDT</span>
            <span className="badge-mock">MOCK</span>
          </div>
          <div className="balance-card-body">
            <div className="balance-main">
              {isLoading ? (
                <span className="balance-loading">Loading...</span>
              ) : (
                <>
                  <span className="balance-value">{usdt.toFixed(2)}</span>
                  <span className="balance-symbol">USDT</span>
                </>
              )}
            </div>
            <div className="balance-equivalent">
              ≈ ${usdt.toFixed(2)} USD
            </div>
          </div>
        </motion.div>
      </div>

      <button className="refresh-btn" onClick={refresh} disabled={isLoading}>
        🔄 {isLoading ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>
  );
}

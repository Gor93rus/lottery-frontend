import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptic } from '../../hooks/useHaptic';
import './TONBalance.css';

interface TONBalanceProps {
  address?: string;
  onRefresh?: () => Promise<void>;
}

export const TONBalance = ({ address, onRefresh }: TONBalanceProps) => {
  const [balance, setBalance] = useState<number>(0);
  const [previousBalance, setPreviousBalance] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const { light, medium } = useHaptic();
  const balanceRef = useRef<number>(0);

  useEffect(() => {
    const savedBalance = localStorage.getItem('ton_balance');
    if (savedBalance) {
      const bal = parseFloat(savedBalance);
      setBalance(bal);
      balanceRef.current = bal;
    }

    fetchBalance();
  }, [address]);

  useEffect(() => {
    if (balance > previousBalance && previousBalance > 0) {
      setIsPulsing(true);
      medium();
      setTimeout(() => setIsPulsing(false), 1000);
    }
  }, [balance, previousBalance]);

  const fetchBalance = async () => {
    try {
      const mockBalance = 1234.56 + Math.random() * 10;
      
      setTimeout(() => {
        setPreviousBalance(balanceRef.current);
        setBalance(mockBalance);
        balanceRef.current = mockBalance;
        localStorage.setItem('ton_balance', mockBalance.toString());
      }, 500);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    light();
    setIsRefreshing(true);
    
    try {
      if (onRefresh) {
        await onRefresh();
      } else {
        await fetchBalance();
      }
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const handleClick = () => {
    setShowModal(true);
    medium();
  };

  const formatBalance = (value: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const shortenAddress = (addr: string): string => {
    if (!addr) return '';
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  const copyAddress = async () => {
    if (!address) return;
    
    try {
      await navigator.clipboard.writeText(address);
      light();
      
      const toast = document.createElement('div');
      toast.className = 'copy-toast';
      toast.textContent = 'Адрес скопирован!';
      document.body.appendChild(toast);
      
      setTimeout(() => toast.classList.add('copy-toast--show'), 100);
      setTimeout(() => {
        toast.classList.remove('copy-toast--show');
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 2000);
    } catch (error) {
      console.error('Copy error:', error);
    }
  };

  if (!address) {
    return null;
  }

  return (
    <>
      <motion.div
        className={`ton-balance ${isPulsing ? 'ton-balance--pulse' : ''}`}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="ton-balance-icon">💎</div>
        
        <div className="ton-balance-info">
          <div className="ton-balance-amount">
            <AnimateBalance value={balance} />
            <span className="ton-currency">TON</span>
          </div>
          <div className="ton-balance-address">
            {shortenAddress(address)}
          </div>
        </div>

        <button
          className={`ton-refresh ${isRefreshing ? 'ton-refresh--spinning' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            handleRefresh();
          }}
        >
          🔄
        </button>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="ton-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="ton-modal-content"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ton-modal-header">
                <h3>Кошелек TON</h3>
                <button
                  className="ton-modal-close"
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="ton-modal-body">
                <div className="ton-balance-large">
                  <div className="ton-icon-large">💎</div>
                  <h2 className="balance-value">
                    {formatBalance(balance)} <span>TON</span>
                  </h2>
                  <p className="balance-label">Доступный баланс</p>
                </div>

                <div className="ton-address-section">
                  <label>Адрес кошелька</label>
                  <div className="ton-address-box" onClick={copyAddress}>
                    <span className="address-text">{address}</span>
                    <span className="copy-icon">📋</span>
                  </div>
                  <p className="address-hint">Нажмите, чтобы скопировать</p>
                </div>

                <div className="ton-actions">
                  <button className="ton-action-btn ton-action-btn--primary">
                    ➕ Пополнить
                  </button>
                  <button className="ton-action-btn">
                    📤 Отправить
                  </button>
                  <button 
                    className="ton-action-btn"
                    onClick={handleRefresh}
                  >
                    🔄 Обновить
                  </button>
                </div>

                <div className="ton-stats">
                  <div className="stat-item">
                    <span className="stat-label">Всего заработано</span>
                    <span className="stat-value">+{formatBalance(balance * 0.15)} TON</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Всего потрачено</span>
                    <span className="stat-value">-{formatBalance(balance * 0.32)} TON</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const AnimateBalance = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepValue = (value - displayValue) / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setDisplayValue(prev => {
        const newValue = prev + stepValue;
        if (currentStep >= steps) {
          clearInterval(interval);
          return value;
        }
        return newValue;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <span className="balance-number">
      {new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(displayValue)}
    </span>
  );
};

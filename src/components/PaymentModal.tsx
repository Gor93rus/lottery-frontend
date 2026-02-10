/**
 * Payment Modal Component
 * Handles currency selection (TON/USDT) for lottery ticket purchases
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet } from 'lucide-react';
import './PaymentModal.css';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCurrency: (currency: 'TON' | 'USDT') => void;
  ticketPrice: number;
  ticketCount: number;
  lotteryName: string;
}

export function PaymentModal({
  isOpen,
  onClose,
  onSelectCurrency,
  ticketPrice,
  ticketCount,
  lotteryName,
}: PaymentModalProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<'TON' | 'USDT'>('TON');
  
  const totalAmount = ticketPrice * ticketCount;
  
  // TODO: Fetch exchange rate from API - currently using fallback
  // Consider: apiClient.getExchangeRate('TON', 'USDT') from existing API
  const tonToUsdtRate = 5.2;
  
  const amounts = {
    TON: totalAmount,
    USDT: totalAmount * tonToUsdtRate,
  };

  const handleSelectCurrency = (currency: 'TON' | 'USDT') => {
    setSelectedCurrency(currency);
  };

  const handleConfirm = () => {
    onSelectCurrency(selectedCurrency);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="payment-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="payment-modal-content"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="payment-modal-header">
            <h2>Выберите валюту</h2>
            <button className="payment-modal-close" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="payment-modal-body">
            <div className="payment-lottery-info">
              <h3>{lotteryName}</h3>
              <p>{ticketCount} {ticketCount === 1 ? 'билет' : 'билета'}</p>
            </div>

            <div className="payment-currency-options">
              <motion.div
                className={`payment-currency-card ${selectedCurrency === 'TON' ? 'selected' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectCurrency('TON')}
              >
                <div className="payment-currency-icon">
                  <Wallet size={32} />
                </div>
                <div className="payment-currency-info">
                  <h4>TON</h4>
                  <p className="payment-currency-amount">{amounts.TON.toFixed(2)} TON</p>
                  <p className="payment-currency-note">Нативная валюта TON</p>
                </div>
                {selectedCurrency === 'TON' && (
                  <motion.div
                    className="payment-currency-check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                className={`payment-currency-card ${selectedCurrency === 'USDT' ? 'selected' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectCurrency('USDT')}
              >
                <div className="payment-currency-icon">
                  <Wallet size={32} />
                </div>
                <div className="payment-currency-info">
                  <h4>USDT</h4>
                  <p className="payment-currency-amount">{amounts.USDT.toFixed(2)} USDT</p>
                  <p className="payment-currency-note">Стабильная монета</p>
                </div>
                {selectedCurrency === 'USDT' && (
                  <motion.div
                    className="payment-currency-check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>

          <div className="payment-modal-footer">
            <motion.button
              className="payment-btn payment-btn-cancel"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
            >
              Отмена
            </motion.button>
            <motion.button
              className="payment-btn payment-btn-confirm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirm}
            >
              Оплатить {amounts[selectedCurrency].toFixed(2)} {selectedCurrency}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { toNano } from '@ton/core';
import { useSound } from '../../Advanced/SoundManager';
import { LOTTERY_CONFIG } from '../../../config/lottery';
import { LOTTERY_CONFIG as CONTRACT_CONFIG } from '../../../config/contracts';
import type { CartTicket } from '../../../hooks/useTicketCart';
import { ticketApi } from '../../../services/ticketApi';
import { useJettonTransaction } from '../../../hooks/useJettonTransaction';
import { useWalletBalance } from '../../../hooks/useWalletBalance';
import './TicketCart.css';

type Currency = 'TON' | 'USDT';

interface TicketCartProps {
  tickets: CartTicket[];
  onRemoveTicket: (id: string) => void;
  onClearCart: () => void;
  subtotal: number;
  discount: number;
  discountPercent: number;
  total: number;
  onPurchase: (txBoc?: string) => Promise<void> | void;
  isOpen: boolean;
  onToggle: () => void;
  lotterySlug?: string;
}

export default function TicketCart({
  tickets,
  onRemoveTicket,
  onClearCart,
  subtotal,
  discount,
  discountPercent,
  total,
  onPurchase,
  isOpen,
  onToggle,
  lotterySlug = 'weekend-special'
}: TicketCartProps) {
  const { t } = useTranslation();
  const { playSound } = useSound();
  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('TON');
  
  // Jetton transaction hook
  const { buyLotteryTicketWithUsdt } = useJettonTransaction();
  
  // Wallet balances (both TON and USDT)
  const { ton: tonBalance, usdt: usdtBalance } = useWalletBalance();
  
  // Calculate prices in USDT
  const usdtSubtotal = subtotal * CONTRACT_CONFIG.TON_TO_USDT_RATE;
  const usdtDiscount = discount * CONTRACT_CONFIG.TON_TO_USDT_RATE;
  const usdtTotal = total * CONTRACT_CONFIG.TON_TO_USDT_RATE;

  const handleRemove = (id: string) => {
    onRemoveTicket(id);
    playSound('click');
  };

  const handleClear = () => {
    onClearCart();
    playSound('click');
  };

  const handlePurchase = async () => {
    if (!userAddress || tickets.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      let result;
      
      if (selectedCurrency === 'USDT') {
        // Check USDT balance
        if (usdtBalance < usdtTotal) {
          throw new Error(`Insufficient USDT balance. Need ${usdtTotal.toFixed(2)} USDT, have ${usdtBalance.toFixed(2)} USDT`);
        }
        
        // Send USDT via Jetton transfer
        result = await buyLotteryTicketWithUsdt(usdtTotal, LOTTERY_CONFIG.WALLET_ADDRESS);
        console.log('USDT transaction sent:', result);
      } else {
        // Send TON
        const transaction = {
          validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes
          messages: [
            {
              address: LOTTERY_CONFIG.WALLET_ADDRESS,
              amount: toNano(total).toString(),
            },
          ],
        };

        const tonResult = await tonConnectUI.sendTransaction(transaction);
        result = tonResult.boc;
        console.log('TON transaction sent:', result);
      }
      
      // Save tickets to database
      try {
        const ticketPrice = (selectedCurrency === 'USDT' ? usdtTotal : total) / tickets.length;
        const ticketsToSave = tickets.map((ticket) => ({
          lotterySlug,
          numbers: ticket.numbers,
          txHash: result,
          walletAddress: userAddress,
          price: ticketPrice,
          currency: selectedCurrency,
        }));

        await ticketApi.saveTickets(ticketsToSave);
        console.log('Tickets saved to database');
      } catch (saveError) {
        console.error('Failed to save tickets to DB:', saveError);
        // Don't fail the purchase - transaction already went through
      }
      
      // Call onPurchase callback with transaction BOC for backend registration
      if (onPurchase) {
        await onPurchase(result);
      }
      
      // Clear cart after successful backend registration
      onClearCart();
      
      // Show success message
      playSound('win');
      alert('✅ ' + t('ticketsPurchasedSuccess', { defaultValue: 'Билеты успешно куплены!' }));
      
      // Close cart after successful purchase
      onToggle();
      
    } catch (err) {
      console.error('Transaction failed:', err);
      const errorMessage = err instanceof Error ? err.message : t('transactionFailed', { defaultValue: 'Transaction failed' });
      setError(errorMessage);
      playSound('lose');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await tonConnectUI.openModal();
      playSound('click');
    } catch (error) {
      console.error('Failed to open wallet modal:', error);
    }
  };

  return (
    <>
      {/* Floating Cart Button */}
      <motion.button
        className="cart-toggle-btn"
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="cart-icon">🛒</span>
        {tickets.length > 0 && (
          <motion.span
            className="cart-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={tickets.length}
          >
            {tickets.length}
          </motion.span>
        )}
      </motion.button>

      {/* Cart Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="cart-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
            />

            {/* Cart Panel */}
            <motion.div
              className="cart-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {/* Header */}
              <div className="cart-header">
                <h2 className="cart-title">
                  🛒 {t('cart', { defaultValue: 'Cart' })} ({tickets.length})
                </h2>
                <button className="cart-close-btn" onClick={onToggle}>
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="cart-content">
                {tickets.length === 0 ? (
                  <div className="cart-empty">
                    <div className="empty-icon">🎫</div>
                    <p className="empty-text">
                      {t('cartEmpty', { defaultValue: 'Cart is empty' })}
                    </p>
                    <p className="empty-subtext">
                      {t('addTicketsToCart', { 
                        defaultValue: 'Select numbers and add tickets to cart' 
                      })}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Tickets List */}
                    <div className="cart-tickets">
                      <AnimatePresence>
                        {tickets.map((ticket, index) => (
                          <motion.div
                            key={ticket.id}
                            className="cart-ticket-item"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="ticket-info">
                              <span className="ticket-label">
                                {t('ticket', { defaultValue: 'Ticket' })} {index + 1}:
                              </span>
                              <div className="ticket-numbers">
                                {ticket.numbers.map((num) => (
                                  <span key={num} className="ticket-ball">
                                    {num}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <button
                              className="ticket-remove-btn"
                              onClick={() => handleRemove(ticket.id)}
                              title={t('remove', { defaultValue: 'Remove' })}
                            >
                              🗑️
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Price Summary */}
                    <div className="cart-summary">
                      {/* Currency Selector */}
                      <div className="currency-selector" style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '12px',
                        padding: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px'
                      }}>
                        <button
                          onClick={() => {
                            setSelectedCurrency('TON');
                            playSound('click');
                          }}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: selectedCurrency === 'TON' ? '2px solid #0088cc' : '1px solid rgba(255,255,255,0.2)',
                            backgroundColor: selectedCurrency === 'TON' ? 'rgba(0, 136, 204, 0.2)' : 'transparent',
                            color: selectedCurrency === 'TON' ? '#0088cc' : '#fff',
                            cursor: 'pointer',
                            fontWeight: selectedCurrency === 'TON' ? 'bold' : 'normal',
                            transition: 'all 0.2s'
                          }}
                        >
                          💎 TON
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCurrency('USDT');
                            playSound('click');
                          }}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: selectedCurrency === 'USDT' ? '2px solid #26a17b' : '1px solid rgba(255,255,255,0.2)',
                            backgroundColor: selectedCurrency === 'USDT' ? 'rgba(38, 161, 123, 0.2)' : 'transparent',
                            color: selectedCurrency === 'USDT' ? '#26a17b' : '#fff',
                            cursor: 'pointer',
                            fontWeight: selectedCurrency === 'USDT' ? 'bold' : 'normal',
                            transition: 'all 0.2s'
                          }}
                        >
                          💵 USDT
                        </button>
                      </div>

                      {/* Balance Display */}
                      {userAddress && (
                        <div style={{
                          fontSize: '0.875rem',
                          color: 'rgba(255, 255, 255, 0.7)',
                          marginBottom: '12px',
                          padding: '6px 8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '4px'
                        }}>
                          {selectedCurrency === 'USDT' ? (
                            <>💵 {t('balance', { defaultValue: 'Balance' })}: {usdtBalance.toFixed(2)} USDT</>
                          ) : (
                            <>💎 {t('balance', { defaultValue: 'Balance' })}: {tonBalance.toFixed(4)} TON</>
                          )}
                        </div>
                      )}

                      <div className="summary-row">
                        <span className="summary-label">
                          {t('subtotal', { defaultValue: 'Subtotal' })}:
                        </span>
                        <span className="summary-value">
                          {selectedCurrency === 'USDT' 
                            ? `${usdtSubtotal.toFixed(2)} USDT` 
                            : `${subtotal.toFixed(2)} TON`}
                        </span>
                      </div>

                      {discount > 0 && (
                        <motion.div
                          className="summary-row discount-row"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <span className="summary-label">
                            {t('discount', { defaultValue: 'Discount' })} {discountPercent}%:
                          </span>
                          <span className="summary-value discount-value">
                            -{selectedCurrency === 'USDT' 
                              ? `${usdtDiscount.toFixed(2)} USDT` 
                              : `${discount.toFixed(2)} TON`} 🎁
                          </span>
                        </motion.div>
                      )}

                      <div className="summary-divider"></div>

                      <div className="summary-row total-row">
                        <span className="summary-label">
                          {t('total', { defaultValue: 'Total' })}:
                        </span>
                        <span className="summary-total">
                          {selectedCurrency === 'USDT' 
                            ? `${usdtTotal.toFixed(2)} USDT` 
                            : `${total.toFixed(2)} TON`}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="cart-actions">
                      <button
                        className="clear-cart-btn"
                        onClick={handleClear}
                        disabled={isLoading}
                      >
                        {t('clearCart', { defaultValue: 'Clear Cart' })}
                      </button>
                      {!userAddress ? (
                        <motion.button
                          className="connect-wallet-cart-btn"
                          onClick={handleConnectWallet}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          🔗 {t('connectWalletToBuy', { defaultValue: 'Подключить кошелёк для покупки' })}
                        </motion.button>
                      ) : (
                        <>
                          {error && (
                            <div className="cart-error-message" style={{ 
                              color: '#ff4444', 
                              padding: '8px', 
                              marginBottom: '8px',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(255, 68, 68, 0.1)',
                              fontSize: '0.875rem'
                            }}>
                              ⚠️ {error}
                            </div>
                          )}
                          <motion.button
                            className="purchase-cart-btn"
                            onClick={handlePurchase}
                            disabled={isLoading || tickets.length === 0}
                            whileHover={!isLoading ? { scale: 1.02 } : {}}
                            whileTap={!isLoading ? { scale: 0.98 } : {}}
                          >
                            {isLoading ? (
                              <>⏳ {t('processing', { defaultValue: 'Обработка...' })}</>
                            ) : (
                              <>
                                {selectedCurrency === 'USDT' ? '💵' : '💎'} {t('buyTickets', { defaultValue: 'Купить билеты' })} — {selectedCurrency === 'USDT' 
                                  ? `${usdtTotal.toFixed(2)} USDT` 
                                  : `${total.toFixed(2)} TON`}
                              </>
                            )}
                          </motion.button>
                        </>
                      )}
                    </div>

                    {/* Discount Info */}
                    {tickets.length >= 5 && (
                      <motion.div
                        className="discount-info"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        🎉 {t('discountApplied', { 
                          defaultValue: '5% discount applied!' 
                        })}
                      </motion.div>
                    )}
                    {tickets.length >= 3 && tickets.length < 5 && (
                      <motion.div
                        className="discount-hint"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        💡 {t('discountHint', { 
                          defaultValue: 'Add {{count}} more ticket(s) for 5% discount',
                          count: 5 - tickets.length
                        })}
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

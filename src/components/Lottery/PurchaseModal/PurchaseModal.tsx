import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { toNano } from '@ton/core';
import confetti from 'canvas-confetti';
import { useSound } from '../../Advanced/SoundManager';
import { LOTTERY_CONFIG } from '../../../config/lottery';
import type { CartTicket } from '../../../hooks/useTicketCart';
import { ticketApi } from '../../../services/ticketApi';
import './PurchaseModal.css';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  lotteryName: string;
  lotterySlug?: string;
  selectedNumbers?: number[];
  tickets?: CartTicket[];
  ticketPrice: number;
  discount?: number;
  total?: number;
  onPurchase: (txBoc?: string) => Promise<void>;
  onConnectWallet: () => void;
}

export default function PurchaseModal({
  isOpen,
  onClose,
  lotteryName,
  lotterySlug = 'weekend-special',
  selectedNumbers,
  tickets,
  ticketPrice,
  discount = 0,
  total,
  onPurchase,
  onConnectWallet
}: PurchaseModalProps) {
  const { t } = useTranslation();
  const { playSound } = useSound();
  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
      setError(null);
      setSuccess(false);
      setTxHash(null);
    }
  }, [isOpen]);

  const handlePurchase = async () => {
    if (!userAddress) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const finalTotal = total || ticketPrice;
      
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes
        messages: [
          {
            address: LOTTERY_CONFIG.WALLET_ADDRESS,
            amount: toNano(finalTotal).toString(),
            // Optional: add payload with ticket numbers
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      
      console.log('Transaction sent:', result.boc);
      setTxHash(result.boc);
      
      // Save ticket(s) to database
      try {
        if (isMultipleTickets && tickets && tickets.length > 0) {
          // Save multiple tickets
          const individualPrice = finalTotal / tickets.length;
          const ticketsToSave = tickets.map((ticket) => ({
            lotterySlug,
            numbers: ticket.numbers,
            txHash: result.boc,
            walletAddress: userAddress,
            price: individualPrice,
          }));

          await ticketApi.saveTickets(ticketsToSave);
          console.log('Tickets saved to database');
        } else if (selectedNumbers) {
          // Save single ticket
          await ticketApi.saveTicket({
            lotterySlug,
            numbers: selectedNumbers,
            txHash: result.boc,
            walletAddress: userAddress,
            price: ticketPrice,
          });
          console.log('Ticket saved to database');
        }
      } catch (saveError) {
        console.error('Failed to save ticket(s) to DB:', saveError);
        // Don't fail the purchase - transaction already went through
      }
      
      // Call onPurchase callback with transaction BOC for backend registration
      if (onPurchase) {
        await onPurchase(result.boc);
      }
      
      setSuccess(true);
      playSound('win');
      
      // Confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      console.error('Transaction failed:', err);
      const errorMessage = err instanceof Error ? err.message : t('purchaseError', { defaultValue: 'Ошибка покупки билета' });
      setError(errorMessage);
      playSound('lose');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const isMultipleTickets = tickets && tickets.length > 0;
  const displayTickets = isMultipleTickets ? tickets : (selectedNumbers ? [{ id: 'single', numbers: selectedNumbers, addedAt: new Date() }] : []);
  const finalTotal = total || ticketPrice;

  return (
    <div className="purchase-modal-overlay" onClick={onClose}>
      <div className="purchase-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        {!success ? (
          <>
            <h2 className="modal-title">
              {isMultipleTickets 
                ? t('purchaseTickets', { defaultValue: 'Purchase Tickets' })
                : t('purchaseTicket', { defaultValue: 'Purchase Ticket' })}
            </h2>

            <div className="modal-content">
              {/* Lottery Info */}
              <div className="purchase-summary">
                <div className="summary-item">
                  <span className="summary-label">
                    {t('lottery', { defaultValue: 'Lottery' })}
                  </span>
                  <span className="summary-value">{lotteryName}</span>
                </div>

                {isMultipleTickets ? (
                  <>
                    <div className="summary-item">
                      <span className="summary-label">
                        {t('tickets', { defaultValue: 'Tickets' })}
                      </span>
                      <span className="summary-value">{tickets.length}</span>
                    </div>

                    <div className="tickets-list-modal">
                      {displayTickets.slice(0, 3).map((ticket, index) => (
                        <div key={ticket.id} className="ticket-item-modal">
                          <span className="ticket-label-modal">
                            {t('ticket', { defaultValue: 'Ticket' })} {index + 1}:
                          </span>
                          <div className="summary-numbers">
                            {ticket.numbers.map((num) => (
                              <span key={num} className="summary-ball">{num}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                      {tickets.length > 3 && (
                        <div className="more-tickets-indicator">
                          +{tickets.length - 3} {t('moreTickets', { defaultValue: 'ещё' })}
                        </div>
                      )}
                    </div>

                    <div className="summary-item">
                      <span className="summary-label">
                        {t('subtotal', { defaultValue: 'Subtotal' })}
                      </span>
                      <span className="summary-value">{(tickets.length * ticketPrice).toFixed(2)} TON</span>
                    </div>

                    {discount > 0 && (
                      <div className="summary-item discount-item">
                        <span className="summary-label">
                          {t('discount', { defaultValue: 'Discount' })} 5%
                        </span>
                        <span className="summary-value discount-text">
                          -{discount.toFixed(2)} TON 🎁
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="summary-item">
                    <span className="summary-label">
                      {t('selectedNumbers', { defaultValue: 'Selected Numbers' })}
                    </span>
                    <div className="summary-numbers">
                      {selectedNumbers?.map((num) => (
                        <span key={num} className="summary-ball">{num}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="summary-item total-item">
                  <span className="summary-label">
                    {t('total', { defaultValue: 'Total' })}
                  </span>
                  <span className="summary-total">{finalTotal.toFixed(2)} TON</span>
                </div>
              </div>

              {/* Wallet Section */}
              {!userAddress ? (
                <div className="wallet-section">
                  <p className="wallet-info">
                    {t('connectWalletInfo', { 
                      defaultValue: 'Connect your wallet to purchase ticket' 
                    })}
                  </p>
                  <button className="connect-wallet-btn" onClick={onConnectWallet}>
                    {t('connectWallet', { defaultValue: 'Connect Wallet' })}
                  </button>
                </div>
              ) : (
                <div className="wallet-section">
                  <div className="wallet-connected">
                    <span className="wallet-label">
                      {t('wallet', { defaultValue: 'Wallet' })}
                    </span>
                    <span className="wallet-address">{truncateAddress(userAddress)}</span>
                  </div>

                  {error && (
                    <div className="error-message">
                      ⚠️ {error}
                    </div>
                  )}

                  <button
                    className="purchase-btn"
                    onClick={handlePurchase}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner"></span>
                        {t('processing', { defaultValue: 'Обработка...' })}
                      </>
                    ) : (
                      <>
                        🎫 {isMultipleTickets 
                          ? `${t('buyTickets', { defaultValue: 'Купить билеты' })} — ${finalTotal.toFixed(2)} TON`
                          : `${t('buyTicketFor', { defaultValue: 'Купить билет за' })} ${finalTotal.toFixed(2)} TON`}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="success-state">
            <div className="success-icon">🎉</div>
            <h2 className="success-title">
              {isMultipleTickets
                ? t('purchaseSuccessMultiple', { defaultValue: 'Tickets Purchased Successfully!' })
                : t('purchaseSuccess', { defaultValue: 'Ticket Purchased Successfully!' })}
            </h2>
            <p className="success-message">
              {isMultipleTickets
                ? t('ticketsInYourAccount', { 
                    defaultValue: 'Tickets added to your account. Good luck!' 
                  })
                : t('ticketInYourAccount', { 
                    defaultValue: 'Ticket added to your account. Good luck!' 
                  })}
            </p>
            {txHash && (
              <div className="tx-hash">
                <span className="tx-label">Transaction:</span>
                <span className="tx-value">{truncateAddress(txHash)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

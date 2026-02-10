import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { useHaptic } from '../../hooks/useHaptic';
import { shareContent, downloadFile } from '../../utils/shareUtils';
import { createScratchCanvas, scratchAt } from '../../utils/canvas';
import './InteractiveTicket.css';

interface TicketData {
  id: string;
  number: string;
  lotteryName: string;
  lotteryType: 'instant' | 'regular';
  purchaseDate: Date;
  drawDate?: Date;
  numbers: number[];
  cost: number;
  transactionHash: string;
  status: 'active' | 'won' | 'lost';
  prize?: number;
}

interface InteractiveTicketProps {
  ticket: TicketData;
  isPurchaseAnimation?: boolean;
  onAnimationComplete?: () => void;
}

export const InteractiveTicket = ({
  ticket,
  isPurchaseAnimation = false,
  onAnimationComplete
}: InteractiveTicketProps) => {
  const [showModal, setShowModal] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const [isRevealed, setIsRevealed] = useState(ticket.lotteryType !== 'instant');
  const [showEnvelope, setShowEnvelope] = useState(ticket.lotteryType === 'regular');
  const [isEnvelopeOpening, setIsEnvelopeOpening] = useState(false);
  
  const ticketRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { light, medium, heavy } = useHaptic();

  useEffect(() => {
    if (isPurchaseAnimation) {
      const timer = setTimeout(() => {
        triggerConfetti();
        heavy();
        showToast();
        onAnimationComplete?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isPurchaseAnimation]);

  useEffect(() => {
    if (canvasRef.current && ticket.lotteryType === 'instant' && !isRevealed) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scratchCanvas = createScratchCanvas(rect.width, rect.height);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(scratchCanvas, 0, 0);
      }
    }
  }, [canvasRef.current, ticket.lotteryType, isRevealed]);

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const showToast = () => {
    const toast = document.createElement('div');
    toast.className = 'ticket-toast';
    toast.textContent = '🎫 Билет успешно куплен!';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('ticket-toast--show');
    }, 100);

    setTimeout(() => {
      toast.classList.remove('ticket-toast--show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  const handleTicketClick = () => {
    setShowModal(true);
    medium();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsFlipped(false);
    light();
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    medium();
  };

  const handleScratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isRevealed || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let x: number, y: number;
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    const progress = scratchAt(canvas, x, y, 30);

    if (progress > 70 && !isRevealed) {
      setIsRevealed(true);
      setIsScratching(false);
      
      if (ticket.status === 'won') {
        triggerConfetti();
        heavy();
      } else {
        light();
      }
    }
  };

  const handleOpenEnvelope = () => {
    setIsEnvelopeOpening(true);
    heavy();
    
    setTimeout(() => {
      setShowEnvelope(false);
      if (ticket.status === 'won') {
        triggerConfetti();
      }
    }, 1200);
  };

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    
    try {
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: null,
        scale: 2
      });
      
      canvas.toBlob((blob) => {
        if (blob) {
          downloadFile(blob, `ticket-${ticket.number}.png`);
          light();
        }
      });
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleShare = async () => {
    const text = `Мой билет лотереи ${ticket.lotteryName} #${ticket.number}`;
    const url = `${window.location.origin}/ticket/${ticket.id}`;
    
    const success = await shareContent({ title: 'Мой билет', text, url });
    if (success) {
      light();
    }
  };

  return (
    <>
      <motion.div
        className="interactive-ticket"
        onClick={handleTicketClick}
        initial={isPurchaseAnimation ? { y: -500, rotate: -180, opacity: 0 } : false}
        animate={isPurchaseAnimation ? { 
          y: 0, 
          rotate: 0, 
          opacity: 1,
          transition: {
            type: 'spring',
            damping: 15,
            stiffness: 100
          }
        } : {}}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="ticket-card">
          <div className="ticket-header">
            <span className="ticket-number">#{ticket.number}</span>
            <span className={`ticket-status ticket-status--${ticket.status}`}>
              {ticket.status === 'won' ? '🏆 Выигрыш' : 
               ticket.status === 'lost' ? '❌ Проигрыш' : 
               '⏳ Активный'}
            </span>
          </div>
          
          <h4 className="ticket-lottery">{ticket.lotteryName}</h4>
          
          <div className="ticket-numbers">
            {ticket.numbers.map((num, idx) => (
              <span key={idx} className="ticket-number-ball">{num}</span>
            ))}
          </div>

          <div className="ticket-footer">
            <span className="ticket-cost">{ticket.cost} TON</span>
            {ticket.drawDate && (
              <span className="ticket-date">
                {ticket.drawDate.toLocaleDateString('ru-RU')}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="ticket-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="ticket-modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {showEnvelope && (
                <motion.div
                  className={`envelope ${isEnvelopeOpening ? 'envelope--opening' : ''}`}
                  onClick={handleOpenEnvelope}
                >
                  <div className="envelope-flap"></div>
                  <div className="envelope-body"></div>
                  <p className="envelope-text">Нажмите, чтобы открыть</p>
                </motion.div>
              )}

              {!showEnvelope && (
                <>
                  <motion.div
                    className={`ticket-detail ${isFlipped ? 'ticket-detail--flipped' : ''}`}
                    ref={ticketRef}
                  >
                    <div className="ticket-detail-front">
                      <div className="ticket-detail-header">
                        <h3>{ticket.lotteryName}</h3>
                        <span className="ticket-detail-number">#{ticket.number}</span>
                      </div>

                      {ticket.lotteryType === 'instant' && !isRevealed && (
                        <div className="scratch-area">
                          <canvas
                            ref={canvasRef}
                            width={300}
                            height={200}
                            className="scratch-canvas"
                            onMouseDown={() => setIsScratching(true)}
                            onMouseUp={() => setIsScratching(false)}
                            onMouseMove={isScratching ? handleScratch : undefined}
                            onTouchStart={() => setIsScratching(true)}
                            onTouchEnd={() => setIsScratching(false)}
                            onTouchMove={isScratching ? handleScratch : undefined}
                          />
                          <div className="scratch-content">
                            {ticket.status === 'won' ? (
                              <div className="scratch-result scratch-result--win">
                                <h2>🎉 ВЫИГРЫШ!</h2>
                                <p className="prize-amount">{ticket.prize} TON</p>
                              </div>
                            ) : (
                              <div className="scratch-result">
                                <p>Попробуйте еще раз!</p>
                              </div>
                            )}
                          </div>
                          <p className="scratch-hint">Сотрите покрытие</p>
                        </div>
                      )}

                      {(ticket.lotteryType === 'regular' || isRevealed) && (
                        <>
                          <div className="ticket-detail-numbers">
                            {ticket.numbers.map((num, idx) => (
                              <motion.span
                                key={idx}
                                className="number-ball-large"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: idx * 0.1 }}
                              >
                                {num}
                              </motion.span>
                            ))}
                          </div>

                          <div className="ticket-detail-info">
                            <div className="info-row">
                              <span className="info-label">Куплен:</span>
                              <span className="info-value">
                                {ticket.purchaseDate.toLocaleString('ru-RU')}
                              </span>
                            </div>
                            {ticket.drawDate && (
                              <div className="info-row">
                                <span className="info-label">Розыгрыш:</span>
                                <span className="info-value">
                                  {ticket.drawDate.toLocaleString('ru-RU')}
                                </span>
                              </div>
                            )}
                            <div className="info-row">
                              <span className="info-label">Стоимость:</span>
                              <span className="info-value">{ticket.cost} TON</span>
                            </div>
                            {ticket.prize && (
                              <div className="info-row info-row--highlight">
                                <span className="info-label">Выигрыш:</span>
                                <span className="info-value">{ticket.prize} TON</span>
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      <button className="flip-btn" onClick={handleFlip}>
                        🔄 Перевернуть
                      </button>
                    </div>

                    <div className="ticket-detail-back">
                      <h4>Информация о транзакции</h4>
                      
                      <div className="qr-code-wrapper">
                        <QRCodeSVG
                          value={ticket.transactionHash}
                          size={200}
                          bgColor="transparent"
                          fgColor="#ffffff"
                          level="H"
                        />
                      </div>

                      <div className="transaction-info">
                        <p className="transaction-label">Хеш транзакции:</p>
                        <p className="transaction-hash">
                          {ticket.transactionHash.slice(0, 8)}...{ticket.transactionHash.slice(-8)}
                        </p>
                        <a 
                          href={`https://tonscan.org/tx/${ticket.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="explorer-link"
                        >
                          Посмотреть в Explorer →
                        </a>
                      </div>

                      <button className="flip-btn" onClick={handleFlip}>
                        🔄 Перевернуть
                      </button>
                    </div>
                  </motion.div>

                  <div className="ticket-actions">
                    <button className="action-btn action-btn--primary" onClick={handleDownload}>
                      📥 Скачать PNG
                    </button>
                    <button className="action-btn" onClick={handleShare}>
                      📤 Поделиться
                    </button>
                    <button className="action-btn" onClick={handleCloseModal}>
                      ✕ Закрыть
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

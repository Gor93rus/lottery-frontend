import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { PurchasedTicket } from '../../services/ticketApi';
import './TicketCard.css';

interface TicketCardProps {
  ticket: PurchasedTicket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const [copied, setCopied] = useState(false);

  const copyTxHash = async () => {
    if (ticket.txHash) {
      try {
        await navigator.clipboard.writeText(ticket.txHash);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        // Fallback: Could show an error message to user
      }
    }
  };

  const shortHash = ticket.txHash 
    ? `${ticket.txHash.slice(0, 6)}...${ticket.txHash.slice(-4)}`
    : 'N/A';

  const statusLabels: Record<PurchasedTicket['status'], string> = {
    pending: '⏳ Ожидание розыгрыша',
    active: '✅ Активен',
    won: '🎉 Выигрыш!',
    lost: '❌ Не выиграл'
  };

  const displayDate = ticket.createdAt || ticket.purchasedAt;
  const totalNumbers = ticket.numbers.length;

  return (
    <motion.div
      className="ticket-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Header */}
      <div className="ticket-header">
        <h3>🎫 {ticket.id}</h3>
        <span className={`ticket-status status-${ticket.status}`}>
          {statusLabels[ticket.status]}
        </span>
      </div>

      {/* Numbers */}
      <div className="ticket-numbers">
        {ticket.numbers.map((num, i) => (
          <motion.span
            key={`${ticket.id}-num-${i}`}
            className="number-ball"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: Math.min(i * 0.05, 0.5) }}
          >
            {num}
          </motion.span>
        ))}
      </div>

      {/* Price */}
      <div className="ticket-price">
        💎 {ticket.price} {ticket.currency || 'TON'}
      </div>

      {/* Prize (if won) */}
      {ticket.status === 'won' && ticket.prizeAmount && ticket.prizeAmount > 0 && (
        <div className="ticket-prize">
          🏆 Выигрыш: {ticket.prizeAmount} {ticket.currency || 'TON'}
          <br />
          Совпадений: {ticket.matchedNumbers}/{totalNumbers}
        </div>
      )}

      {/* TX Hash Section */}
      {ticket.txHash && (
        <div className="ticket-blockchain">
          <div className="blockchain-label">📜 Transaction Hash:</div>
          <div className="blockchain-hash">
            <code>{shortHash}</code>
            <button 
              className="copy-btn"
              onClick={copyTxHash}
              title="Скопировать полный hash"
              aria-label="Скопировать хэш транзакции"
            >
              {copied ? '✅' : '📋'}
            </button>
            <a
              href={`https://testnet.tonscan.org/tx/${ticket.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tonscan-btn"
              aria-label="Посмотреть транзакцию в TonScan"
            >
              🔗 TonScan
            </a>
          </div>
          {ticket.txHash && ticket.blockNumber && (
            <div className="blockchain-status">
              ✅ Подтверждено в блокчейне
            </div>
          )}
        </div>
      )}

      {/* Purchase Date */}
      {displayDate && (
        <div className="ticket-date">
          Куплен: {new Date(displayDate).toLocaleString('ru-RU')}
        </div>
      )}

      {/* Tiny verify link */}
      <Link to={`/verify/${ticket.id}`} className="ticket-verify-link">
        проверить →
      </Link>
    </motion.div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PurchaseTicketsCompact from './PurchaseTicketsCompact';
import './FloatingCart.css';

interface FloatingCartProps {
  ticketCount: number;
  tickets: Array<{ id: string; numbers: number[] }>;
  onRemove: (id: string) => void;
  onClear: () => void;
  onCheckout: () => void;
}

export default function FloatingCart({
  ticketCount,
  tickets,
  onRemove,
  onClear,
  onCheckout
}: FloatingCartProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="floating-cart">
      {/* Cart Button */}
      <motion.button
        className="floating-cart-btn"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Открыть корзину"
      >
        🛒
        {ticketCount > 0 && (
          <motion.span
            className="cart-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={ticketCount}
          >
            {ticketCount}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="cart-dropdown"
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <PurchaseTicketsCompact
              tickets={tickets}
              onRemove={onRemove}
              onClear={onClear}
              onCheckout={onCheckout}
              onClose={() => setIsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

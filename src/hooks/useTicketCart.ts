import { useState, useEffect, useCallback } from 'react';

export interface CartTicket {
  id: string;
  numbers: number[];
  addedAt: Date;
}

export interface UseTicketCart {
  tickets: CartTicket[];
  addTicket: (numbers: number[]) => void;
  removeTicket: (id: string) => void;
  clearCart: () => void;
  totalTickets: number;
  subtotal: number;
  discount: number;
  discountPercent: number;
  total: number;
}

const CART_STORAGE_KEY = 'lottery_ticket_cart';
const DISCOUNT_THRESHOLD = 5;
const DISCOUNT_PERCENT = 5;

const getDiscount = (ticketCount: number, pricePerTicket: number): { percent: number, amount: number } => {
  if (ticketCount >= DISCOUNT_THRESHOLD) {
    const percent = DISCOUNT_PERCENT;
    const subtotal = ticketCount * pricePerTicket;
    const amount = subtotal * (percent / 100);
    return { percent, amount };
  }
  return { percent: 0, amount: 0 };
};

export function useTicketCart(pricePerTicket: number): UseTicketCart {
  const [tickets, setTickets] = useState<CartTicket[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Array<Omit<CartTicket, 'addedAt'> & { addedAt: string }>;
        return parsed.map((ticket) => ({
          ...ticket,
          addedAt: new Date(ticket.addedAt)
        }));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    return [];
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(tickets));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [tickets]);

  const addTicket = useCallback((numbers: number[]) => {
    const newTicket: CartTicket = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      numbers: [...numbers].sort((a, b) => a - b),
      addedAt: new Date()
    };
    setTickets(prev => [...prev, newTicket]);
  }, []);

  const removeTicket = useCallback((id: string) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setTickets([]);
  }, []);

  const totalTickets = tickets.length;
  const subtotal = totalTickets * pricePerTicket;
  const discountInfo = getDiscount(totalTickets, pricePerTicket);
  const total = subtotal - discountInfo.amount;

  return {
    tickets,
    addTicket,
    removeTicket,
    clearCart,
    totalTickets,
    subtotal,
    discount: discountInfo.amount,
    discountPercent: discountInfo.percent,
    total
  };
}

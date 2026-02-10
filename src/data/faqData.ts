export interface FAQItem {
  category: string;
  question: string;
  answer: string;
  id: string;
}

export const CATEGORIES = [
  { id: 'general', name: 'General', icon: '🎯' },
  { id: 'tickets', name: 'Tickets', icon: '🎫' },
  { id: 'prizes', name: 'Prizes', icon: '💰' },
  { id: 'payment', name: 'Payment', icon: '💳' },
  { id: 'security', name: 'Security', icon: '🔐' },
  { id: 'technical', name: 'Technical', icon: '📱' }
];

export const FAQ_DATA: FAQItem[] = [
  // General (5 questions)
  {
    id: 'general-1',
    category: 'general',
    question: 'What is Weekend Millions?',
    answer: 'Weekend Millions is a transparent, blockchain-based lottery platform built on TON. Every draw is provably fair, and all transactions are recorded on the blockchain for full transparency.'
  },
  {
    id: 'general-2',
    category: 'general',
    question: 'How does it work?',
    answer: 'Buy a ticket by selecting 5 numbers from 1-36, wait for the draw (every Saturday at 20:00 UTC), and if you match 3+ numbers, you win! Prizes are automatically sent to your wallet.'
  },
  {
    id: 'general-3',
    category: 'general',
    question: 'Is it legal?',
    answer: 'Yes! Weekend Millions operates as a decentralized lottery on the TON blockchain using smart contracts, ensuring transparency and fairness.'
  },
  {
    id: 'general-4',
    category: 'general',
    question: 'What blockchain is used?',
    answer: 'We use TON (The Open Network) blockchain for all lottery operations, ticket purchases, and prize distributions.'
  },
  {
    id: 'general-5',
    category: 'general',
    question: 'Can I play from any country?',
    answer: 'Yes! Since we operate on blockchain, anyone with a TON wallet can participate from anywhere in the world.'
  },

  // Tickets (5 questions)
  {
    id: 'tickets-1',
    category: 'tickets',
    question: 'How to buy a ticket?',
    answer: 'Connect your TON wallet, choose a lottery, select 5 numbers or use Quick Pick, pay with TON or USDT, and receive instant confirmation.'
  },
  {
    id: 'tickets-2',
    category: 'tickets',
    question: 'What payment methods are accepted?',
    answer: 'We accept TON (Toncoin) and USDT (Tether on TON blockchain). Different lotteries may support different currencies.'
  },
  {
    id: 'tickets-3',
    category: 'tickets',
    question: 'Can I buy multiple tickets?',
    answer: 'Yes! You can buy as many tickets as you want. Use the Quick Pick feature to generate multiple tickets instantly.'
  },
  {
    id: 'tickets-4',
    category: 'tickets',
    question: 'Can I cancel a ticket?',
    answer: 'No. Once a ticket is purchased and confirmed on the blockchain, it cannot be cancelled or refunded. Please check your numbers before purchasing.'
  },
  {
    id: 'tickets-5',
    category: 'tickets',
    question: 'How do I check my tickets?',
    answer: 'Go to "My Tickets" page to see all your tickets, or use the "Verify" page to check a specific ticket by entering its ID.'
  },

  // Prizes (5 questions)
  {
    id: 'prizes-1',
    category: 'prizes',
    question: 'How are prizes calculated?',
    answer: '50% of ticket sales go to the prize pool: 5/5 match gets 70% (jackpot), 4/5 match gets 20%, and 3/5 match gets 10%. Prize per winner = (Category Pool) / (Number of winners).'
  },
  {
    id: 'prizes-2',
    category: 'prizes',
    question: 'What are the prize tiers?',
    answer: '5/5 numbers = Jackpot (70% of pool), 4/5 numbers = Big prize (20% of pool), 3/5 numbers = Small prize (10% of pool). Match 2 or less = No prize.'
  },
  {
    id: 'prizes-3',
    category: 'prizes',
    question: 'How long to receive my prize?',
    answer: 'Prizes are sent automatically within 24 hours after the draw. You will receive a notification when the prize is sent to your wallet.'
  },
  {
    id: 'prizes-4',
    category: 'prizes',
    question: 'Are there any fees?',
    answer: 'No! There are no additional fees. The full prize amount is sent directly to your wallet.'
  },
  {
    id: 'prizes-5',
    category: 'prizes',
    question: 'What if I win the jackpot?',
    answer: 'Congratulations! The jackpot is sent automatically to your wallet within 24 hours. You will receive notifications via the app and Telegram.'
  },

  // Payment (5 questions)
  {
    id: 'payment-1',
    category: 'payment',
    question: 'What currencies are accepted?',
    answer: 'We accept TON (Toncoin) and USDT (Tether on TON blockchain). Check each lottery page for available payment options.'
  },
  {
    id: 'payment-2',
    category: 'payment',
    question: 'How to pay with TON?',
    answer: 'Connect your TON wallet (Tonkeeper, Telegram Wallet, etc.), select TON as payment method, and approve the transaction in your wallet.'
  },
  {
    id: 'payment-3',
    category: 'payment',
    question: 'How to pay with USDT?',
    answer: 'Make sure you have USDT on TON blockchain, select USDT as payment method, and approve the transaction in your wallet.'
  },
  {
    id: 'payment-4',
    category: 'payment',
    question: 'Are payments secure?',
    answer: 'Yes! All payments are processed through TON blockchain using smart contracts. We never have access to your wallet or funds.'
  },
  {
    id: 'payment-5',
    category: 'payment',
    question: 'Can I get a refund?',
    answer: 'No. Blockchain transactions are irreversible once confirmed. Please double-check all details before purchasing.'
  },

  // Security (5 questions)
  {
    id: 'security-1',
    category: 'security',
    question: 'How is fairness guaranteed?',
    answer: 'We use a Provably Fair system: seed hash is published 24 hours before the draw, winning numbers are generated from the seed, and anyone can verify the results match the hash.'
  },
  {
    id: 'security-2',
    category: 'security',
    question: 'What is Provably Fair?',
    answer: 'Provably Fair is a cryptographic system where a seed hash is published before the draw, making it mathematically impossible to manipulate results after the fact.'
  },
  {
    id: 'security-3',
    category: 'security',
    question: 'How to verify a draw?',
    answer: 'Go to /verify page, enter your ticket ID, and you will see your numbers vs winning numbers, transaction hash, and blockchain proof with verification link.'
  },
  {
    id: 'security-4',
    category: 'security',
    question: 'Is my wallet safe?',
    answer: 'Yes! We use TON Connect protocol. Your private keys never leave your device, and we never have access to your wallet.'
  },
  {
    id: 'security-5',
    category: 'security',
    question: 'What if I lose my ticket ID?',
    answer: 'Check the "My Tickets" page in the app, or look for the purchase notification in Telegram. Your tickets are linked to your wallet address.'
  },

  // Technical (5 questions)
  {
    id: 'technical-1',
    category: 'technical',
    question: 'What wallets are supported?',
    answer: 'All TON wallets: Tonkeeper (recommended), Telegram Wallet, TON Wallet, OpenMask, and any wallet supporting TON Connect protocol.'
  },
  {
    id: 'technical-2',
    category: 'technical',
    question: 'Do I need a TON wallet?',
    answer: 'Yes! You need a TON wallet to buy tickets and receive prizes. It is free and takes 2 minutes to set up. We recommend Tonkeeper for beginners.'
  },
  {
    id: 'technical-3',
    category: 'technical',
    question: 'Is there a mobile app?',
    answer: 'Yes! Our web app is a Progressive Web App (PWA) that works like a native app on mobile. You can install it from your browser.'
  },
  {
    id: 'technical-4',
    category: 'technical',
    question: 'What are browser requirements?',
    answer: 'Use a modern browser: Chrome, Safari, Firefox, or Edge. Make sure JavaScript is enabled and cookies are allowed.'
  },
  {
    id: 'technical-5',
    category: 'technical',
    question: 'How to contact support?',
    answer: 'Contact us via Telegram support bot. You will find the link in the app footer or notification messages.'
  }
];

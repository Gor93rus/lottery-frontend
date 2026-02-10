/**
 * Phase 4 Advanced Components - Usage Examples
 * 
 * This file demonstrates how to integrate all Phase 4 components
 * into your lottery application.
 */

import { useState } from 'react';
import { AIChatbot } from './AIChatbot';
import { InstallPrompt, triggerInstallPrompt } from './InstallPrompt';
import { PullToRefresh } from './PullToRefresh';
import { PushNotifications, triggerFirstPurchaseNotification } from './PushNotifications';
import { TONBalance } from '../Web3/TONBalance';
import { TransactionHistory } from '../Web3/TransactionHistory';
import { InteractiveTicket } from '../Lottery/InteractiveTicket';
import { useHaptic } from '../../hooks/useHaptic';
import { usePWA } from '../../hooks/usePWA';

// ============================================================
// Example 1: Basic App Layout with All Components
// ============================================================

export const AppWithAdvancedFeatures = () => {
  const handleRefresh = async () => {
    // Fetch latest data
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  return (
    <div className="app">
      {/* Header with TON Balance */}
      <header className="app-header">
        <h1>Lottery App</h1>
        <TONBalance 
          address="UQAbcdefghijklmnopqrstuvwxyz1234567890"
          onRefresh={async () => {
            // Fetch balance from blockchain
            console.log('Refreshing balance...');
          }}
        />
        <PushNotifications />
      </header>

      {/* Main Content with Pull to Refresh */}
      <PullToRefresh onRefresh={handleRefresh}>
        <main className="app-content">
          <h2>Your Content Here</h2>
          {/* Your lottery content */}
        </main>
      </PullToRefresh>

      {/* AI Chatbot (floating) */}
      <AIChatbot />

      {/* PWA Install Prompt */}
      <InstallPrompt position="bottom" showAfterAction={true} />
    </div>
  );
};

// ============================================================
// Example 2: Interactive Ticket Demo
// ============================================================

export const TicketDemo = () => {
  const [showPurchaseAnimation, setShowPurchaseAnimation] = useState(false);
  const { heavy } = useHaptic();

  const sampleTicket = {
    id: 'ticket-001',
    number: '12345',
    lotteryName: 'TON Million',
    lotteryType: 'regular' as const,
    purchaseDate: new Date(),
    drawDate: new Date(Date.now() + 86400000), // tomorrow
    numbers: [5, 12, 23, 34, 42, 50],
    cost: 50,
    transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    status: 'active' as const
  };

  const handlePurchase = () => {
    heavy();
    setShowPurchaseAnimation(true);
    
    // Trigger install prompt and notifications
    triggerInstallPrompt();
    triggerFirstPurchaseNotification();
  };

  return (
    <div>
      <button onClick={handlePurchase}>Buy Ticket</button>
      
      {showPurchaseAnimation && (
        <InteractiveTicket
          ticket={sampleTicket}
          isPurchaseAnimation={true}
          onAnimationComplete={() => {
            console.log('Purchase animation complete!');
            setShowPurchaseAnimation(false);
          }}
        />
      )}

      {/* Regular ticket display */}
      <InteractiveTicket ticket={sampleTicket} />
    </div>
  );
};

// ============================================================
// Example 3: Instant Lottery Ticket with Scratch-off
// ============================================================

export const InstantLotteryDemo = () => {
  const instantTicket = {
    id: 'instant-001',
    number: '98765',
    lotteryName: 'Instant Win',
    lotteryType: 'instant' as const,
    purchaseDate: new Date(),
    numbers: [777],
    cost: 25,
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    status: 'won' as const,
    prize: 250
  };

  return (
    <div>
      <h2>Scratch to Win!</h2>
      <InteractiveTicket ticket={instantTicket} />
    </div>
  );
};

// ============================================================
// Example 4: Transaction History Page
// ============================================================

export const WalletPage = () => {
  return (
    <div className="wallet-page">
      <h1>My Wallet</h1>
      
      <TONBalance 
        address="UQAbcdefghijklmnopqrstuvwxyz1234567890"
      />

      <TransactionHistory limit={20} />
    </div>
  );
};

// ============================================================
// Example 5: PWA Installation Flow
// ============================================================

export const PWADemo = () => {
  const { isInstallable, isInstalled, install } = usePWA();
  const { medium } = useHaptic();

  const handleInstall = async () => {
    medium();
    const success = await install();
    if (success) {
      console.log('App installed successfully!');
    }
  };

  return (
    <div>
      {isInstalled ? (
        <p>✅ App is installed</p>
      ) : isInstallable ? (
        <button onClick={handleInstall}>
          📱 Install App
        </button>
      ) : (
        <p>Installation not available</p>
      )}
    </div>
  );
};

// ============================================================
// Example 6: Haptic Feedback Integration
// ============================================================

export const HapticDemo = () => {
  const { light, medium, heavy, trigger } = useHaptic();

  return (
    <div>
      <h2>Haptic Feedback Test</h2>
      
      <button onClick={light}>
        Light Tap (10ms)
      </button>
      
      <button onClick={medium}>
        Medium Tap (20ms)
      </button>
      
      <button onClick={heavy}>
        Heavy Tap ([30,10,30]ms)
      </button>

      <button onClick={() => trigger('medium')}>
        Trigger by Type
      </button>
    </div>
  );
};

// ============================================================
// Example 7: Complete User Purchase Flow
// ============================================================

export const PurchaseFlow = () => {
  const [step, setStep] = useState<'select' | 'purchase' | 'success'>('select');
  const { heavy, light } = useHaptic();

  const handlePurchase = async () => {
    setStep('purchase');
    heavy();
    
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setStep('success');
    triggerInstallPrompt();
    triggerFirstPurchaseNotification();
  };

  const ticket = {
    id: `ticket-${Date.now()}`,
    number: Math.floor(10000 + Math.random() * 90000).toString(),
    lotteryName: 'TON Million',
    lotteryType: 'regular' as const,
    purchaseDate: new Date(),
    drawDate: new Date(Date.now() + 86400000 * 3),
    numbers: Array.from({ length: 6 }, () => Math.floor(1 + Math.random() * 49)),
    cost: 50,
    transactionHash: `0x${Math.random().toString(16).slice(2)}`,
    status: 'active' as const
  };

  return (
    <div className="purchase-flow">
      {step === 'select' && (
        <div>
          <h2>Select Your Numbers</h2>
          <button onClick={handlePurchase}>
            Purchase Ticket (50 TON)
          </button>
        </div>
      )}

      {step === 'purchase' && (
        <div>
          <h2>Processing Transaction...</h2>
          <div className="loader">⏳</div>
        </div>
      )}

      {step === 'success' && (
        <InteractiveTicket
          ticket={ticket}
          isPurchaseAnimation={true}
          onAnimationComplete={() => {
            light();
            console.log('Welcome to the lottery!');
          }}
        />
      )}
    </div>
  );
};

export default {
  AppWithAdvancedFeatures,
  TicketDemo,
  InstantLotteryDemo,
  WalletPage,
  PWADemo,
  HapticDemo,
  PurchaseFlow
};


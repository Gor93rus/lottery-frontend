# Quick Integration Guide - Phase 4 Components

## 🚀 5-Minute Setup

### Step 1: Import Components

```tsx
// In your main App.tsx or layout file
import { AIChatbot, InstallPrompt, PushNotifications } from './components/Advanced';
import { TONBalance } from './components/Web3';
```

### Step 2: Add to Your App

```tsx
function App() {
  return (
    <div className="app">
      {/* Header */}
      <header>
        <Logo />
        <TONBalance address="UQAb..." />
        <PushNotifications />
      </header>

      {/* Main Content */}
      <main>{/* Your routes and pages */}</main>

      {/* Floating Components */}
      <AIChatbot />
      <InstallPrompt position="bottom" />
    </div>
  );
}
```

### Step 3: Use Interactive Tickets

```tsx
// In your lottery purchase flow
import { InteractiveTicket } from './components/Lottery/InteractiveTicket';

const ticket = {
  id: '1',
  number: '12345',
  lotteryName: 'TON Million',
  lotteryType: 'regular' as const,
  purchaseDate: new Date(),
  drawDate: new Date(Date.now() + 86400000),
  numbers: [5, 12, 23, 34, 42],
  cost: 50,
  transactionHash: '0x...',
  status: 'active' as const
};

<InteractiveTicket ticket={ticket} isPurchaseAnimation={true} />
```

### Step 4: Add Pull to Refresh

```tsx
// Wrap your main content
import { PullToRefresh } from './components/Advanced';

<PullToRefresh onRefresh={async () => {
  await fetchLatestData();
}}>
  <YourContent />
</PullToRefresh>
```

### Step 5: Add Transaction History Page

```tsx
// Create a wallet/history page
import { TransactionHistory } from './components/Web3';

function WalletPage() {
  return (
    <div>
      <h1>My Wallet</h1>
      <TONBalance address="UQAb..." />
      <TransactionHistory limit={20} />
    </div>
  );
}
```

## 🎯 Trigger Events

### After First Purchase
```tsx
import { triggerFirstPurchaseNotification } from './components/Advanced';
import { triggerInstallPrompt } from './components/Advanced';

// After successful ticket purchase
triggerFirstPurchaseNotification();
triggerInstallPrompt();
```

### Use Haptic Feedback
```tsx
import { useHaptic } from './hooks';

const { light, medium, heavy } = useHaptic();

<button onClick={() => {
  medium(); // Haptic feedback
  handlePurchase();
}}>
  Buy Ticket
</button>
```

## 📱 PWA Integration

```tsx
import { usePWA } from './hooks';

const { isInstallable, install } = usePWA();

{isInstallable && (
  <button onClick={install}>Install App</button>
)}
```

## 🎨 Styling Tips

All components use the app's color scheme:
- Primary gradient: `#df600c` → `#f45da6`
- Dark background: `rgba(26, 26, 36, 0.95)`
- Borders: `rgba(223, 96, 12, 0.3)`

They automatically match your existing dark theme!

## 🔧 Customization

### AIChatbot - Add Custom FAQs
Edit `AIChatbot.tsx` → `FAQ_DATA` array

### PushNotifications - Add Notification Types
Edit `PushNotifications.tsx` → `NOTIFICATION_MESSAGES`

### InteractiveTicket - Customize Animation
Adjust `framer-motion` props in `InteractiveTicket.tsx`

## 📦 Dependencies Check

All required dependencies are already in package.json:
- ✅ framer-motion
- ✅ canvas-confetti
- ✅ qrcode.react
- ✅ html2canvas
- ✅ react-simple-pull-to-refresh

No additional packages needed!

## 🐛 Troubleshooting

**AIChatbot not showing?**
- Check z-index conflicts (chatbot uses z-index: 1000)

**Haptic not working?**
- Haptic feedback only works on mobile devices

**Install prompt not showing?**
- Must be HTTPS or localhost
- User must interact with page first
- Check if already installed

**Notifications not working?**
- Request permission first
- Check browser notification settings

## 📚 Full Examples

See `USAGE_EXAMPLES.tsx` for 7 complete integration examples!

---

**Need Help?** Check the comprehensive README.md in `/components/Advanced/`

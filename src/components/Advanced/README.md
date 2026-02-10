# Phase 4: Advanced Components

This directory contains production-ready advanced components for the lottery application with TON blockchain integration.

## Components Overview

### 1. **AIChatbot** (`/Advanced/AIChatbot.tsx`)
AI-powered FAQ chatbot with predefined responses.

**Features:**
- Floating action button (FAB) with new tips badge
- Slide-up modal with dark frosted glass design
- Message bubbles (bot left, user right)
- Typing indicator with animated dots
- Pre-defined FAQ responses for common questions
- Quick action buttons
- Auto-scroll to new messages
- Saves last 10 messages in localStorage
- Typing effect for bot responses

**Usage:**
```tsx
import { AIChatbot } from './components/Advanced/AIChatbot';

function App() {
  return <AIChatbot />;
}
```

**FAQ Topics:**
- How to buy tickets
- Draw schedules
- Referral program
- Ticket location
- Level system

---

### 2. **InteractiveTicket** (`/Lottery/InteractiveTicket.tsx`)
Advanced ticket component with animations and interactions.

**Features:**
- Purchase animation (fly-in with Bezier curve + rotation)
- Confetti on landing (using canvas-confetti)
- 3D flip effect (front/back)
- Scratch-off effect for instant lotteries (Canvas API)
- Envelope opening animation for regular lotteries
- Detailed modal view with QR code
- Download PNG functionality (html2canvas)
- Share functionality
- Win/lose animations
- Toast notifications

**Usage:**
```tsx
import { InteractiveTicket } from './components/Lottery/InteractiveTicket';

const ticketData = {
  id: '1',
  number: '12345',
  lotteryName: 'TON Million',
  lotteryType: 'regular', // or 'instant'
  purchaseDate: new Date(),
  drawDate: new Date(Date.now() + 86400000),
  numbers: [5, 12, 23, 34, 42],
  cost: 50,
  transactionHash: '0x123...',
  status: 'active', // 'won', 'lost'
  prize: 1000 // optional
};

<InteractiveTicket 
  ticket={ticketData}
  isPurchaseAnimation={true}
  onAnimationComplete={() => console.log('Animation done')}
/>
```

---

### 3. **PullToRefresh** (`/Advanced/PullToRefresh.tsx`)
Pull-to-refresh wrapper using react-simple-pull-to-refresh.

**Features:**
- Arrow down → spinning gradient indicator
- Text states: "Потяните для обновления" → "Обновление..."
- Success notification with fade-in
- Customizable threshold and resistance
- Wraps any children

**Usage:**
```tsx
import { PullToRefresh } from './components/Advanced/PullToRefresh';

<PullToRefresh onRefresh={async () => {
  await fetchData();
}}>
  <YourContent />
</PullToRefresh>
```

---

### 4. **InstallPrompt** (`/Advanced/InstallPrompt.tsx`)
PWA installation prompt with smart triggers.

**Features:**
- Banner at top or bottom
- Listens to `beforeinstallprompt` event
- Shows after first user action
- Remembers dismissal in localStorage
- iOS-specific instructions modal
- Slide-in with bounce animation

**Usage:**
```tsx
import { InstallPrompt, triggerInstallPrompt } from './components/Advanced/InstallPrompt';

// Add to App component
<InstallPrompt position="bottom" showAfterAction={true} />

// Trigger after user action (e.g., purchase)
triggerInstallPrompt();
```

---

### 5. **PushNotifications** (`/Advanced/PushNotifications.tsx`)
Complete push notification system with settings.

**Features:**
- Permission request modal (shows after first purchase)
- Notification types: draw reminders, wins, new lotteries, streak warnings, daily quests
- Settings panel with toggles
- Quiet hours configuration
- Test notifications
- Mock notifications using Notification API + setTimeout

**Usage:**
```tsx
import { PushNotifications, triggerFirstPurchaseNotification } from './components/Advanced/PushNotifications';

// Add to header
<PushNotifications />

// Trigger after first purchase
triggerFirstPurchaseNotification();
```

**Notification Types:**
- 🎰 Draw reminders
- 🏆 Win notifications
- 🆕 New lotteries
- 🔥 Streak warnings
- 🎯 Daily quests

---

### 6. **TONBalance** (`/Web3/TONBalance.tsx`)
TON wallet balance display with animations.

**Features:**
- Shows TON icon, balance, and shortened address
- Refresh button with spinning animation
- Counter animation on balance change
- Pulse effect on deposit
- Click opens detailed modal
- Copy address functionality

**Usage:**
```tsx
import { TONBalance } from './components/Web3/TONBalance';

<TONBalance 
  address="UQAbcd...efgh"
  onRefresh={async () => {
    await fetchBalance();
  }}
/>
```

---

### 7. **TransactionHistory** (`/Web3/TransactionHistory.tsx`)
Complete transaction history with filtering and export.

**Features:**
- Last 10-20 transactions
- Transaction types: sent, received, processing
- Groups by: "Сегодня", "Вчера", "Эта неделя", month
- Filters: All / Sent / Received
- Detailed modal on click
- Export to CSV
- Copy transaction hash
- Link to TON Explorer

**Usage:**
```tsx
import { TransactionHistory } from './components/Web3/TransactionHistory';

<TransactionHistory limit={20} />
```

---

## Custom Hooks

### `useHaptic` (`/hooks/useHaptic.ts`)
Vibration feedback hook.

**Methods:**
- `light()` - 10ms vibration
- `medium()` - 20ms vibration
- `heavy()` - [30, 10, 30]ms pattern
- `trigger(type)` - Trigger by type name

**Usage:**
```tsx
import { useHaptic } from './hooks/useHaptic';

const { light, medium, heavy } = useHaptic();

<button onClick={() => {
  medium();
  handleClick();
}}>
  Click me
</button>
```

---

### `usePWA` (`/hooks/usePWA.ts`)
PWA detection and installation hook.

**Returns:**
- `isInstallable` - Can be installed
- `isInstalled` - Already installed
- `updateAvailable` - Update ready
- `install()` - Trigger installation
- `reloadForUpdate()` - Reload for update

**Usage:**
```tsx
import { usePWA } from './hooks/usePWA';

const { isInstallable, install } = usePWA();

{isInstallable && (
  <button onClick={install}>Install App</button>
)}
```

---

## Utilities

### `shareUtils.ts` (`/utils/shareUtils.ts`)
Social sharing utilities.

**Functions:**
- `canShare()` - Check Web Share API support
- `shareContent(data)` - Share via native dialog
- `shareToTelegram(text, url)`
- `shareToTwitter(text, url)`
- `copyToClipboard(text)`
- `downloadFile(blob, filename)`

---

### `pwaUtils.ts` (`/utils/pwaUtils.ts`)
PWA service worker helpers.

**Functions:**
- `registerServiceWorker()`
- `checkForUpdates()`
- `isPWA()` - Check if running as PWA
- `isIOS()`, `isAndroid()`
- `getInstallInstructions()`
- `requestNotificationPermission()`
- `showNotification(title, options)`
- `scheduleNotification(title, options, delayMs)`

---

### `canvas.ts` (`/utils/canvas.ts`)
Canvas utilities for scratch effects.

**Functions:**
- `createScratchCanvas(width, height, coverImage?)`
- `scratchAt(canvas, x, y, radius)` - Scratch and return %
- `calculateScratchPercentage(canvas)`
- `downloadCanvas(canvas, filename)`
- `canvasToBlob(canvas)`

---

## Styling

All components use:
- **Dark theme** with consistent color scheme:
  - Primary gradient: `#df600c` → `#f45da6`
  - Dark backgrounds: `rgba(26, 26, 36, 0.95)` / `rgba(19, 19, 26, 0.95)`
  - Borders: `rgba(223, 96, 12, 0.3)`
- **Frosted glass** effects with `backdrop-filter: blur()`
- **Smooth animations** via Framer Motion
- **Responsive design** with mobile-first approach
- **CSS custom properties** for consistency

---

## Dependencies Used

The following packages are already in package.json:
- `framer-motion` - Animations
- `canvas-confetti` - Confetti effects
- `qrcode.react` - QR codes
- `html2canvas` - Screenshot/download
- `react-simple-pull-to-refresh` - Pull to refresh

---

## Browser Support

- **Web Share API**: Modern browsers (fallback to social links)
- **Notifications API**: All modern browsers
- **Service Workers**: All modern browsers
- **Vibration API**: Mobile browsers
- **Canvas API**: All browsers

---

## localStorage Keys

Components use these localStorage keys:
- `chatbot_messages` - Chat history
- `ton_balance` - Cached balance
- `transactions` - Transaction history
- `notification_settings` - Notification preferences
- `notification_permission_asked` - Permission state
- `install_prompt_dismissed` - Install prompt state
- `user_has_interacted` - User interaction tracking
- `first_purchase_made` - First purchase flag

---

## Performance Considerations

1. **Lazy Loading**: All modals lazy load on interaction
2. **Memoization**: Heavy computations are memoized
3. **Debouncing**: Input handlers use debouncing
4. **Virtual Scrolling**: Not needed for current limits
5. **Image Optimization**: QR codes and icons are SVG
6. **localStorage**: Limited to last 10-20 items

---

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus management in modals
- Reduced motion support via CSS

---

## Testing Recommendations

1. **Unit Tests**: Test utility functions
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test full user flows
4. **Visual Tests**: Screenshot testing for animations
5. **Performance Tests**: Measure render times

---

## Future Enhancements

- Real AI chatbot integration
- Push notification server integration
- Real-time transaction updates via WebSocket
- Biometric authentication for wallet
- Multi-language support
- Dark/light theme toggle
- Accessibility improvements
- Performance optimizations

---

## License

MIT

---

## Support

For issues or questions, please contact the development team.

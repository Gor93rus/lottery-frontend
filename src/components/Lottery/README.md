# Lottery Components - Phase 3-4

This package contains three production-ready lottery components built with React, TypeScript, and Framer Motion.

## Components

### 1. MyTicketsCarousel

**Location:** `/src/components/Lottery/MyTicketsCarousel.tsx`

A 3D ticket carousel with swipe navigation and flip animations.

**Features:**
- 🎫 3D flip effect when clicking tickets (front/back views)
- 👆 Swipe gestures using react-swipeable
- 🎯 Three tabs: "Активные" / "История" / "Выигрыши"
- ✨ Glow effect on winning tickets
- 📱 Fully responsive design
- 🎨 Dynamic gradient backgrounds based on ticket status
- 📊 Mock data with 8 tickets in different states

**Ticket States:**
- `active` - Purple gradient
- `win` - Pink gradient with glow animation
- `lost` - Gray gradient

**Front View:**
- Lottery logo and name
- Ticket number
- Selected numbers (6 numbers in grid)
- Purchase date
- Prize amount (for winning tickets)

**Back View:**
- Draw rules
- Draw date and time
- Transaction hash
- Flip hint

**Usage:**
```tsx
import MyTicketsCarousel from './components/Lottery/MyTicketsCarousel';

function App() {
  return <MyTicketsCarousel />;
}
```

---

### 2. QuickPick

**Location:** `/src/components/Lottery/QuickPick.tsx`

Random number generator with favorites and statistics heatmap.

**Features:**
- 🎲 "Мне повезет!" button generates 6 random unique numbers (1-45)
- 🌀 Spinning animation for number generation
- ⭐ Save up to 5 favorite combinations (stored in localStorage)
- 💾 Add/edit/delete favorite combinations
- 🔥 Statistics heatmap showing "hot" and "cold" numbers
- 📊 Visual color coding:
  - Red/Pink: Hot numbers (frequent)
  - Orange: Warm numbers
  - Blue/Purple: Cold numbers (rare)
- 📈 Mock statistics data with hover tooltips

**Usage:**
```tsx
import QuickPick from './components/Lottery/QuickPick';

function App() {
  return <QuickPick />;
}
```

**LocalStorage:**
The component stores favorite combinations in `localStorage` under the key `lottery-favorites`.

---

### 3. SmartRecommendations

**Location:** `/src/components/Lottery/SmartRecommendations.tsx`

AI-powered recommendation cards for lotteries.

**Features:**
- ✨ Personalized lottery recommendations
- 🎯 Four recommendation types:
  - `history` - Based on user's play history
  - `popular` - Most popular lotteries
  - `time` - Time-sensitive (drawing soon)
  - `prize` - Large prize pools
- 🎨 Dynamic gradient colors per recommendation type
- 💰 Prize pool display
- 👥 Participant count
- 🎫 Quick buy buttons
- 📱 Responsive grid layout

**Recommendation Card Info:**
- Lottery name with icon
- Recommendation reason
- Prize pool (if applicable)
- Ticket price
- Draw date/time
- Number of participants

**Usage:**
```tsx
import SmartRecommendations from './components/Lottery/SmartRecommendations';

function App() {
  return <SmartRecommendations />;
}
```

---

## Demo Page

A demo page is available at `/src/pages/LotteryDemo.tsx` that showcases all three components together.

**Usage:**
```tsx
import LotteryDemo from './pages/LotteryDemo';

// Add to your router
<Route path="/lottery-demo" element={<LotteryDemo />} />
```

---

## Styling

All components follow the same design system:

**Colors:**
- Background: `rgba(20, 20, 20, 0.8)`
- Primary gradient: `#df600c` → `#f45da6`
- Border: `rgba(255, 255, 255, 0.1)`
- Border radius: 20px (containers), 12px (buttons)
- Backdrop filter: `blur(10px)`

**Typography:**
- Headers: 24-28px, weight 700
- Body: 14-16px
- Labels: 13-14px

**Animations:**
All components use `framer-motion` for smooth animations:
- Stagger animations for lists
- Spring physics for interactions
- Fade/slide transitions
- Scale transforms on hover

---

## Dependencies

Required packages (already in package.json):
- `react` ^19.2.0
- `react-dom` ^19.2.0
- `framer-motion` ^12.27.0
- `react-swipeable` ^7.0.2

---

## TypeScript Interfaces

### MyTicketsCarousel
```typescript
interface Ticket {
  id: string;
  lotteryName: string;
  ticketNumber: string;
  selectedNumbers: number[];
  date: string;
  drawDate: string;
  status: 'active' | 'win' | 'lost';
  prize?: number;
  transactionHash: string;
  rules: string;
}

type TicketTab = 'active' | 'history' | 'wins';
```

### QuickPick
```typescript
interface Combination {
  id: string;
  name: string;
  numbers: number[];
}

interface NumberStats {
  number: number;
  frequency: number;
}
```

### SmartRecommendations
```typescript
interface Recommendation {
  id: string;
  lotteryName: string;
  type: 'history' | 'popular' | 'time' | 'prize';
  reason: string;
  icon: string;
  prizePool?: number;
  ticketPrice: number;
  drawDate: string;
  participants?: number;
}
```

---

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Responsive Breakpoints

- Desktop: > 768px
- Tablet: 481px - 768px
- Mobile: ≤ 480px

---

## Error Handling

All components include:
- Try-catch blocks for localStorage operations
- Proper TypeScript error types
- Graceful degradation for missing data
- Console error logging for debugging

---

## Performance

- Optimized animations with GPU acceleration
- Lazy loading for heavy components
- Debounced interactions
- Efficient re-renders with React.memo potential

---

## Future Enhancements

Potential improvements:
1. **MyTicketsCarousel:** Real-time ticket status updates via WebSocket
2. **QuickPick:** AI-based number suggestions based on history
3. **SmartRecommendations:** Real ML model for personalization
4. Add internationalization (i18n) support
5. Dark/Light theme toggle
6. Accessibility improvements (ARIA labels, keyboard navigation)

---

## License

MIT

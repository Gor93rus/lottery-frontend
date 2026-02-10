# Phase 3-4 Animation Components

Production-ready animation components for the TON lottery platform with dark theme styling, gradient colors (#df600c → #f45da6), and GPU-accelerated performance.

## Components

### 1. FloatingCoins

3D rotating TON coins with orbital movement and depth effects.

**Features:**
- 6-8 TON coins with 3D rotation (rotateX, rotateY, rotateZ)
- Three size variants (20px, 30px, 40px) for depth perception
- Slow orbital movement with up/down floating animation
- Golden-orange gradient (#df600c) with glow/shadow effects
- TON symbol: ◎
- CSS-only animations with `will-change: transform` for performance

**Props:**
```typescript
interface FloatingCoinsProps {
  coinCount?: number;      // Default: 8 (range: 6-8)
  enabled?: boolean;        // Default: true
}
```

**Usage:**
```tsx
import { FloatingCoins } from '@/components/Animations';

<div className="container">
  <FloatingCoins coinCount={8} enabled={true} />
  <div className="content">Your content here</div>
</div>
```

---

### 2. HolographicCard

Rainbow gradient animation effect for premium content and VIP features.

**Features:**
- Animated rainbow gradient (400% background size)
- Diagonal light streaks using clip-path
- Subtle noise/grain texture overlay
- Two intensity levels (soft/strong)
- Wraps any children content

**Props:**
```typescript
interface HolographicCardProps {
  children: ReactNode;
  intensity?: 'soft' | 'strong';  // Default: 'soft'
  className?: string;
}
```

**Usage:**
```tsx
import { HolographicCard } from '@/components/Animations';

<HolographicCard intensity="strong">
  <div className="premium-content">
    <h3>VIP Status</h3>
    <p>Diamond Level</p>
  </div>
</HolographicCard>
```

---

### 3. GlitchText

Cyberpunk-style text glitch effect for jackpot updates and special announcements.

**Features:**
- RGB channel separation (red/cyan offsets)
- Clip-path scanline animations
- Three trigger modes (hover/auto/on-update)
- Two intensity levels (soft/strong)
- Short, controlled bursts (0.5-2s duration)
- Non-intrusive animations

**Props:**
```typescript
interface GlitchTextProps {
  text: string;
  trigger?: 'hover' | 'auto' | 'on-update';  // Default: 'auto'
  intensity?: 'soft' | 'strong';              // Default: 'soft'
  className?: string;
}
```

**Usage:**
```tsx
import { GlitchText } from '@/components/Animations';

// Auto-trigger (random intervals)
<GlitchText text="ДЖЕКПОТ" trigger="auto" intensity="soft" />

// Hover trigger
<GlitchText text="MEGA WIN!" trigger="hover" intensity="strong" />

// Update trigger (when text changes)
<GlitchText text={jackpotAmount} trigger="on-update" />
```

---

### 4. CyberpunkBanner

Futuristic banner with neon borders and scanning effects for special promotions.

**Features:**
- Animated neon borders (cyan, magenta, yellow)
- SVG stroke-dashoffset border animation
- Scanning line moving top to bottom
- Grain/noise texture background
- Flickering text effect
- Corner accents with glow

**Props:**
```typescript
interface CyberpunkBannerProps {
  title: string;
  description?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}
```

**Usage:**
```tsx
import { CyberpunkBanner } from '@/components/Animations';

<CyberpunkBanner
  title="Special Promo"
  description="Double your winnings this weekend!"
  ctaText="Join Now"
  onCtaClick={() => console.log('CTA clicked')}
/>
```

---

## Demo Page

View all components in action:

```tsx
import AnimationsDemo from '@/pages/AnimationsDemo';
```

The demo page includes:
- Individual component showcases
- Interactive controls
- Combined usage examples
- Responsive design testing

---

## Performance Optimizations

All components use:
- CSS animations (GPU-accelerated)
- `will-change: transform` for performance hints
- `backface-visibility: hidden` to prevent flickering
- `transform: translateZ(0)` for hardware acceleration
- Minimal JavaScript (only for state management)

---

## Styling Approach

Consistent with existing components:
- Dark theme background
- Gradient colors: `#df600c` → `#f45da6`
- Backdrop blur effects
- Responsive design (mobile-first)
- TypeScript interfaces for type safety

---

## Browser Compatibility

Tested and working on:
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Files Structure

```
src/components/Animations/
├── FloatingCoins.tsx
├── FloatingCoins.css
├── HolographicCard.tsx
├── HolographicCard.css
├── GlitchText.tsx
├── GlitchText.css
├── CyberpunkBanner.tsx
├── CyberpunkBanner.css
├── ParticleBackground.tsx (existing)
├── ParticleBackground.css (existing)
├── SkeletonLoader.tsx (existing)
├── SkeletonLoader.css (existing)
└── index.ts (barrel export)
```

---

## Integration Examples

### Lottery Card with Floating Coins
```tsx
<div className="lottery-card">
  <FloatingCoins coinCount={6} />
  <h3>Mega Lottery</h3>
  <p>Prize: 100,000 TON</p>
</div>
```

### Premium VIP Card
```tsx
<HolographicCard intensity="strong">
  <div className="vip-content">
    <h3>👑 Diamond VIP</h3>
    <p>2x Reward Multiplier</p>
  </div>
</HolographicCard>
```

### Jackpot Display
```tsx
<div className="jackpot">
  <span className="label">
    <GlitchText text="ДЖЕКПОТ" trigger="auto" />
  </span>
  <GlitchText 
    text={`${amount} TON`} 
    trigger="on-update" 
    intensity="strong"
  />
</div>
```

### Special Promotion
```tsx
<CyberpunkBanner
  title="Flash Sale"
  description="Get 50% more tickets for the next 24 hours!"
  ctaText="Buy Now"
  onCtaClick={handlePurchase}
/>
```

---

## License

Part of the TON lottery platform project.

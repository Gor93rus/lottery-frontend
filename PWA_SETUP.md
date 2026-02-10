# PWA Setup - Weekend Millions Lottery

This document describes the Progressive Web App (PWA) implementation.

## Files Created

### Core PWA Files
- **`public/manifest.json`** - Web App Manifest with app metadata and icons
- **`public/sw.js`** - Service Worker for offline support and caching
- **`public/offline.html`** - Offline fallback page
- **`public/icons/`** - App icons in 8 sizes (72px to 512px) as PNG and SVG

### Modified Files
- **`index.html`** - Added PWA meta tags, manifest link, and Apple-specific tags
- **`src/main.tsx`** - Added service worker registration and update handling

## Features

### 🚀 Installable
- Add to home screen on mobile devices
- Standalone app experience
- Custom app icons and splash screens

### 📡 Offline Support
- Cache-first strategy for static assets
- Network-first for API calls
- Stale-while-revalidate for images
- Custom offline page when network unavailable

### 🔄 Auto-Updates
- Service worker checks for updates every minute
- User prompted when new version available
- Seamless update with reload confirmation

### 🎨 Theming
- Theme color: `#df600c` (orange)
- Background: `#000000` (black)
- Portrait orientation optimized

## Caching Strategies

| Resource Type | Strategy | Description |
|--------------|----------|-------------|
| API calls | Network First | Fresh data prioritized, cache as fallback |
| Static assets (JS/CSS/Fonts) | Cache First | Fast loading from cache |
| Images & Media | Stale While Revalidate | Show cached, update in background |
| HTML Navigation | Network First | With offline fallback page |

## Testing PWA

### Local Development
```bash
npm run build
npm run preview
```

### Test PWA Features
1. Open Chrome DevTools → Application → Service Workers
2. Check "Offline" to test offline functionality
3. Application → Manifest to verify manifest
4. Lighthouse → Generate PWA report

### Install PWA
1. Build and serve the app
2. Click browser's "Install" button (usually in address bar)
3. App installs as standalone application

## Icon Generation

Icons are generated from SVG using the included script:

```bash
npm run generate-icons  # If you add this to package.json
# OR
node scripts/generate-icons.cjs
```

### Icon Sizes
- 72x72, 96x96, 128x128, 144x144 (Android)
- 152x152 (iOS)
- 192x192, 384x384, 512x512 (various platforms)

## Browser Support

- ✅ Chrome/Edge (Android, Desktop)
- ✅ Safari (iOS 11.3+, macOS)
- ✅ Firefox (Android, Desktop)
- ✅ Samsung Internet

## Cache Management

**Cache Version:** `v1.0.0` (defined in `sw.js`)

To force cache update:
1. Increment `CACHE_VERSION` in `public/sw.js`
2. Rebuild and deploy
3. Old caches automatically cleaned on activation

## Deployment Notes

### Production Checklist
- [ ] Update `CACHE_VERSION` in sw.js for each release
- [ ] Verify all icon files exist in `public/icons/`
- [ ] Test offline functionality
- [ ] Run Lighthouse PWA audit (score should be 90+)
- [ ] Test installation on real devices

### HTTPS Required
PWA features (especially Service Workers) require HTTPS in production. Development on localhost works without HTTPS.

## Troubleshooting

### Service Worker not updating
1. Open DevTools → Application → Service Workers
2. Click "Unregister" for the service worker
3. Hard reload (Ctrl+Shift+R)

### Icons not showing
1. Verify files exist in `public/icons/`
2. Check browser console for 404 errors
3. Clear cache and reload

### Offline page not working
1. Ensure `public/offline.html` exists
2. Check service worker is active
3. Verify network is actually offline in DevTools

## Further Reading

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev: PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

# Weekend Special Lottery - Frontend Setup Guide

Setup guide for the **Frontend** repository of the Weekend Special Lottery system.

> **Note**: This repository contains only the frontend. The backend is in a separate repository: [lottery-backend](https://github.com/bobby-singer89/lottery-backend)

---

## Prerequisites

- Node.js 18+ and npm
- Backend API running (see [lottery-backend](https://github.com/bobby-singer89/lottery-backend) repository)

---

## 📦 Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd lottery-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your backend API URL:

```env
# Backend API URL
VITE_API_URL="http://localhost:3001/api"

# TON Configuration
VITE_TON_NETWORK="testnet"

# App Configuration
VITE_APP_URL="http://localhost:5173"

# Optional: Enable mock auth for testing (DO NOT use in production)
# VITE_ENABLE_MOCK_AUTH="true"
```

---

## 🚀 Running the Frontend

### Development mode

```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

### Production build

```bash
npm run build
npm run preview
```

---

## 🔗 Backend Setup

For backend setup instructions, see the [lottery-backend](https://github.com/bobby-singer89/lottery-backend) repository.

---

## ✅ Verification

### 1. Check frontend

Open `http://localhost:5173` in your browser. You should see the lottery application.

### 2. Test with mock authentication (development only)

If `VITE_ENABLE_MOCK_AUTH=true` is set in `.env.local`:
- Look for the orange DevTools button in the bottom-right corner
- Click it to access mock authentication
- Login as a test user to explore the app

### 3. Test with real backend

Ensure your backend API is running (see [lottery-backend](https://github.com/bobby-singer89/lottery-backend)) and accessible at the URL configured in `VITE_API_URL`.

---

## 🌐 Production Deployment

### Recommended Platforms

- **Vercel** (recommended)
- **Netlify**
- **Cloudflare Pages**

### Deployment Steps

1. Connect your repository to the platform
2. Set environment variables:
   - `VITE_API_URL` - Your production backend API URL
   - `VITE_TON_NETWORK` - "mainnet" for production
   - `VITE_APP_URL` - Your production frontend URL
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy!

**Important:** For PWA support, HTTPS is required!

---

## 📝 Common Issues

### Issue: "Cannot connect to API"

**Solution:** Check that:
- Backend API is running
- `VITE_API_URL` in `.env.local` is correct
- No CORS issues (backend must allow your frontend origin)

### Issue: "Port 5173 already in use"

**Solution:**
- Kill the process using that port
- Or Vite will automatically try the next available port

### Issue: "Build fails"

**Solution:**
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors with `npm run lint`
- Clear cache: `rm -rf node_modules dist && npm install`

---

## 🎯 Next Steps

After successful setup:

1. **Configure Environment** - Set up production environment variables
2. **Test Features** - Test all lottery features thoroughly
3. **Setup Backend** - Follow the [lottery-backend](https://github.com/bobby-singer89/lottery-backend) setup guide
4. **Deploy to Production** - Deploy both frontend and backend
5. **Enable PWA** - Ensure HTTPS is configured for PWA features

---

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [TON Connect Documentation](https://docs.ton.org/develop/dapps/ton-connect)
- [Backend Repository](https://github.com/bobby-singer89/lottery-backend)

---

## 🆘 Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Review this setup guide again
3. Check the [lottery-backend](https://github.com/bobby-singer89/lottery-backend) repository for backend issues

---

**Happy Lottery Building! 🎰💰**

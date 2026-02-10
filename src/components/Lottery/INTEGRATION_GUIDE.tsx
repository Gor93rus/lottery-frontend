// Example: How to integrate the lottery components into your app

// 1. Import components
import MyTicketsCarousel from './MyTicketsCarousel';
import QuickPick from './QuickPick';
import SmartRecommendations from './SmartRecommendations';

// 2. Use in different page layouts

// Example: Lottery Dashboard Page
export function LotteryDashboard() {
  return (
    <div className="dashboard">
      <section className="recommendations-section">
        <SmartRecommendations />
      </section>
      
      <section className="quick-pick-section">
        <QuickPick />
      </section>
      
      <section className="my-tickets-section">
        <MyTicketsCarousel />
      </section>
    </div>
  );
}

// Example: User Profile Page (just show tickets)
export function UserProfile() {
  return (
    <div className="profile">
      <h1>My Profile</h1>
      <MyTicketsCarousel />
    </div>
  );
}

// Example: Lottery Buy Page (with quick pick)
export function LotteryBuy() {
  return (
    <div className="buy-page">
      <h1>Buy Lottery Tickets</h1>
      <SmartRecommendations />
      <QuickPick />
    </div>
  );
}

// Example: Home Page (with recommendations only)
export function HomePage() {
  return (
    <div className="home">
      <h1>Welcome to Lottery</h1>
      <SmartRecommendations />
    </div>
  );
}

// 3. Add to Router (if using react-router-dom)
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<LotteryDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/buy" element={<LotteryBuy />} />
      </Routes>
    </BrowserRouter>
  );
}

// 4. Connecting to Real Data (future enhancement)

// Replace mock data with real API calls:
import { useEffect, useState } from 'react';

export function MyTicketsCarouselConnected() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await fetch('/lottery/tickets');
        const data = await response.json();
        console.log('Tickets fetched:', data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  if (loading) return <div>Loading...</div>;
  
  // Pass tickets as prop (after modifying component to accept props)
  // For now, just render the component with mock data
  return <MyTicketsCarousel />;
}

// 5. Customizing Styles

// You can override CSS variables or create custom themes:
export function CustomStyledComponent() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #your-color-1, #your-color-2)',
      borderRadius: '16px'
    }}>
      <QuickPick />
    </div>
  );
}

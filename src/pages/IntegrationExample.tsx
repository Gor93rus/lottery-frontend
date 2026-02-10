import { useState } from 'react';
import { 
  FloatingCoins, 
  HolographicCard, 
  GlitchText, 
  CyberpunkBanner 
} from '../components/Animations';
import './IntegrationExample.css';

/**
 * Example: How to integrate Phase 3-4 animations into a lottery page
 * 
 * This demonstrates real-world usage of the animation components
 */
function IntegrationExample() {
  const [jackpot, setJackpot] = useState(1000000);

  // Simulate jackpot updates
  const updateJackpot = () => {
    setJackpot(prev => prev + Math.floor(Math.random() * 10000));
  };

  return (
    <div className="lottery-page">
      {/* Hero Section with Floating Coins */}
      <section className="hero-section">
        <FloatingCoins coinCount={8} enabled={true} />
        
        <div className="hero-content">
          <h1>TON Lottery</h1>
          
          <div className="jackpot-display">
            <div className="jackpot-label">
              <GlitchText 
                text="ДЖЕКПОТ" 
                trigger="auto" 
                intensity="soft"
              />
            </div>
            
            <div className="jackpot-amount">
              <GlitchText 
                text={`${jackpot.toLocaleString()} TON`}
                trigger="on-update"
                intensity="strong"
              />
            </div>
          </div>

          <button onClick={updateJackpot} className="update-btn">
            Simulate Jackpot Update
          </button>
        </div>
      </section>

      {/* Special Promotion Banner */}
      <section className="promotion-section">
        <CyberpunkBanner
          title="Weekend Special"
          description="Get 2x rewards on all tickets purchased this weekend! Limited time offer."
          ctaText="Buy Tickets Now"
          onCtaClick={() => alert('Redirect to ticket purchase')}
        />
      </section>

      {/* Lottery Cards Grid */}
      <section className="lotteries-section">
        <h2>Active Lotteries</h2>
        
        <div className="lottery-grid">
          {/* Regular Lottery */}
          <div className="lottery-card-wrapper">
            <div className="lottery-card">
              <FloatingCoins coinCount={6} enabled={true} />
              <div className="card-content">
                <h3>Classic Lottery</h3>
                <div className="prize">
                  <GlitchText 
                    text="5,000 TON"
                    trigger="auto"
                    intensity="soft"
                  />
                </div>
                <p>Tickets: 500 / 1,000</p>
                <button className="buy-btn">Buy Ticket</button>
              </div>
            </div>
          </div>

          {/* Premium Lottery with Holographic Effect */}
          <HolographicCard intensity="soft">
            <div className="lottery-card premium">
              <div className="card-content">
                <div className="premium-badge">⭐ Premium</div>
                <h3>Mega Lottery</h3>
                <div className="prize">
                  <GlitchText 
                    text="50,000 TON"
                    trigger="auto"
                    intensity="soft"
                  />
                </div>
                <p>Tickets: 2,000 / 5,000</p>
                <button className="buy-btn">Buy Ticket</button>
              </div>
            </div>
          </HolographicCard>

          {/* VIP Lottery with Strong Holographic Effect */}
          <HolographicCard intensity="strong">
            <div className="lottery-card vip">
              <div className="card-content">
                <div className="vip-badge">👑 VIP Only</div>
                <h3>Diamond Lottery</h3>
                <div className="prize">
                  <GlitchText 
                    text="200,000 TON"
                    trigger="auto"
                    intensity="strong"
                  />
                </div>
                <p>Tickets: 100 / 200</p>
                <button className="buy-btn">Buy Ticket</button>
              </div>
            </div>
          </HolographicCard>
        </div>
      </section>

      {/* Winner Announcement with Glitch Effect */}
      <section className="winner-section">
        <div className="winner-card">
          <h2>Latest Winner</h2>
          <div className="winner-info">
            <p className="winner-name">User123456</p>
            <div className="winner-prize">
              <GlitchText 
                text="MEGA WIN!"
                trigger="hover"
                intensity="strong"
              />
            </div>
            <p className="winner-amount">Won 50,000 TON</p>
          </div>
        </div>
      </section>

      {/* Flash Sale Banner */}
      <section className="flash-sale-section">
        <CyberpunkBanner
          title="Flash Sale - 24H Only"
          description="50% discount on bulk ticket purchases!"
          ctaText="Grab Deal"
          onCtaClick={() => alert('Flash sale activated')}
        />
      </section>
    </div>
  );
}

export default IntegrationExample;

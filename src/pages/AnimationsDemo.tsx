import { useState } from 'react';
import FloatingCoins from '../components/Animations/FloatingCoins';
import HolographicCard from '../components/Animations/HolographicCard';
import GlitchText from '../components/Animations/GlitchText';
import CyberpunkBanner from '../components/Animations/CyberpunkBanner';
import './AnimationsDemo.css';

function AnimationsDemo() {
  const [jackpot, setJackpot] = useState('1,000,000');
  const [coinCount, setCoinCount] = useState(8);
  const [coinsEnabled, setCoinsEnabled] = useState(true);

  const updateJackpot = () => {
    const newAmount = Math.floor(Math.random() * 10000000);
    setJackpot(newAmount.toLocaleString());
  };

  return (
    <div className="animations-demo">
      <div className="demo-header">
        <h1>Phase 3-4 Animation Components</h1>
        <p>Production-ready animations for TON lottery platform</p>
      </div>

      {/* FloatingCoins Demo */}
      <section className="demo-section">
        <div className="section-header">
          <h2>1. FloatingCoins</h2>
          <p>3D rotating TON coins with orbital movement</p>
        </div>
        
        <div className="demo-controls">
          <label>
            <input 
              type="checkbox" 
              checked={coinsEnabled} 
              onChange={(e) => setCoinsEnabled(e.target.checked)}
            />
            Enabled
          </label>
          <label>
            Coin Count: {coinCount}
            <input 
              type="range" 
              min="6" 
              max="8" 
              value={coinCount} 
              onChange={(e) => setCoinCount(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="demo-container floating-coins-demo">
          <FloatingCoins coinCount={coinCount} enabled={coinsEnabled} />
          <div className="demo-content">
            <h3>Your Wallet</h3>
            <p className="balance">1,250 TON</p>
          </div>
        </div>
      </section>

      {/* HolographicCard Demo */}
      <section className="demo-section">
        <div className="section-header">
          <h2>2. HolographicCard</h2>
          <p>Rainbow gradient with light streaks and grain texture</p>
        </div>

        <div className="demo-grid">
          <div>
            <h3>Soft Intensity</h3>
            <HolographicCard intensity="soft">
              <div className="card-content">
                <h4>🎰 Premium Lottery</h4>
                <p>Prize Pool: 50,000 TON</p>
                <p>Tickets: 1,000 / 10,000</p>
                <button className="demo-button">Buy Ticket</button>
              </div>
            </HolographicCard>
          </div>

          <div>
            <h3>Strong Intensity</h3>
            <HolographicCard intensity="strong">
              <div className="card-content">
                <h4>👑 VIP Status</h4>
                <p>Level: Diamond</p>
                <p>Rewards: 2x multiplier</p>
                <button className="demo-button">View Perks</button>
              </div>
            </HolographicCard>
          </div>
        </div>
      </section>

      {/* GlitchText Demo */}
      <section className="demo-section">
        <div className="section-header">
          <h2>3. GlitchText</h2>
          <p>RGB channel separation with scanline effects</p>
        </div>

        <div className="demo-grid">
          <div className="glitch-demo-card">
            <h3>Auto Trigger</h3>
            <div className="jackpot-display">
              <span className="jackpot-label">ДЖЕКПОТ</span>
              <GlitchText 
                text={`${jackpot} TON`}
                trigger="auto"
                intensity="soft"
                className="jackpot-amount"
              />
            </div>
          </div>

          <div className="glitch-demo-card">
            <h3>Hover Trigger</h3>
            <GlitchText 
              text="MEGA WIN!"
              trigger="hover"
              intensity="strong"
              className="mega-win"
            />
          </div>

          <div className="glitch-demo-card">
            <h3>On Update</h3>
            <GlitchText 
              text={jackpot}
              trigger="on-update"
              intensity="soft"
              className="update-value"
            />
            <button className="demo-button" onClick={updateJackpot}>
              Update Value
            </button>
          </div>
        </div>
      </section>

      {/* CyberpunkBanner Demo */}
      <section className="demo-section">
        <div className="section-header">
          <h2>4. CyberpunkBanner</h2>
          <p>Neon borders, scanning lines, and grain texture</p>
        </div>

        <CyberpunkBanner
          title="Special Promo"
          description="Double your winnings this weekend! Join our mega lottery and get 2x rewards on all tickets purchased."
          ctaText="Join Now"
          onCtaClick={() => alert('CTA Clicked!')}
        />

        <div style={{ marginTop: '24px' }}>
          <CyberpunkBanner
            title="Flash Sale"
            ctaText="Grab Deal"
            onCtaClick={() => alert('Flash sale!')}
          />
        </div>
      </section>

      {/* Combined Example */}
      <section className="demo-section">
        <div className="section-header">
          <h2>5. Combined Example</h2>
          <p>Multiple animations working together</p>
        </div>

        <div className="combined-demo">
          <FloatingCoins coinCount={6} enabled={true} />
          
          <div style={{ marginBottom: '24px' }}>
            <div className="jackpot-header">
              <GlitchText text="ДЖЕКПОТ РАСТЁТ!" trigger="auto" intensity="soft" />
            </div>
          </div>
          
          <CyberpunkBanner
            title="Специальное Предложение"
            description="Текущий джекпот достиг рекордных значений"
            ctaText="Купить Билет"
            onCtaClick={() => alert('Ticket purchase!')}
          />

          <div className="lottery-cards-grid">
            <HolographicCard intensity="soft">
              <div className="card-content">
                <h4>Classic Lottery</h4>
                <GlitchText 
                  text="5,000 TON" 
                  trigger="auto" 
                  intensity="soft"
                />
              </div>
            </HolographicCard>

            <HolographicCard intensity="strong">
              <div className="card-content">
                <h4>Mega Lottery</h4>
                <GlitchText 
                  text="100,000 TON" 
                  trigger="auto" 
                  intensity="strong"
                />
              </div>
            </HolographicCard>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AnimationsDemo;

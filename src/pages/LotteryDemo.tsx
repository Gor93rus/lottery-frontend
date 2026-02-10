import React from 'react';
import MyTicketsCarousel from '../components/Lottery/MyTicketsCarousel';
import QuickPick from '../components/Lottery/QuickPick';
import SmartRecommendations from '../components/Lottery/SmartRecommendations';
import './LotteryDemo.css';

const LotteryDemo: React.FC = () => {
  return (
    <div className="lottery-demo-page">
      <div className="demo-header">
        <h1>🎰 Lottery Components Demo</h1>
        <p>Phase 3-4 Components Showcase</p>
      </div>

      <div className="demo-section">
        <MyTicketsCarousel />
      </div>

      <div className="demo-section">
        <QuickPick />
      </div>

      <div className="demo-section">
        <SmartRecommendations />
      </div>
    </div>
  );
};

export default LotteryDemo;

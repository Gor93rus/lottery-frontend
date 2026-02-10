import { useState } from 'react';

export default function HowItWorks() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="how-it-works glass-card">
      <button
        className="how-it-works-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="toggle-text">ℹ️ How It Works</span>
        <span className="toggle-icon">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="how-it-works-content">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-text">
              <h4>Enter Ticket ID</h4>
              <p>Input your unique ticket identifier or scan QR code</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-text">
              <h4>View Match Results</h4>
              <p>See which numbers matched the winning draw with animations</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-text">
              <h4>Check Prize & Proof</h4>
              <p>View dynamic prize structure and blockchain verification</p>
            </div>
          </div>

          <div className="blockchain-info">
            <h4>🔒 Blockchain Verified</h4>
            <p>
              All tickets are recorded on the TON blockchain, ensuring complete
              transparency and fairness. You can verify the transaction independently
              using the provided hash.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

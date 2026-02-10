import { useState } from 'react';

interface TicketInputProps {
  onVerify: (ticketId: string) => void;
  loading?: boolean;
}

export default function TicketInput({ onVerify, loading = false }: TicketInputProps) {
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketId.trim()) {
      onVerify(ticketId.trim());
    }
  };

  return (
    <div className="ticket-input-container glass-card">
      <div className="input-header">
        <h2 className="input-title">🔍 Verify Your Ticket</h2>
        <p className="input-subtitle">Works for all lotteries</p>
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-wrapper">
          <input
            type="text"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder="Enter Ticket ID"
            className="ticket-input"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="verify-btn cta-button"
          disabled={!ticketId.trim() || loading}
        >
          {loading ? 'Verifying...' : 'Verify Ticket →'}
        </button>
      </form>

      <div className="or-divider">
        <span>Or scan QR code</span>
      </div>

      <button
        type="button"
        className="scan-btn"
        onClick={() => alert('QR Scanner feature coming soon!')}
      >
        📷 Scan QR Code
      </button>
    </div>
  );
}

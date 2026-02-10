import CopyButton from './CopyButton';

interface BlockchainProofProps {
  txHash: string;
  blockNumber: number;
  timestamp: string;
  explorerUrl: string;
}

export default function BlockchainProof({
  txHash,
  blockNumber,
  timestamp,
  explorerUrl,
}: BlockchainProofProps) {
  const formatTimestamp = (ts: string) => {
    try {
      return new Date(ts).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return ts;
    }
  };

  const shortenHash = (hash: string) => {
    if (hash.length <= 12) return hash;
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
  };

  return (
    <div className="blockchain-proof glass-card">
      <div className="proof-header">
        <h3 className="proof-title">🔗 Blockchain Proof</h3>
        <span className="verified-badge">✅ Verified</span>
      </div>

      <div className="proof-details">
        <div className="proof-row">
          <span className="proof-label">TX Hash:</span>
          <div className="proof-value-group">
            <span className="proof-value">{shortenHash(txHash)}</span>
            <CopyButton text={txHash} />
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="explorer-link"
              aria-label="View on explorer"
            >
              🔗
            </a>
          </div>
        </div>

        <div className="proof-row">
          <span className="proof-label">Block:</span>
          <span className="proof-value">{blockNumber.toLocaleString()}</span>
        </div>

        <div className="proof-row">
          <span className="proof-label">Time:</span>
          <span className="proof-value">{formatTimestamp(timestamp)}</span>
        </div>
      </div>
    </div>
  );
}

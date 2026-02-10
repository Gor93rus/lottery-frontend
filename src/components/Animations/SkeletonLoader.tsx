import './SkeletonLoader.css';

interface SkeletonLoaderProps {
  type: 'lottery-card' | 'list-item' | 'leaderboard' | 'chart';
  count?: number;
}

function SkeletonLoader({ type, count = 1 }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'lottery-card':
        return (
          <div className="skeleton-lottery-card">
            <div className="skeleton-card-header">
              <div className="skeleton-icon shimmer" />
              <div className="skeleton-title shimmer" />
            </div>
            <div className="skeleton-card-body">
              <div className="skeleton-prize shimmer" />
              <div className="skeleton-details">
                <div className="skeleton-detail-item shimmer" />
                <div className="skeleton-detail-item shimmer" />
                <div className="skeleton-detail-item shimmer" />
              </div>
            </div>
            <div className="skeleton-button shimmer" />
          </div>
        );

      case 'list-item':
        return (
          <div className="skeleton-list-item">
            <div className="skeleton-avatar shimmer" />
            <div className="skeleton-text-group">
              <div className="skeleton-text shimmer" style={{ width: '70%' }} />
              <div className="skeleton-text shimmer" style={{ width: '40%' }} />
            </div>
          </div>
        );

      case 'leaderboard':
        return (
          <div className="skeleton-leaderboard-item">
            <div className="skeleton-rank shimmer" />
            <div className="skeleton-avatar shimmer" />
            <div className="skeleton-text-group">
              <div className="skeleton-text shimmer" style={{ width: '60%' }} />
              <div className="skeleton-text shimmer" style={{ width: '30%' }} />
            </div>
            <div className="skeleton-score shimmer" />
          </div>
        );

      case 'chart':
        return (
          <div className="skeleton-chart">
            <div className="skeleton-chart-header">
              <div className="skeleton-text shimmer" style={{ width: '150px' }} />
            </div>
            <div className="skeleton-chart-body">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton-bar shimmer" style={{ height: `${(i + 1) * 20}%` }} />
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="skeleton-container">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-wrapper">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
}

export default SkeletonLoader;

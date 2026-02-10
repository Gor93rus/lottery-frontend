import { useEffect, useState } from 'react';
import './FinanceStats.css';

interface FinanceStatsProps {
  lotteryId: string;
}

interface Stats {
  totalTicketsSold: number;
  totalRevenue: number;
  totalPrizesPaid: number;
  totalJackpotGrowth: number;
  totalReserve: number;
}

export default function FinanceStats({ lotteryId }: FinanceStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [lotteryId]);

  async function loadStats() {
    try {
      const response = await fetch(
        `/api/admin/finance/lottery/${lotteryId}/stats`,
        {
          headers: {
            'X-Admin-Key': import.meta.env.VITE_ADMIN_API_KEY || '',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="finance-stats-loading">Loading...</div>;
  if (!stats) return <div className="finance-stats-error">No data</div>;

  return (
    <div className="finance-stats">
      <h3 className="finance-stats-title">Financial Statistics</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <label className="stat-label">Total Tickets Sold</label>
          <div className="stat-value">{stats.totalTicketsSold}</div>
        </div>
        <div className="stat-card">
          <label className="stat-label">Total Revenue</label>
          <div className="stat-value">{stats.totalRevenue.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <label className="stat-label">Total Prizes Paid</label>
          <div className="stat-value">{stats.totalPrizesPaid.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <label className="stat-label">Jackpot Growth</label>
          <div className="stat-value">{stats.totalJackpotGrowth.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <label className="stat-label">Reserve Fund</label>
          <div className="stat-value">{stats.totalReserve.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

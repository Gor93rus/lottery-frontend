import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts';
import './WinningsChart.css';

export interface WinningData {
  date: string;
  amount: number;
  lottery: string;
}

interface WinningsChartProps {
  data?: WinningData[];
  period?: 'week' | 'month' | 'all';
}

type ChartType = 'line' | 'bar' | 'area';
type Period = 'week' | 'month' | 'all';

// Mock data generator
const generateMockData = (period: Period): WinningData[] => {
  const data: WinningData[] = [];
  const lotteries = ['Weekend Millions', 'Daily Draw', 'Mega Jackpot', 'Golden Lottery'];
  const days = period === 'week' ? 7 : period === 'month' ? 30 : 90;

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    data.push({
      date: date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
      amount: Math.floor(Math.random() * 5000) + 500,
      lottery: lotteries[Math.floor(Math.random() * lotteries.length)],
    });
  }
  return data;
};

// Aggregate data by date
const aggregateData = (data: WinningData[]) => {
  const aggregated = data.reduce((acc, item) => {
    const existing = acc.find((d) => d.date === item.date);
    if (existing) {
      existing.amount += item.amount;
    } else {
      acc.push({ date: item.date, amount: item.amount });
    }
    return acc;
  }, [] as { date: string; amount: number }[]);
  return aggregated;
};

// Custom tooltip
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{payload[0].payload.date}</p>
        <p className="tooltip-value">
          {payload[0].value?.toLocaleString('ru-RU')} TON
        </p>
      </div>
    );
  }
  return null;
};

function WinningsChart({ data, period = 'week' }: WinningsChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(period);
  const [chartType, setChartType] = useState<ChartType>('line');

  const chartData = data || generateMockData(selectedPeriod);
  const aggregatedData = aggregateData(chartData);

  const renderChart = () => {
    const commonProps = {
      data: aggregatedData,
      margin: { top: 10, right: 10, left: 0, bottom: 0 },
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#df600c" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#f45da6" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#df600c" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#f45da6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#df600c"
              strokeWidth={2}
              fill="url(#areaGradient)"
            />
          </AreaChart>
        );

      default: // line
        return (
          <LineChart {...commonProps}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#df600c" />
                <stop offset="100%" stopColor="#f45da6" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              dot={{ fill: '#df600c', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <motion.div
      className="winnings-chart"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="chart-header">
        <h3 className="chart-title">📊 График выигрышей</h3>
        <div className="chart-controls">
          {/* Chart Type Selector */}
          <div className="chart-type-selector">
            <button
              className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`}
              onClick={() => setChartType('line')}
              title="Линейный график"
            >
              📈
            </button>
            <button
              className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`}
              onClick={() => setChartType('bar')}
              title="Столбчатый график"
            >
              📊
            </button>
            <button
              className={`chart-type-btn ${chartType === 'area' ? 'active' : ''}`}
              onClick={() => setChartType('area')}
              title="Площадной график"
            >
              📉
            </button>
          </div>
        </div>
      </div>

      {/* Period Tabs */}
      <div className="period-tabs">
        <button
          className={`period-tab ${selectedPeriod === 'week' ? 'active' : ''}`}
          onClick={() => setSelectedPeriod('week')}
        >
          7 дней
        </button>
        <button
          className={`period-tab ${selectedPeriod === 'month' ? 'active' : ''}`}
          onClick={() => setSelectedPeriod('month')}
        >
          30 дней
        </button>
        <button
          className={`period-tab ${selectedPeriod === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedPeriod('all')}
        >
          Всё время
        </button>
      </div>

      {/* Chart */}
      <motion.div
        className="chart-container"
        key={`${chartType}-${selectedPeriod}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </motion.div>

      {/* Summary */}
      <div className="chart-summary">
        <div className="summary-item">
          <span className="summary-label">Всего выиграно:</span>
          <span className="summary-value">
            {aggregatedData.reduce((sum, d) => sum + d.amount, 0).toLocaleString('ru-RU')} TON
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Средний выигрыш:</span>
          <span className="summary-value">
            {Math.round(
              aggregatedData.reduce((sum, d) => sum + d.amount, 0) / aggregatedData.length
            ).toLocaleString('ru-RU')}{' '}
            TON
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default WinningsChart;

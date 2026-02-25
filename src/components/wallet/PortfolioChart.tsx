"use client";

import { useMemo, useState } from "react";
import { useDataContext } from "@/context/WalletProvider";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";

interface ChartDataPoint {
  time: string;
  value: number;
}

// Note: Historical data is simulated for visualization purposes.
// In production, this would fetch real historical price data from an API.
const generateMockData = (currentValue: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const now = new Date();
  let value = currentValue * 0.85; // Start at 85% of current value

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Add some variation
    const change = (Math.random() - 0.45) * (currentValue * 0.05);
    value = Math.max(value + change, currentValue * 0.5);

    data.push({
      time: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Number(value.toFixed(2)),
    });
  }

  // Ensure last value is current value
  data[data.length - 1].value = currentValue;

  return data;
};

const TIME_RANGES = [
  { label: "24H", days: 1 },
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y", days: 365 },
];

export function PortfolioChart() {
  const { nativeBalance, tokens } = useDataContext();
  const [selectedRange, setSelectedRange] = useState(30);

  // Calculate total portfolio value
  const totalValue = useMemo(() => {
    const nativeValue = nativeBalance?.valueUsd || 0;
    const tokensValue = tokens.reduce((sum, token) => sum + (token.valueUsd || 0), 0);
    return nativeValue + tokensValue;
  }, [nativeBalance, tokens]);

  // Generate chart data
  const chartData = useMemo(() => {
    const mockData = generateMockData(totalValue);
    if (selectedRange === 1) {
      // For 24H, show hourly data
      return mockData.slice(-24);
    } else if (selectedRange === 7) {
      return mockData.slice(-7);
    }
    return mockData.slice(-Math.min(selectedRange, mockData.length));
  }, [totalValue, selectedRange]);

  // Calculate change
  const change = useMemo(() => {
    if (chartData.length < 2) return { value: 0, percentage: 0 };
    const first = chartData[0].value;
    const last = chartData[chartData.length - 1].value;
    const changeValue = last - first;
    const changePercentage = first > 0 ? (changeValue / first) * 100 : 0;
    return { value: changeValue, percentage: changePercentage };
  }, [chartData]);

  const isPositive = change.value >= 0;

  const formatValue = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-1">Portfolio Value</p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatValue(totalValue)}
            </h2>
            <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {isPositive ? "+" : ""}
                {formatValue(Math.abs(change.value))} ({change.percentage.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[var(--surface-elevated)] rounded-lg">
          {TIME_RANGES.map((range) => (
            <button
              key={range.label}
              onClick={() => setSelectedRange(range.days)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedRange === range.days
                  ? "bg-white dark:bg-[var(--surface-card)] text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3} />
                <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" vertical={false} />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--surface-card)",
                border: "1px solid var(--surface-border)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ color: "var(--text-muted)", fontSize: 12 }}
              formatter={(value) => [formatValue(Number(value) || 0), "Value"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 text-center">
        * Chart shows simulated historical data. Actual portfolio value is shown above.
      </p>
    </div>
  );
}

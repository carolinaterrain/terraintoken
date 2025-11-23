import { useState } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";

interface PriceDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface GoblinMarketChartProps {
  data: PriceDataPoint[];
  support: number;
  resistance: number;
  currentPrice: number;
}

type Timeframe = "1h" | "4h" | "1d";

export const GoblinMarketChart = ({
  data,
  support,
  resistance,
  currentPrice,
}: GoblinMarketChartProps) => {
  const [timeframe, setTimeframe] = useState<Timeframe>("1h");

  // Transform data for candlestick visualization
  const chartData = data.map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    price: d.close,
    candleTop: Math.max(d.open, d.close),
    candleBottom: Math.min(d.open, d.close),
    wickTop: d.high,
    wickBottom: d.low,
    isGreen: d.close >= d.open,
    volume: d.volume / 1000, // Scale down for display
  }));

  return (
    <div className="bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-gold/60 rounded-2xl p-4 shadow-[0_0_30px_rgba(251,191,36,0.3)] relative">
      {/* Timeframe toggles */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {(["1h", "4h", "1d"] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-semibold transition-all",
                timeframe === tf
                  ? "bg-terrain-purple text-foreground shadow-lg shadow-terrain-purple/40"
                  : "border border-terrain-purple/50 text-muted-foreground hover:bg-terrain-purple/10"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
        <div className="text-xs text-muted-foreground hidden lg:block">
          🟢 Goblin Floor (support) · 🟣 Dragon Ceiling (resistance)
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--terrain-purple))" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(var(--goblin-green))" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            opacity={0.2}
          />
          
          <XAxis
            dataKey="time"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            interval="preserveStartEnd"
          />
          
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            domain={["dataMin * 0.95", "dataMax * 1.05"]}
            tickFormatter={(value) => `$${value.toFixed(8)}`}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value: number, name: string) => {
              if (name === "price") return [`$${value.toFixed(8)}`, "Price"];
              if (name === "volume") return [`${(value * 1000).toFixed(0)}`, "Volume"];
              return [value, name];
            }}
          />

          {/* Support line (Goblin Floor) */}
          <ReferenceLine
            y={support}
            stroke="hsl(var(--goblin-green))"
            strokeWidth={2}
            strokeDasharray="5 5"
            label={{
              value: "Goblin Floor",
              fill: "hsl(var(--goblin-green))",
              fontSize: 11,
              position: "left",
            }}
          />

          {/* Resistance line (Dragon Ceiling) */}
          <ReferenceLine
            y={resistance}
            stroke="hsl(var(--terrain-purple))"
            strokeWidth={2}
            strokeDasharray="5 5"
            label={{
              value: "Dragon Ceiling",
              fill: "hsl(var(--terrain-purple))",
              fontSize: 11,
              position: "left",
            }}
          />

          {/* Volume bars */}
          <Bar
            dataKey="volume"
            fill="url(#chartGradient)"
            opacity={0.3}
            yAxisId="volumeAxis"
          />

          {/* Price line */}
          <Line
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--goblin-gold))"
            strokeWidth={2}
            dot={false}
            animationDuration={1000}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Terro the Goblin mascot */}
      <div className="absolute bottom-6 right-6 w-12 h-12 opacity-60 hover:opacity-100 transition-opacity">
        <img
          src="/terrain-mascot.png"
          alt="Terro watching the market"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

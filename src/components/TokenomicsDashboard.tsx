import { GlassCard } from "@/components/ui/glass-card";
import { Progress } from "@/components/ui/progress";
import { Lock, Users, Gift, Coins, TrendingUp, PieChart, CheckCircle } from "lucide-react";
import { useState } from "react";

interface TokenAllocation {
  name: string;
  percentage: number;
  amount: string;
  color: string;
  description: string;
  status: string;
}

const allocations: TokenAllocation[] = [
  {
    name: "DEX Liquidity",
    percentage: 50,
    amount: "5,215,959",
    color: "hsl(var(--primary))",
    description: "Locked liquidity pool",
    status: "Locked"
  },
  {
    name: "Treasury",
    percentage: 25,
    amount: "2,607,980",
    color: "hsl(var(--forest-green))",
    description: "Development & operations",
    status: "Multi-sig"
  },
  {
    name: "Community Rewards",
    percentage: 15,
    amount: "1,564,788",
    color: "hsl(var(--earth-brown))",
    description: "Airdrops & incentives",
    status: "Reserved"
  },
  {
    name: "Team",
    percentage: 10,
    amount: "1,043,192",
    color: "hsl(var(--stone-gray))",
    description: "12mo lock + quarterly vest",
    status: "Vested"
  }
];

const TokenomicsDashboard = () => {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const totalSupply = 10431918;

  // Calculate SVG pie chart slices
  const calculateSlice = (percentage: number, startPercentage: number) => {
    const radius = 100;
    const circumference = 2 * Math.PI * radius;
    const offset = (startPercentage / 100) * circumference;
    const dashArray = `${(percentage / 100) * circumference} ${circumference}`;
    
    return { offset, dashArray };
  };

  let cumulativePercentage = 0;

  return (
    <div className="space-y-8">
      {/* Interactive Pie Chart */}
      <GlassCard className="p-8">
        <h3 className="font-display text-2xl font-bold mb-6 text-center">
          Token Distribution
        </h3>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          {/* Pie Chart */}
          <div className="relative">
            <svg width="280" height="280" viewBox="0 0 280 280" className="transform -rotate-90">
              <circle
                cx="140"
                cy="140"
                r="100"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="80"
                opacity="0.1"
              />
              {allocations.map((alloc, index) => {
                const slice = calculateSlice(alloc.percentage, cumulativePercentage);
                const isHovered = hoveredSlice === index;
                const result = (
                  <circle
                    key={index}
                    cx="140"
                    cy="140"
                    r="100"
                    fill="none"
                    stroke={alloc.color}
                    strokeWidth={isHovered ? "90" : "80"}
                    strokeDasharray={slice.dashArray}
                    strokeDashoffset={-slice.offset}
                    className="transition-all duration-300 cursor-pointer"
                    opacity={hoveredSlice === null ? 1 : isHovered ? 1 : 0.3}
                    onMouseEnter={() => setHoveredSlice(index)}
                    onMouseLeave={() => setHoveredSlice(null)}
                  />
                );
                cumulativePercentage += alloc.percentage;
                return result;
              })}
            </svg>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-display text-3xl font-bold text-primary">
                {hoveredSlice !== null ? `${allocations[hoveredSlice].percentage}%` : "10.43M"}
              </p>
              <p className="text-sm text-muted-foreground">
                {hoveredSlice !== null ? allocations[hoveredSlice].name : "Total Supply"}
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {allocations.map((alloc, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                  hoveredSlice === index ? 'bg-background/50 border border-primary/30' : 'bg-background/20'
                }`}
                onMouseEnter={() => setHoveredSlice(index)}
                onMouseLeave={() => setHoveredSlice(null)}
              >
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: alloc.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-display font-semibold text-sm">{alloc.name}</p>
                    <p className="font-bold text-primary text-sm">{alloc.percentage}%</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{alloc.amount} TRN</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allocations.map((alloc, index) => (
          <GlassCard key={index} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: alloc.color }}
                />
                <div>
                  <h4 className="font-display font-bold">{alloc.name}</h4>
                  <p className="text-xs text-muted-foreground">{alloc.description}</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-primary/10 rounded text-xs font-semibold text-primary">
                {alloc.status}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Allocation:</span>
                <span className="font-bold text-primary">{alloc.amount} TRN</span>
              </div>
              <Progress value={alloc.percentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span className="font-bold text-primary">{alloc.percentage}%</span>
                <span>100%</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Key Safeguards */}
      <GlassCard className="p-8 bg-gradient-to-br from-primary/10 to-primary/5">
        <h3 className="font-display text-2xl font-bold mb-6 text-center">
          🛡️ Built-In Safeguards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Lock className="w-12 h-12 text-primary mx-auto mb-3" />
            <h4 className="font-display font-semibold mb-2">Liquidity Locked</h4>
            <p className="text-sm text-muted-foreground">
              50% of supply in locked LP tokens. No rug pull possible.
            </p>
          </div>
          <div className="text-center">
            <Users className="w-12 h-12 text-primary mx-auto mb-3" />
            <h4 className="font-display font-semibold mb-2">Multi-Sig Treasury</h4>
            <p className="text-sm text-muted-foreground">
              Multiple approvals required. No single point of failure.
            </p>
          </div>
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-3" />
            <h4 className="font-display font-semibold mb-2">Team Vested</h4>
            <p className="text-sm text-muted-foreground">
              12-month cliff + quarterly release. Long-term alignment.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Supply Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-6 text-center">
          <Coins className="w-8 h-8 text-primary mx-auto mb-3" />
          <p className="text-2xl font-bold text-primary mb-1">{totalSupply.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total Supply</p>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
          <p className="text-2xl font-bold text-primary mb-1">~5.2M</p>
          <p className="text-xs text-muted-foreground">Circulating</p>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
          <p className="text-2xl font-bold text-primary mb-1">0</p>
          <p className="text-xs text-muted-foreground">Can Be Minted</p>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <PieChart className="w-8 h-8 text-primary mx-auto mb-3" />
          <p className="text-2xl font-bold text-primary mb-1">~1%</p>
          <p className="text-xs text-muted-foreground">Dev Holdings</p>
        </GlassCard>
      </div>
    </div>
  );
};

export default TokenomicsDashboard;

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useHolderDistribution } from "@/hooks/useHolderDistribution";
import { Loader2 } from "lucide-react";

const TIER_COLORS = {
  shrimp: "#94a3b8",
  crab: "#64748b",
  fish: "#334155",
  dolphin: "#22c55e",
  shark: "#fbbf24",
  whale: "#8b5cf6",
  humpback: "#7c3aed",
};

const TIER_EMOJIS = {
  shrimp: "🦐",
  crab: "🦀",
  fish: "🐟",
  dolphin: "🐬",
  shark: "🦈",
  whale: "🐋",
  humpback: "🐳",
};

export function WhaleDistributionChart() {
  const { data, isLoading } = useHolderDistribution();

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-goblin-gold" />
        </div>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  // Transform data for chart
  const distribution = [
    { tier: "shrimp", count: data.tiers.shrimp, percentage: (data.tiers.shrimp / data.totalHolders) * 100, range: "<10K" },
    { tier: "crab", count: data.tiers.crab, percentage: (data.tiers.crab / data.totalHolders) * 100, range: "10K-100K" },
    { tier: "fish", count: data.tiers.fish, percentage: (data.tiers.fish / data.totalHolders) * 100, range: "100K-500K" },
    { tier: "dolphin", count: data.tiers.dolphin, percentage: (data.tiers.dolphin / data.totalHolders) * 100, range: "500K-1M" },
    { tier: "shark", count: data.tiers.shark, percentage: (data.tiers.shark / data.totalHolders) * 100, range: "1M-5M" },
    { tier: "whale", count: data.tiers.whale, percentage: (data.tiers.whale / data.totalHolders) * 100, range: "5M-10M" },
    { tier: "humpback", count: data.tiers.humpback, percentage: (data.tiers.humpback / data.totalHolders) * 100, range: ">10M" },
  ];

  const top10Percentage = data.top10Percentage;

  const isHealthy = top10Percentage < 30;

  return (
    <Card className="p-6 border-goblin-gold/30">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            🐋 Holder Distribution
            {isHealthy && (
              <Badge className="bg-goblin-green text-black">
                Healthy Distribution
              </Badge>
            )}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Live on-chain data • Updates hourly
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-goblin-gold">{top10Percentage.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">Top Whales Hold</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={distribution} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis type="number" stroke="#94a3b8" />
          <YAxis
            type="category"
            dataKey="tier"
            stroke="#94a3b8"
            tickFormatter={(value) => `${TIER_EMOJIS[value as keyof typeof TIER_EMOJIS]} ${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#050314",
              border: "1px solid rgba(251, 191, 36, 0.3)",
              borderRadius: "8px",
            }}
            formatter={(value: any, name: string, props: any) => [
              `${props.payload.count} holders (${value}%)`,
              `Range: ${props.payload.range}`,
            ]}
          />
          <Bar dataKey="percentage" radius={[0, 8, 8, 0]}>
            {distribution?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={TIER_COLORS[entry.tier as keyof typeof TIER_COLORS]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 p-4 bg-muted/20 rounded-lg">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>Why this matters:</strong> Token concentration shows if a few wallets control most supply.
          Top holders owning &lt;30% is considered healthy and reduces manipulation risk.
          TRN's distribution reflects genuine community adoption, not whale control.
        </p>
      </div>
    </Card>
  );
}

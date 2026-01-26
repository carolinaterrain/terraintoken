import { GlassCard } from "@/components/ui/glass-card";
import { Users, Shield, AlertTriangle, Coins } from "lucide-react";
import type { AirdropStats } from "@/hooks/useAirdropRecipients";

interface AirdropStatsCardsProps {
  stats: AirdropStats;
}

export function AirdropStatsCards({ stats }: AirdropStatsCardsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
    return num.toFixed(0);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <GlassCard className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Recipients</p>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <Shield className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Safe Addresses</p>
            <p className="text-2xl font-bold text-green-500">{stats.safe}</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Filtered Out</p>
            <p className="text-2xl font-bold text-red-500">{stats.filtered}</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10">
            <Coins className="w-5 h-5 text-cyan-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Safe Tokens</p>
            <p className="text-2xl font-bold text-cyan-500">
              {formatNumber(stats.safeTokens)}
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

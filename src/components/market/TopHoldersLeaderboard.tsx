import { Trophy, Medal, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { DataFreshnessBadge, DataSource } from "@/components/ui/data-freshness-badge";

interface Holder {
  address: string;
  balance: number;
  percentage: number;
  rank: number;
}

export const TopHoldersLeaderboard = () => {
  const { data: holders, isLoading } = useQuery({
    queryKey: ["top-holders-leaderboard"],
    queryFn: async () => {
      // Fetch real holder data from Helius via edge function
      const { data, error } = await supabase.functions.invoke("fetch-holder-data");
      
      if (error || !data || !data.holders || data.holders.length === 0) {
        console.error("Error fetching holder data:", error);
        return { holders: [], source: 'fallback' as DataSource, lastUpdated: new Date().toISOString() };
      }

      // Process real holder data
      const processedHolders: Holder[] = data.holders.slice(0, 10).map((h: any, idx: number) => ({
        address: `${h.address.slice(0, 6)}...${h.address.slice(-4)}`,
        balance: h.balance,
        percentage: h.percentage,
        rank: idx + 1,
      }));

      return {
        holders: processedHolders,
        source: (data.source || 'live') as DataSource,
        lastUpdated: data.lastUpdated || new Date().toISOString(),
      };
    },
    refetchInterval: 300000, // Refresh every 5 minutes
    staleTime: 240000,
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-goblin-gold" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-orange-600" />;
    return <span className="text-sm text-muted-foreground">#{rank}</span>;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-64" />
      </Card>
    );
  }

  const holdersList = holders?.holders || [];
  const dataSource = holders?.source || 'fallback';
  const lastUpdated = holders?.lastUpdated;

  if (holdersList.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-gold/60">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-goblin-gold" />
            Top Holders Leaderboard
          </h3>
          <DataFreshnessBadge source="fallback" />
        </div>
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          Loading holder data...
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-gold/60">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-goblin-gold" />
          Top Holders Leaderboard
        </h3>
        <DataFreshnessBadge source={dataSource} lastUpdated={lastUpdated} />
      </div>

      <div className="space-y-2">
        {holdersList.map((holder) => (
          <div
            key={holder.address}
            className={`flex items-center justify-between p-3 rounded-lg transition-all ${
              holder.rank <= 3
                ? "bg-gradient-to-r from-goblin-gold/20 to-terrain-purple/20 border border-goblin-gold/40"
                : "bg-terrain-shadow hover:bg-terrain-shadow/80"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 flex justify-center">
                {getRankIcon(holder.rank)}
              </div>
              <div>
                <p className="text-sm font-mono font-semibold">{holder.address}</p>
                <p className="text-xs text-muted-foreground">
                  {(holder.balance / 1000000).toFixed(2)}M TRN
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-goblin-green">
                {holder.percentage.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">of supply</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          Top 10 holders shown • Updates every 5 minutes
        </p>
      </div>
    </Card>
  );
};

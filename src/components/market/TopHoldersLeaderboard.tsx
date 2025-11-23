import { Trophy, Medal, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { DataBadge } from "./DataBadge";

interface Holder {
  address: string;
  balance: number;
  percentage: number;
  rank: number;
}

export const TopHoldersLeaderboard = () => {
  const { data: holders, isLoading } = useQuery({
    queryKey: ["top-holders"],
    queryFn: async () => {
      // Fetch holder data from edge function
      const { data } = await supabase.functions.invoke("fetch-trn-holders");
      
      // Mock data for now - in production this would come from Helius
      const mockHolders: Holder[] = [
        { address: "7xKXtg...9mBq", balance: 12500000, percentage: 12.5, rank: 1 },
        { address: "9pLMnT...3vCd", balance: 8900000, percentage: 8.9, rank: 2 },
        { address: "4kRtYu...7wXz", balance: 6200000, percentage: 6.2, rank: 3 },
        { address: "2nFdPs...5mNx", balance: 4800000, percentage: 4.8, rank: 4 },
        { address: "8vQwZx...1kPt", balance: 3500000, percentage: 3.5, rank: 5 },
        { address: "5jHgTr...9bLm", balance: 2900000, percentage: 2.9, rank: 6 },
        { address: "3xCvBn...4wQs", balance: 2300000, percentage: 2.3, rank: 7 },
        { address: "6mKpLz...8rDf", balance: 1800000, percentage: 1.8, rank: 8 },
        { address: "1wRtYx...2nVc", balance: 1500000, percentage: 1.5, rank: 9 },
        { address: "9bNmQs...6pKj", balance: 1200000, percentage: 1.2, rank: 10 },
      ];

      return mockHolders;
    },
    refetchInterval: 300000, // Refresh every 5 minutes
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

  return (
    <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-gold/60">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-goblin-gold" />
          Top Holders Leaderboard
        </h3>
        <DataBadge type="demo" />
      </div>

      <div className="space-y-2">
        {holders?.map((holder) => (
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
                {holder.percentage}%
              </p>
              <p className="text-xs text-muted-foreground">of supply</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          Data updates every 5 minutes • Top 10 holders shown
        </p>
      </div>
    </Card>
  );
};

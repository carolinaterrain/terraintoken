import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Crown, Award, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LeaderboardEntry {
  id: string;
  wallet_address: string;
  total_purchases: number;
  total_trn_purchased: number;
  fastest_buy_seconds: number | null;
  biggest_purchase_trn: number;
  consecutive_days: number;
}

export const PurchaseLeaderboard = () => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from("purchase_leaderboard")
      .select("*")
      .order("total_trn_purchased", { ascending: false })
      .limit(10);

    if (!error && data) {
      setLeaders(data);
    }
    setLoading(false);
  };

  const formatWallet = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-orange-600" />;
      default:
        return <span className="text-muted-foreground">#{index + 1}</span>;
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-gold/60">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-goblin-gold flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Goblin Leaderboard
          </h3>
          <Badge variant="outline" className="bg-goblin-green/20 text-goblin-green border-goblin-green">
            <Zap className="w-3 h-3 mr-1" />
            Top Buyers
          </Badge>
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading leaderboard...
            </div>
          ) : leaders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No purchases yet. Be the first goblin on the leaderboard!
            </div>
          ) : (
            leaders.map((leader, index) => (
              <div
                key={leader.id}
                className={`p-4 rounded-lg border-2 transition-all hover:scale-[1.02] ${
                  index === 0
                    ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50"
                    : index === 1
                    ? "bg-gradient-to-r from-gray-500/20 to-gray-600/20 border-gray-500/50"
                    : index === 2
                    ? "bg-gradient-to-r from-orange-600/20 to-red-600/20 border-orange-600/50"
                    : "bg-terrain-shadow/50 border-goblin-gold/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(index)}
                    </div>
                    <div>
                      <div className="font-mono text-sm font-bold">
                        {formatWallet(leader.wallet_address)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {leader.total_purchases} purchase
                        {leader.total_purchases !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-goblin-green">
                      {(leader.total_trn_purchased / 1000000).toFixed(2)}M
                    </div>
                    <div className="text-xs text-muted-foreground">TRN</div>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="mt-2 pt-2 border-t border-goblin-gold/20 flex gap-3 text-xs">
                  {leader.fastest_buy_seconds && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Zap className="w-3 h-3" />
                      {leader.fastest_buy_seconds}s fastest
                    </div>
                  )}
                  {leader.consecutive_days > 1 && (
                    <div className="flex items-center gap-1 text-goblin-green">
                      🔥 {leader.consecutive_days} day streak
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center text-xs text-muted-foreground pt-2 border-t border-goblin-gold/20">
          Updated in real-time • Rankings based on total TRN purchased
        </div>
      </div>
    </Card>
  );
};

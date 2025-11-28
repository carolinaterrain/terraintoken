import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp } from "lucide-react";

const Leaderboard = () => {
  const { data: allTimeLeaders, isLoading } = useQuery({
    queryKey: ["leaderboard-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("terrain_contributors_leaderboard")
        .select("*")
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  const truncateWallet = (wallet: string) => {
    if (!wallet) return "Anonymous";
    return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background/50 to-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Top Contributors
          </h2>
          <p className="font-body text-muted-foreground">
            Leading the terrain intelligence revolution
          </p>
        </div>

        <GlassCard className="p-6">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading leaderboard...</div>
          ) : allTimeLeaders && allTimeLeaders.length > 0 ? (
            <div className="space-y-3">
              {allTimeLeaders.map((leader) => (
                <div 
                  key={leader.user_wallet_address}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl w-12 text-center">
                      {getRankBadge(leader.rank)}
                    </div>
                    <div>
                      <div className="font-display font-bold">
                        {truncateWallet(leader.user_wallet_address)}
                      </div>
                      <div className="font-body text-sm text-muted-foreground">
                        {leader.total_uploads} uploads • {leader.badges_earned} badges
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl font-bold text-primary">
                      {Number(leader.total_trn_earned).toFixed(0)} TRN
                    </div>
                    {leader.reputation_score > 0 && (
                      <Badge variant="secondary" className="mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {leader.reputation_score} rep
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Be the first to earn TRN! Upload your terrain photos now.
            </div>
          )}
        </GlassCard>
      </div>
    </section>
  );
};

export default Leaderboard;

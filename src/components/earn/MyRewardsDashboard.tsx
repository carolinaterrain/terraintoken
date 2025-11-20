import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Wallet, TrendingUp, Upload, Award } from "lucide-react";
import { toast } from "sonner";

const MyRewardsDashboard = () => {
  const [walletInput, setWalletInput] = useState("");
  const [searchedWallet, setSearchedWallet] = useState("");

  const { data: userStats, isLoading } = useQuery({
    queryKey: ["user-stats", searchedWallet],
    queryFn: async () => {
      if (!searchedWallet) return null;
      
      const { data, error } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_wallet_address", searchedWallet)
        .single();
      
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!searchedWallet
  });

  const { data: userAchievements } = useQuery({
    queryKey: ["user-achievements", searchedWallet],
    queryFn: async () => {
      if (!searchedWallet) return [];
      
      const { data, error } = await supabase
        .from("user_achievements")
        .select("*")
        .eq("user_wallet_address", searchedWallet);
      
      if (error) throw error;
      return data;
    },
    enabled: !!searchedWallet
  });

  const { data: pendingRewards } = useQuery({
    queryKey: ["pending-rewards", searchedWallet],
    queryFn: async () => {
      if (!searchedWallet) return [];
      
      const { data, error } = await supabase
        .from("trn_rewards")
        .select("*")
        .eq("user_wallet_address", searchedWallet)
        .eq("transaction_status", "pending")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!searchedWallet
  });

  const handleSearch = () => {
    if (!walletInput.trim()) {
      toast.error("Please enter a wallet address");
      return;
    }
    setSearchedWallet(walletInput.trim());
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-8">
          My Rewards Dashboard
        </h2>

        <GlassCard className="p-6 mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter your Solana wallet address..."
                value={walletInput}
                onChange={(e) => setWalletInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </GlassCard>

        {searchedWallet && (
          <>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading your rewards...
              </div>
            ) : userStats ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <GlassCard className="p-6 text-center">
                    <Wallet className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="font-display text-3xl font-bold text-primary mb-1">
                      {Number(userStats.total_trn_earned).toFixed(0)}
                    </div>
                    <div className="font-body text-sm text-muted-foreground">Total TRN Earned</div>
                  </GlassCard>

                  <GlassCard className="p-6 text-center">
                    <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="font-display text-3xl font-bold mb-1">
                      {userStats.total_uploads}
                    </div>
                    <div className="font-body text-sm text-muted-foreground">Uploads</div>
                  </GlassCard>

                  <GlassCard className="p-6 text-center">
                    <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <div className="font-display text-3xl font-bold mb-1">
                      {userAchievements?.length || 0}
                    </div>
                    <div className="font-body text-sm text-muted-foreground">Badges</div>
                  </GlassCard>

                  <GlassCard className="p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="font-display text-3xl font-bold mb-1">
                      {userStats.reputation_score}
                    </div>
                    <div className="font-body text-sm text-muted-foreground">Reputation</div>
                  </GlassCard>
                </div>

                {pendingRewards && pendingRewards.length > 0 && (
                  <GlassCard className="p-6">
                    <h3 className="font-display text-xl font-bold mb-4">Pending Rewards</h3>
                    <div className="space-y-2">
                      {pendingRewards.map((reward) => (
                        <div key={reward.id} className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                          <div>
                            <Badge variant="secondary" className="mb-1">
                              {reward.reward_type}
                            </Badge>
                            <div className="font-body text-sm text-muted-foreground">
                              {new Date(reward.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="font-display text-lg font-bold text-primary">
                            +{Number(reward.trn_amount).toFixed(0)} TRN
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}
              </div>
            ) : (
              <GlassCard className="p-12 text-center">
                <div className="text-4xl mb-4">⛏️</div>
                <h3 className="font-display text-xl font-bold mb-2">No rewards yet</h3>
                <p className="font-body text-muted-foreground mb-6">
                  Start uploading terrain photos to earn your first TRN!
                </p>
                <Button asChild>
                  <a href="/upload-project">Upload Now</a>
                </Button>
              </GlassCard>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default MyRewardsDashboard;

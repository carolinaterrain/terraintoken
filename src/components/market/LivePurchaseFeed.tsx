import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Flame, TrendingUp, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Purchase {
  id: string;
  wallet_address: string;
  amount_trn: number;
  purchase_tier: string;
  created_at: string;
}

const TIER_CONFIG = {
  shrimp: { emoji: "🦐", name: "Shrimp", color: "text-gray-400" },
  crab: { emoji: "🦀", name: "Crab", color: "text-orange-500" },
  dolphin: { emoji: "🐬", name: "Dolphin", color: "text-cyan-500" },
  shark: { emoji: "🦈", name: "Shark", color: "text-blue-500" },
  whale: { emoji: "🐋", name: "Whale", color: "text-purple-500" },
};

export const LivePurchaseFeed = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [recentCount, setRecentCount] = useState(0);

  useEffect(() => {
    // Fetch initial purchases
    fetchRecentPurchases();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("trn-purchases")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "trn_purchases",
        },
        (payload) => {
          const newPurchase = payload.new as Purchase;
          setPurchases((prev) => [newPurchase, ...prev.slice(0, 9)]);
          setRecentCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRecentPurchases = async () => {
    const { data, error } = await supabase
      .from("trn_purchases")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error && data) {
      setPurchases(data);
      
      // Count purchases in last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recent = data.filter(
        (p) => new Date(p.created_at) > oneHourAgo
      ).length;
      setRecentCount(recent);
    }
  };

  const formatWallet = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-gold/30">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-goblin-gold flex items-center gap-2">
            <Flame className="w-5 h-5 animate-pulse" />
            Live Purchase Feed
          </h3>
          <div className="flex items-center gap-2 text-xs text-goblin-green">
            <TrendingUp className="w-4 h-4" />
            {recentCount} buys/hour
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-terrain-shadow/50 p-2 rounded">
            <div className="text-muted-foreground">Total Purchases</div>
            <div className="font-bold text-foreground">{purchases.length}</div>
          </div>
          <div className="bg-terrain-shadow/50 p-2 rounded">
            <div className="text-muted-foreground">Recent Activity</div>
            <div className="font-bold text-goblin-green flex items-center gap-1">
              <Zap className="w-3 h-3" />
              High
            </div>
          </div>
        </div>

        {/* Purchase List */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {purchases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No purchases yet. Be the first goblin to buy!
            </div>
          ) : (
            purchases.map((purchase) => {
              const tier =
                TIER_CONFIG[purchase.purchase_tier as keyof typeof TIER_CONFIG];
              return (
                <div
                  key={purchase.id}
                  className="bg-terrain-shadow/30 p-3 rounded-lg border border-goblin-gold/20 hover:border-goblin-gold/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{tier?.emoji || "🎯"}</span>
                      <div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {formatWallet(purchase.wallet_address)}
                        </div>
                        <div className={`text-sm font-bold ${tier?.color}`}>
                          became a {tier?.name || "Buyer"}!
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-goblin-green">
                        +{(purchase.amount_trn / 1000000).toFixed(2)}M TRN
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(purchase.created_at), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {purchases.length > 0 && (
          <div className="text-center text-xs text-muted-foreground pt-2 border-t border-goblin-gold/20">
            🎉 The goblin horde grows stronger!
          </div>
        )}
      </div>
    </Card>
  );
};

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Lock } from "lucide-react";
import { useEffect } from "react";

interface NFTBadgeDisplayProps {
  walletAddress?: string;
}

export const NFTBadgeDisplay = ({ walletAddress }: NFTBadgeDisplayProps) => {
  const { data: nftBadges, refetch } = useQuery({
    queryKey: ["nft-badges", walletAddress],
    queryFn: async () => {
      if (!walletAddress) return [];
      const { data } = await supabase
        .from("nft_achievements")
        .select("*")
        .eq("user_wallet", walletAddress)
        .order("minted_at", { ascending: false });
      return data || [];
    },
    enabled: !!walletAddress,
  });

  // Subscribe to realtime updates
  useEffect(() => {
    if (!walletAddress) return;

    const channel = supabase
      .channel("nft-achievements-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "nft_achievements",
          filter: `user_wallet=eq.${walletAddress}`,
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [walletAddress, refetch]);

  if (!walletAddress) {
    return (
      <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-border/40">
        <div className="text-center py-8">
          <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Connect wallet to view NFT badges</p>
        </div>
      </Card>
    );
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "from-purple-500 via-pink-500 to-orange-500";
      case "epic":
        return "from-purple-400 to-pink-400";
      case "rare":
        return "from-blue-400 to-cyan-400";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-gold/40">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-goblin-gold" />
          NFT Achievement Badges
        </h3>
        <Badge variant="outline" className="text-xs">
          {nftBadges?.length || 0} Earned
        </Badge>
      </div>

      {!nftBadges || nftBadges.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-2">No badges earned yet</p>
          <p className="text-xs text-muted-foreground">
            Make predictions to unlock collectible NFTs!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {nftBadges.map((badge) => (
            <div
              key={badge.id}
              className="relative group cursor-pointer transform transition-all hover:scale-105"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(
                  badge.rarity
                )} opacity-20 rounded-lg blur-xl group-hover:opacity-40 transition-opacity`}
              />
              <div className="relative bg-terrain-shadow/80 border-2 border-border/40 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-4xl mb-2 text-center">{badge.nft_name.split(" ")[0]}</div>
                <div className="text-xs font-bold text-center mb-1 truncate">
                  {badge.nft_name.split(" ").slice(1).join(" ")}
                </div>
                <Badge
                  variant="outline"
                  className={`w-full text-xs justify-center bg-gradient-to-r ${getRarityColor(
                    badge.rarity
                  )} text-white border-0`}
                >
                  {badge.rarity.toUpperCase()}
                </Badge>
                <p className="text-xs text-muted-foreground text-center mt-2 line-clamp-2">
                  {badge.nft_description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Locked Achievements Preview */}
      <div className="mt-6 pt-4 border-t border-border/40">
        <h4 className="text-xs font-bold mb-3 text-muted-foreground">Locked Achievements</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { icon: "🔮", name: "Crystal Ball", req: "10 correct" },
            { icon: "🧙", name: "Market Sage", req: "90% accuracy" },
            { icon: "🔥", name: "Streak Master", req: "10 streak" },
            { icon: "👑", name: "Contrarian", req: "Against the crowd" },
          ].map((locked) => (
            <div
              key={locked.name}
              className="bg-terrain-shadow/50 border border-border/20 rounded p-2 text-center opacity-50"
            >
              <div className="text-2xl mb-1 grayscale">{locked.icon}</div>
              <div className="text-xs font-bold truncate">{locked.name}</div>
              <div className="text-xs text-muted-foreground">{locked.req}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
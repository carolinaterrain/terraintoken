import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Lock, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface AchievementTrackerProps {
  walletAddress?: string;
}

const ACHIEVEMENTS = [
  {
    id: "first_prediction",
    name: "Crystal Ball",
    description: "Make your first price prediction",
    icon: "🔮",
    rarity: "common",
  },
  {
    id: "diamond_hands",
    name: "Diamond Hands",
    description: "Hold TRN through a 20% dip without selling",
    icon: "💎",
    rarity: "rare",
  },
  {
    id: "early_bird",
    name: "Early Bird",
    description: "Join before 2,000 holders",
    icon: "🐦",
    rarity: "epic",
  },
  {
    id: "whale_status",
    name: "Whale Status",
    description: "Hold more than 5M TRN",
    icon: "🐋",
    rarity: "legendary",
  },
  {
    id: "governance_voter",
    name: "Governance Voter",
    description: "Vote on 5 governance proposals",
    icon: "🗳️",
    rarity: "common",
  },
  {
    id: "chat_master",
    name: "Chat Master",
    description: "Send 100 messages in market chat",
    icon: "💬",
    rarity: "uncommon",
  },
  {
    id: "prediction_streak",
    name: "Oracle",
    description: "Get 5 predictions correct in a row",
    icon: "🎯",
    rarity: "epic",
  },
  {
    id: "community_builder",
    name: "Community Builder",
    description: "Refer 10 new holders",
    icon: "🤝",
    rarity: "rare",
  },
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "common": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    case "uncommon": return "bg-green-500/20 text-green-400 border-green-500/30";
    case "rare": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "epic": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "legendary": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    default: return "bg-muted";
  }
};

export const AchievementTracker = ({ walletAddress }: AchievementTrackerProps) => {
  const { toast } = useToast();

  const { data: unlockedAchievements, refetch } = useQuery({
    queryKey: ["market-achievements", walletAddress],
    queryFn: async () => {
      if (!walletAddress) return [];

      const { data } = await supabase
        .from("market_achievements")
        .select("*")
        .eq("user_wallet", walletAddress);

      return data || [];
    },
    enabled: !!walletAddress,
  });

  // Check for new achievements
  useEffect(() => {
    const checkAchievements = async () => {
      if (!walletAddress || !unlockedAchievements) return;

      const unlockedIds = unlockedAchievements.map((a: any) => a.achievement_id);

      // Check first prediction achievement
      const { data: predictions } = await supabase
        .from("market_predictions")
        .select("id")
        .eq("user_wallet", walletAddress)
        .limit(1);

      if (predictions && predictions.length > 0 && !unlockedIds.includes("first_prediction")) {
        await unlockAchievement("first_prediction");
      }
    };

    checkAchievements();
  }, [walletAddress, unlockedAchievements]);

  const unlockAchievement = async (achievementId: string) => {
    if (!walletAddress) return;

    const { error } = await supabase.from("market_achievements").insert({
      achievement_id: achievementId,
      user_wallet: walletAddress,
    });

    if (!error) {
      const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
      toast({
        title: "🎉 Achievement Unlocked!",
        description: `${achievement?.icon} ${achievement?.name}`,
      });
      refetch();
    }
  };

  const unlockedIds = unlockedAchievements?.map((a: any) => a.achievement_id) || [];
  const progress = (unlockedIds.length / ACHIEVEMENTS.length) * 100;

  return (
    <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-terrain-purple/60">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-goblin-gold" />
            Achievements
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {unlockedIds.length} / {ACHIEVEMENTS.length} unlocked
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-goblin-gold">{progress.toFixed(0)}%</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-terrain-shadow rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-goblin-gold to-terrain-purple transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlockedIds.includes(achievement.id);

          return (
            <div
              key={achievement.id}
              className={`p-3 rounded-lg border transition-all ${
                isUnlocked
                  ? `${getRarityColor(achievement.rarity)} border`
                  : "bg-terrain-shadow/50 border-border opacity-50"
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-2xl">{achievement.icon}</span>
                {isUnlocked ? (
                  <Check className="w-4 h-4 text-goblin-green" />
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <h4 className="text-sm font-bold">{achievement.name}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {achievement.description}
              </p>
              <Badge variant="outline" className="mt-2 text-xs">
                {achievement.rarity}
              </Badge>
            </div>
          );
        })}
      </div>

      {!walletAddress && (
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Connect wallet to unlock achievements
          </p>
        </div>
      )}
    </Card>
  );
};
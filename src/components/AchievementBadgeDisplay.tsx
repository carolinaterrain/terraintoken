import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Trophy, Lock } from "lucide-react";
import { toast } from "sonner";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  trn_reward: number;
  rarity: string;
  earned?: boolean;
  earned_at?: string;
}

interface AchievementBadgeDisplayProps {
  walletAddress?: string;
}

export const AchievementBadgeDisplay = ({ walletAddress }: AchievementBadgeDisplayProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [earnedCount, setEarnedCount] = useState(0);

  useEffect(() => {
    const fetchAchievements = async () => {
      // Get all achievement definitions
      const { data: definitions } = await supabase
        .from('achievement_definitions')
        .select('*')
        .order('trn_reward', { ascending: false });

      if (!definitions) return;

      if (walletAddress) {
        // Get user's earned achievements
        const { data: earned } = await supabase
          .from('user_achievements')
          .select('achievement_id, earned_at')
          .eq('user_wallet_address', walletAddress);

        const earnedMap = new Map(earned?.map(e => [e.achievement_id, e.earned_at]) || []);
        
        const achievementsWithStatus = definitions.map(def => ({
          ...def,
          earned: earnedMap.has(def.id),
          earned_at: earnedMap.get(def.id)
        }));

        setAchievements(achievementsWithStatus);
        setEarnedCount(earnedMap.size);
      } else {
        setAchievements(definitions);
      }
    };

    fetchAchievements();
  }, [walletAddress]);

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: 'bg-gray-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-amber-500'
    };
    return colors[rarity] || colors.common;
  };

  const checkAchievements = async () => {
    if (!walletAddress) {
      toast.error("Connect wallet to check achievements");
      return;
    }

    const { data, error } = await supabase.functions.invoke('check-achievements', {
      body: { wallet_address: walletAddress }
    });

    if (error) {
      toast.error("Failed to check achievements");
      return;
    }

    if (data.new_achievements && data.new_achievements.length > 0) {
      data.new_achievements.forEach((ach: Achievement) => {
        toast.success(`🎉 Achievement Unlocked: ${ach.name}! (+${ach.trn_reward} TRN)`);
      });
      // Refresh achievements
      window.location.reload();
    } else {
      toast.info("No new achievements yet. Keep contributing!");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Achievements
          {walletAddress && (
            <Badge variant="secondary">
              {earnedCount} / {achievements.length}
            </Badge>
          )}
        </CardTitle>
        {walletAddress && (
          <button
            onClick={checkAchievements}
            className="text-sm text-primary hover:underline"
          >
            Check Progress
          </button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                achievement.earned
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-muted/30 opacity-60'
              }`}
            >
              <div className="text-center space-y-2">
                <div className="text-4xl mb-2">
                  {achievement.earned ? achievement.icon : <Lock className="w-8 h-8 mx-auto text-muted-foreground" />}
                </div>
                <div className={`inline-block px-2 py-1 rounded text-xs font-bold text-white ${getRarityColor(achievement.rarity)}`}>
                  {achievement.rarity.toUpperCase()}
                </div>
                <h4 className="font-semibold text-sm">{achievement.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {achievement.description}
                </p>
                <div className="text-xs font-bold text-primary">
                  +{achievement.trn_reward} TRN
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

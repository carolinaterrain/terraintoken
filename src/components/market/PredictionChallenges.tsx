import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Trophy } from "lucide-react";

interface PredictionChallengesProps {
  walletAddress?: string;
}

export const PredictionChallenges = ({ walletAddress }: PredictionChallengesProps) => {
  const { toast } = useToast();

  const { data: challenges } = useQuery({
    queryKey: ["prediction-challenges"],
    queryFn: async () => {
      const { data } = await supabase
        .from("prediction_challenges")
        .select("*")
        .eq("active", true)
        .order("trn_reward", { ascending: true });
      return data || [];
    },
  });

  const { data: userProgress, refetch } = useQuery({
    queryKey: ["user-challenge-progress", walletAddress],
    queryFn: async () => {
      if (!walletAddress) return [];
      const { data } = await supabase
        .from("user_challenge_progress")
        .select("*")
        .eq("user_wallet", walletAddress);
      return data || [];
    },
    enabled: !!walletAddress,
  });

  const claimReward = async (challengeId: string, reward: number) => {
    if (!walletAddress) return;

    try {
      const { error } = await supabase
        .from("user_challenge_progress")
        .update({ claimed: true, claimed_at: new Date().toISOString() })
        .eq("user_wallet", walletAddress)
        .eq("challenge_id", challengeId);

      if (error) throw error;

      toast({
        title: "🎉 Reward Claimed!",
        description: `You earned ${reward.toLocaleString()} TRN!`,
      });

      refetch();
    } catch (error) {
      toast({
        title: "Claim Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const getChallengeProgress = (challengeId: string) => {
    return userProgress?.find((p) => p.challenge_id === challengeId);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-gold/40">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-goblin-gold" />
          Prediction Challenges
        </h3>
        <Badge variant="outline" className="text-xs">
          Earn TRN & Badges
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Complete challenges to earn TRN rewards and exclusive achievement badges
      </p>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {challenges?.map((challenge) => {
          const progress = getChallengeProgress(challenge.challenge_id);
          const progressPercent = progress
            ? (progress.progress / challenge.requirement_value) * 100
            : 0;
          const isCompleted = progress?.completed || false;
          const isClaimed = progress?.claimed || false;

          return (
            <div
              key={challenge.id}
              className={`p-4 rounded-lg border ${
                isCompleted
                  ? "bg-goblin-green/10 border-goblin-green/30"
                  : "bg-terrain-shadow/50 border-border/50"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{challenge.badge_icon}</span>
                  <div>
                    <h4 className="font-bold text-sm">{challenge.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {challenge.description}
                    </p>
                  </div>
                </div>
                <Badge className="bg-goblin-gold text-black text-xs">
                  {challenge.trn_reward.toLocaleString()} TRN
                </Badge>
              </div>

              {!isCompleted && progress && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>
                      {progress.progress}/{challenge.requirement_value}
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>
              )}

              {isCompleted && !isClaimed && (
                <Button
                  onClick={() => claimReward(challenge.challenge_id, challenge.trn_reward)}
                  className="w-full mt-3 bg-goblin-gold text-black hover:bg-goblin-gold/90"
                  size="sm"
                >
                  Claim {challenge.trn_reward.toLocaleString()} TRN
                </Button>
              )}

              {isClaimed && (
                <div className="mt-3 text-center text-xs text-goblin-green">
                  ✅ Completed & Claimed
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

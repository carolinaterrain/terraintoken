import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Award, Calendar } from "lucide-react";

interface PredictionInsightsDashboardProps {
  walletAddress?: string;
}

export const PredictionInsightsDashboard = ({
  walletAddress,
}: PredictionInsightsDashboardProps) => {
  const { data: userStats } = useQuery({
    queryKey: ["prediction-user-stats", walletAddress],
    queryFn: async () => {
      if (!walletAddress) return null;
      const { data } = await supabase
        .from("prediction_user_stats")
        .select("*")
        .eq("user_wallet", walletAddress)
        .single();
      return data;
    },
    enabled: !!walletAddress,
  });

  const { data: recentPredictions } = useQuery({
    queryKey: ["recent-predictions", walletAddress],
    queryFn: async () => {
      if (!walletAddress) return [];
      const { data } = await supabase
        .from("market_predictions")
        .select("*")
        .eq("user_wallet", walletAddress)
        .not("was_correct", "is", null)
        .order("predicted_at", { ascending: false })
        .limit(10);
      return data || [];
    },
    enabled: !!walletAddress,
  });

  if (!walletAddress) {
    return (
      <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-border/40">
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Connect wallet to view insights</p>
        </div>
      </Card>
    );
  }

  if (!userStats) {
    return (
      <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-border/40">
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Make your first prediction!</p>
        </div>
      </Card>
    );
  }

  const wisdomScore = Math.round(
    (Number(userStats.accuracy_percentage) * 0.6 +
      (Number(userStats.best_streak) || 0) * 5 +
      (Number(userStats.active_days) || 0) * 2)
  );

  const getWisdomRank = (score: number) => {
    if (score >= 500) return { rank: "Goblin Oracle", icon: "🔮", color: "text-purple-400" };
    if (score >= 300) return { rank: "Market Sage", icon: "🧙", color: "text-blue-400" };
    if (score >= 150) return { rank: "Crystal Ball", icon: "💎", color: "text-cyan-400" };
    if (score >= 50) return { rank: "Apprentice", icon: "📊", color: "text-green-400" };
    return { rank: "Novice", icon: "🌱", color: "text-gray-400" };
  };

  const wisdom = getWisdomRank(wisdomScore);

  return (
    <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-gold/40">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Prediction Insights</h3>
        <Badge variant="outline" className="text-xs">Your Stats</Badge>
      </div>

      {/* Goblin Wisdom Score */}
      <div className="bg-gradient-to-r from-goblin-gold/20 to-goblin-green/20 border border-goblin-gold/40 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-xs text-muted-foreground">Goblin Wisdom Score</div>
            <div className="text-2xl font-bold text-goblin-gold">{wisdomScore}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-1">{wisdom.icon}</div>
            <div className={`text-xs font-bold ${wisdom.color}`}>{wisdom.rank}</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Calculated from accuracy, streaks, and consistency
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-terrain-shadow/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-goblin-green" />
            <span className="text-xs text-muted-foreground">Accuracy</span>
          </div>
          <div className="text-xl font-bold text-goblin-green">
            {Number(userStats.accuracy_percentage).toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">
            {userStats.correct_predictions}/{userStats.total_predictions} correct
          </div>
        </div>

        <div className="bg-terrain-shadow/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-goblin-gold" />
            <span className="text-xs text-muted-foreground">Best Streak</span>
          </div>
          <div className="text-xl font-bold text-goblin-gold">
            {userStats.best_streak || 0}
          </div>
          <div className="text-xs text-muted-foreground">predictions in a row</div>
        </div>

        <div className="bg-terrain-shadow/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-muted-foreground">Total Points</span>
          </div>
          <div className="text-xl font-bold">
            {Number(userStats.total_points || 0).toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">
            {userStats.highest_multiplier}x max multiplier
          </div>
        </div>

        <div className="bg-terrain-shadow/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-muted-foreground">Active Days</span>
          </div>
          <div className="text-xl font-bold">{userStats.active_days || 0}</div>
          <div className="text-xs text-muted-foreground">days with predictions</div>
        </div>
      </div>

      {/* Recent History */}
      <div>
        <h4 className="text-xs font-bold mb-2">Recent Predictions:</h4>
        <div className="space-y-1 max-h-[200px] overflow-y-auto">
          {recentPredictions?.map((pred) => (
            <div
              key={pred.id}
              className={`flex items-center justify-between p-2 rounded text-xs ${
                pred.was_correct
                  ? "bg-goblin-green/10 border border-goblin-green/30"
                  : "bg-destructive/10 border border-destructive/30"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{pred.was_correct ? "✅" : "❌"}</span>
                <span className="font-mono text-muted-foreground">
                  {new Date(pred.predicted_at).toLocaleDateString()}
                </span>
                <Badge variant="outline" className="text-xs">
                  {pred.prediction_type.toUpperCase()}
                </Badge>
              </div>
              <span className="font-bold">
                +{pred.points_earned} pts
                {pred.points_multiplier > 1 && (
                  <span className="text-goblin-gold ml-1">
                    ({pred.points_multiplier}x)
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

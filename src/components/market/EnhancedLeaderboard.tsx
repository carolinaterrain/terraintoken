import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, TrendingUp, Target, Zap, Calendar } from "lucide-react";
import { useState } from "react";

export const EnhancedLeaderboard = () => {
  const [timeFilter, setTimeFilter] = useState<"all" | "month" | "week">("all");

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["enhanced-leaderboard", timeFilter],
    queryFn: async () => {
      let query = supabase
        .from("market_predictions")
        .select("user_wallet, was_correct, points_earned, predicted_at, streak_count");

      // Apply time filter
      if (timeFilter === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        query = query.gte("predicted_at", monthAgo.toISOString());
      } else if (timeFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte("predicted_at", weekAgo.toISOString());
      }

      const { data } = await query.not("was_correct", "is", null);

      if (!data) return [];

      // Aggregate by user
      const userStats = data.reduce((acc: any, pred: any) => {
        if (!acc[pred.user_wallet]) {
          acc[pred.user_wallet] = {
            user_wallet: pred.user_wallet,
            total_predictions: 0,
            correct_predictions: 0,
            total_points: 0,
            best_streak: 0,
          };
        }

        acc[pred.user_wallet].total_predictions++;
        if (pred.was_correct) acc[pred.user_wallet].correct_predictions++;
        acc[pred.user_wallet].total_points += pred.points_earned || 0;
        acc[pred.user_wallet].best_streak = Math.max(
          acc[pred.user_wallet].best_streak,
          pred.streak_count || 0
        );

        return acc;
      }, {});

      return Object.values(userStats).map((user: any) => ({
        ...user,
        accuracy: user.total_predictions > 0
          ? ((user.correct_predictions / user.total_predictions) * 100).toFixed(1)
          : 0,
      }));
    },
    refetchInterval: 30000, // Refresh every 30s
  });

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const sortedByPoints = [...(leaderboard || [])].sort(
    (a, b) => b.total_points - a.total_points
  );

  const sortedByAccuracy = [...(leaderboard || [])].sort(
    (a, b) => parseFloat(b.accuracy) - parseFloat(a.accuracy)
  ).filter(user => user.total_predictions >= 10); // Min 10 predictions for accuracy leaderboard

  const sortedByStreak = [...(leaderboard || [])].sort(
    (a, b) => b.best_streak - a.best_streak
  );

  const LeaderboardTable = ({ data, sortBy }: { data: any[]; sortBy: string }) => (
    <div className="space-y-2">
      {data.slice(0, 10).map((user, index) => (
        <div
          key={user.user_wallet}
          className={`flex items-center justify-between p-3 rounded-lg transition-all ${
            index < 3
              ? "bg-gradient-to-r from-goblin-gold/20 to-goblin-green/20 border border-goblin-gold/40"
              : "bg-terrain-shadow/50 border border-border/20"
          }`}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="text-lg font-bold w-8 text-center shrink-0">
              {getMedalEmoji(index + 1)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-mono truncate">
                {user.user_wallet.slice(0, 4)}...{user.user_wallet.slice(-4)}
              </div>
              <div className="text-xs text-muted-foreground">
                {user.total_predictions} predictions
              </div>
            </div>
          </div>
          <div className="text-right shrink-0 ml-2">
            {sortBy === "points" && (
              <>
                <div className="text-lg font-bold text-goblin-gold">
                  {user.total_points.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">points</div>
              </>
            )}
            {sortBy === "accuracy" && (
              <>
                <div className="text-lg font-bold text-goblin-green">
                  {user.accuracy}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {user.correct_predictions}/{user.total_predictions}
                </div>
              </>
            )}
            {sortBy === "streak" && (
              <>
                <div className="text-lg font-bold text-orange-400">
                  {user.best_streak}
                </div>
                <div className="text-xs text-muted-foreground">streak</div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-gold/40">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-goblin-gold" />
          Social Leaderboards
        </h3>
        <div className="flex gap-2">
          <Badge
            variant={timeFilter === "all" ? "default" : "outline"}
            className="cursor-pointer text-xs"
            onClick={() => setTimeFilter("all")}
          >
            All Time
          </Badge>
          <Badge
            variant={timeFilter === "month" ? "default" : "outline"}
            className="cursor-pointer text-xs"
            onClick={() => setTimeFilter("month")}
          >
            Month
          </Badge>
          <Badge
            variant={timeFilter === "week" ? "default" : "outline"}
            className="cursor-pointer text-xs"
            onClick={() => setTimeFilter("week")}
          >
            Week
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading leaderboards...</div>
      ) : (
        <Tabs defaultValue="points" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="points" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Points
            </TabsTrigger>
            <TabsTrigger value="accuracy" className="text-xs">
              <Target className="w-3 h-3 mr-1" />
              Accuracy
            </TabsTrigger>
            <TabsTrigger value="streak" className="text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              Streak
            </TabsTrigger>
          </TabsList>

          <TabsContent value="points">
            <LeaderboardTable data={sortedByPoints} sortBy="points" />
          </TabsContent>

          <TabsContent value="accuracy">
            <LeaderboardTable data={sortedByAccuracy} sortBy="accuracy" />
            <p className="text-xs text-muted-foreground text-center mt-3">
              * Minimum 10 predictions required
            </p>
          </TabsContent>

          <TabsContent value="streak">
            <LeaderboardTable data={sortedByStreak} sortBy="streak" />
          </TabsContent>
        </Tabs>
      )}

      <div className="mt-4 pt-4 border-t border-border/40">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Updates every 30s</span>
          </div>
          <span>{leaderboard?.length || 0} total predictors</span>
        </div>
      </div>
    </Card>
  );
};
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Activity, PieChart as PieChartIcon, BarChart3 } from "lucide-react";

interface AdvancedAnalyticsProps {
  walletAddress?: string;
}

export const AdvancedAnalytics = ({ walletAddress }: AdvancedAnalyticsProps) => {
  const { data: analytics } = useQuery({
    queryKey: ["advanced-analytics", walletAddress],
    queryFn: async () => {
      if (!walletAddress) return null;

      const { data: predictions } = await supabase
        .from("market_predictions")
        .select("*")
        .eq("user_wallet", walletAddress)
        .not("was_correct", "is", null)
        .order("predicted_at", { ascending: true });

      if (!predictions || predictions.length === 0) return null;

      // Calculate daily performance
      const dailyPerformance = predictions.reduce((acc: any, pred: any) => {
        const date = new Date(pred.predicted_at).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = { date, correct: 0, incorrect: 0, points: 0 };
        }
        if (pred.was_correct) {
          acc[date].correct++;
          acc[date].points += pred.points_earned || 0;
        } else {
          acc[date].incorrect++;
        }
        return acc;
      }, {});

      const dailyData = Object.values(dailyPerformance).slice(-14); // Last 14 days

      // Calculate prediction type distribution
      const typeDistribution = predictions.reduce(
        (acc: any, pred: any) => {
          acc[pred.prediction_type] = (acc[pred.prediction_type] || 0) + 1;
          return acc;
        },
        { bull: 0, bear: 0, stable: 0 }
      );

      const pieData = [
        { name: "Bull", value: typeDistribution.bull, color: "#10b981" },
        { name: "Bear", value: typeDistribution.bear, color: "#ef4444" },
        { name: "Stable", value: typeDistribution.stable, color: "#f59e0b" },
      ];

      // Calculate accuracy by prediction type
      const accuracyByType = predictions.reduce((acc: any, pred: any) => {
        if (!acc[pred.prediction_type]) {
          acc[pred.prediction_type] = { total: 0, correct: 0 };
        }
        acc[pred.prediction_type].total++;
        if (pred.was_correct) acc[pred.prediction_type].correct++;
        return acc;
      }, {});

      const accuracyData = Object.entries(accuracyByType).map(([type, stats]: [string, any]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        accuracy: ((stats.correct / stats.total) * 100).toFixed(1),
      }));

      // Calculate streak history
      let currentStreak = 0;
      const streakHistory: number[] = [];
      predictions.forEach((pred: any) => {
        if (pred.was_correct) {
          currentStreak++;
        } else {
          currentStreak = 0;
        }
        streakHistory.push(currentStreak);
      });

      const streakData = streakHistory.slice(-20).map((streak, i) => ({
        index: i + 1,
        streak,
      }));

      return {
        dailyData,
        pieData,
        accuracyData,
        streakData,
        totalPredictions: predictions.length,
        correctPredictions: predictions.filter((p: any) => p.was_correct).length,
      };
    },
    enabled: !!walletAddress,
  });

  if (!walletAddress || !analytics) {
    return (
      <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-border/40">
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            {!walletAddress
              ? "Connect wallet to view advanced analytics"
              : "Make predictions to see your analytics"}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-gold/40">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-goblin-gold" />
          Advanced Prediction Analytics
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-terrain-shadow/50 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Overall Accuracy</div>
            <div className="text-2xl font-bold text-goblin-green">
              {((analytics.correctPredictions / analytics.totalPredictions) * 100).toFixed(1)}%
            </div>
          </div>
          <div className="bg-terrain-shadow/50 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Total Predictions</div>
            <div className="text-2xl font-bold">{analytics.totalPredictions}</div>
          </div>
        </div>

        {/* Daily Performance Chart */}
        <div className="mb-6">
          <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Daily Performance (Last 14 Days)
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analytics.dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#888" />
              <YAxis tick={{ fontSize: 10 }} stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="points" stroke="#fbbf24" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Prediction Type Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
              <PieChartIcon className="w-4 h-4" />
              Prediction Type Distribution
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={analytics.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.pieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {analytics.pieData.map((entry: any) => (
                <Badge key={entry.name} variant="outline" className="text-xs">
                  <span
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.name}: {entry.value}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-3">Accuracy by Type</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.accuracyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="type" tick={{ fontSize: 10 }} stroke="#888" />
                <YAxis tick={{ fontSize: 10 }} stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="accuracy" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Streak History */}
        <div className="mt-6">
          <h4 className="text-sm font-bold mb-3">Recent Streak History</h4>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={analytics.streakData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="index" tick={{ fontSize: 10 }} stroke="#888" />
              <YAxis tick={{ fontSize: 10 }} stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="streak" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
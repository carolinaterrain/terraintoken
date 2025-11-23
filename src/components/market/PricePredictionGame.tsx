import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface PricePredictionGameProps {
  currentPrice: number;
  walletAddress?: string;
}

export const PricePredictionGame = ({ currentPrice, walletAddress }: PricePredictionGameProps) => {
  const [selectedPrediction, setSelectedPrediction] = useState<"bull" | "bear" | "stable" | null>(null);
  const { toast } = useToast();

  const { data: userPredictions } = useQuery({
    queryKey: ["user-predictions", walletAddress],
    queryFn: async () => {
      if (!walletAddress) return [];
      
      const { data } = await supabase
        .from("market_predictions")
        .select("*")
        .eq("user_wallet", walletAddress)
        .gte("target_date", new Date().toISOString())
        .order("created_at", { ascending: false });
      
      return data || [];
    },
    enabled: !!walletAddress,
  });

  const { data: leaderboard } = useQuery({
    queryKey: ["prediction-leaderboard"],
    queryFn: async () => {
      const { data } = await supabase
        .from("market_predictions")
        .select("user_wallet, points_earned")
        .eq("was_correct", true)
        .order("points_earned", { ascending: false })
        .limit(5);
      
      return data || [];
    },
  });

  const hasTodaysPrediction = userPredictions?.some((p) => {
    const predDate = new Date(p.predicted_at);
    const today = new Date();
    return predDate.toDateString() === today.toDateString();
  });

  const submitPrediction = async (type: "bull" | "bear" | "stable") => {
    if (!walletAddress) {
      toast({
        title: "Connect Wallet First",
        description: "You need to connect your wallet to play",
        variant: "destructive",
      });
      return;
    }

    if (hasTodaysPrediction) {
      toast({
        title: "Already Predicted",
        description: "You can only make one prediction per day",
      });
      return;
    }

    try {
      const targetDate = new Date();
      targetDate.setHours(targetDate.getHours() + 24);

      await supabase.from("market_predictions").insert({
        user_wallet: walletAddress,
        prediction_type: type,
        current_price: currentPrice,
        target_date: targetDate.toISOString(),
      });

      setSelectedPrediction(type);

      toast({
        title: "🎯 Prediction Locked In!",
        description: `You predicted ${type.toUpperCase()}. Check back in 24h to see if you won!`,
      });
    } catch (error) {
      toast({
        title: "Prediction Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-gold/60">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          🎯 Daily Price Challenge
        </h3>
        <Badge className="bg-goblin-gold text-black">+100 Points</Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Will TRN price go up, down, or stay stable in 24 hours?
      </p>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <Button
          onClick={() => submitPrediction("bull")}
          disabled={!!hasTodaysPrediction}
          className={`flex flex-col gap-1 h-auto py-4 ${
            selectedPrediction === "bull"
              ? "bg-goblin-green text-black"
              : "bg-terrain-shadow hover:bg-terrain-shadow/80"
          }`}
        >
          <TrendingUp className="w-6 h-6" />
          <span className="text-xs">BULL</span>
          <span className="text-xs opacity-70">&gt;5% up</span>
        </Button>

        <Button
          onClick={() => submitPrediction("stable")}
          disabled={!!hasTodaysPrediction}
          className={`flex flex-col gap-1 h-auto py-4 ${
            selectedPrediction === "stable"
              ? "bg-goblin-gold text-black"
              : "bg-terrain-shadow hover:bg-terrain-shadow/80"
          }`}
        >
          <Minus className="w-6 h-6" />
          <span className="text-xs">STABLE</span>
          <span className="text-xs opacity-70">±5%</span>
        </Button>

        <Button
          onClick={() => submitPrediction("bear")}
          disabled={!!hasTodaysPrediction}
          className={`flex flex-col gap-1 h-auto py-4 ${
            selectedPrediction === "bear"
              ? "bg-destructive text-white"
              : "bg-terrain-shadow hover:bg-terrain-shadow/80"
          }`}
        >
          <TrendingDown className="w-6 h-6" />
          <span className="text-xs">BEAR</span>
          <span className="text-xs opacity-70">&gt;5% down</span>
        </Button>
      </div>

      {hasTodaysPrediction && (
        <div className="bg-goblin-green/20 border border-goblin-green/30 rounded-lg p-3 mb-4">
          <p className="text-sm text-goblin-green text-center">
            ✅ Prediction submitted! Check back tomorrow for results
          </p>
        </div>
      )}

      {/* Leaderboard */}
      {leaderboard && leaderboard.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="text-sm font-bold mb-2 flex items-center gap-1">
            <Trophy className="w-4 h-4 text-goblin-gold" />
            Top Predictors
          </h4>
          <div className="space-y-1">
            {leaderboard.slice(0, 3).map((entry, idx) => (
              <div
                key={entry.user_wallet}
                className="flex items-center justify-between text-xs"
              >
                <span className="font-mono">
                  {idx + 1}. {entry.user_wallet.slice(0, 8)}...
                </span>
                <span className="text-goblin-gold font-bold">
                  {entry.points_earned} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
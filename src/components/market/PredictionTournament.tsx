import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Users } from "lucide-react";

interface PredictionTournamentProps {
  walletAddress?: string;
}

export const PredictionTournament = ({ walletAddress }: PredictionTournamentProps) => {
  const { data: activeTournament } = useQuery({
    queryKey: ["active-tournament"],
    queryFn: async () => {
      const { data } = await supabase
        .from("prediction_tournaments")
        .select("*")
        .eq("status", "active")
        .order("start_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  const { data: leaderboard } = useQuery({
    queryKey: ["tournament-leaderboard", activeTournament?.id],
    queryFn: async () => {
      if (!activeTournament) return [];
      const { data } = await supabase
        .from("tournament_entries")
        .select("*")
        .eq("tournament_id", activeTournament.id)
        .order("accuracy_rate", { ascending: false })
        .order("total_predictions", { ascending: false })
        .limit(10);
      return data || [];
    },
    enabled: !!activeTournament,
  });

  const { data: userEntry } = useQuery({
    queryKey: ["user-tournament-entry", activeTournament?.id, walletAddress],
    queryFn: async () => {
      if (!activeTournament || !walletAddress) return null;
      const { data } = await supabase
        .from("tournament_entries")
        .select("*")
        .eq("tournament_id", activeTournament.id)
        .eq("user_wallet", walletAddress)
        .maybeSingle();
      return data;
    },
    enabled: !!activeTournament && !!walletAddress,
  });

  if (!activeTournament) {
    return (
      <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-border/40">
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No active tournament</p>
          <p className="text-xs text-muted-foreground mt-1">Check back soon!</p>
        </div>
      </Card>
    );
  }

  const prizePool = activeTournament.prize_pool as Record<string, number>;
  const endDate = new Date(activeTournament.end_date);
  const daysRemaining = Math.ceil(
    (endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-gold/60">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-goblin-gold" />
          Monthly Tournament
        </h3>
        <Badge className="bg-goblin-gold text-black">
          {Object.values(prizePool).reduce((a, b) => a + b, 0).toLocaleString()} TRN
        </Badge>
      </div>

      <div className="mb-4">
        <h4 className="font-bold text-sm mb-1">{activeTournament.name}</h4>
        <p className="text-xs text-muted-foreground mb-3">
          {activeTournament.description}
        </p>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{daysRemaining} days left</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>{leaderboard?.length || 0} participants</span>
          </div>
        </div>
      </div>

      {/* User's Current Standing */}
      {userEntry && (
        <div className="bg-goblin-green/10 border border-goblin-green/30 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold">Your Stats:</span>
            <Badge variant="outline" className="text-xs">
              Rank: {leaderboard?.findIndex((e) => e.user_wallet === walletAddress) + 1 || "-"}
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
            <div>
              <div className="text-muted-foreground">Predictions</div>
              <div className="font-bold">{userEntry.total_predictions}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Correct</div>
              <div className="font-bold text-goblin-green">
                {userEntry.correct_predictions}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Accuracy</div>
              <div className="font-bold">{userEntry.accuracy_rate}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Prize Breakdown */}
      <div className="mb-4">
        <h4 className="text-xs font-bold mb-2">Prize Pool:</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-terrain-shadow/50 rounded p-2">
            <div className="text-muted-foreground">🥇 1st Place</div>
            <div className="font-bold text-goblin-gold">
              {prizePool["1"]?.toLocaleString()} TRN
            </div>
          </div>
          <div className="bg-terrain-shadow/50 rounded p-2">
            <div className="text-muted-foreground">🥈 2nd-3rd</div>
            <div className="font-bold">{prizePool["2"]?.toLocaleString()} TRN each</div>
          </div>
          <div className="bg-terrain-shadow/50 rounded p-2 col-span-2">
            <div className="text-muted-foreground">🏆 4th-10th Place</div>
            <div className="font-bold">{prizePool["4"]?.toLocaleString()} TRN each</div>
          </div>
        </div>
      </div>

      {/* Top 5 Leaderboard */}
      <div>
        <h4 className="text-xs font-bold mb-2">Current Leaders:</h4>
        <div className="space-y-1">
          {leaderboard?.slice(0, 5).map((entry, idx) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-2 rounded text-xs ${
                entry.user_wallet === walletAddress
                  ? "bg-goblin-green/20 border border-goblin-green/30"
                  : "bg-terrain-shadow/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-muted-foreground">
                  {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}.`}
                </span>
                <span className="font-mono">
                  {entry.user_wallet.slice(0, 6)}...{entry.user_wallet.slice(-4)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">
                  {entry.correct_predictions}/{entry.total_predictions}
                </span>
                <span className="font-bold text-goblin-gold">
                  {entry.accuracy_rate}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-xs text-center text-muted-foreground">
        💡 Make predictions daily to climb the leaderboard!
      </div>
    </Card>
  );
};

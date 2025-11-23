import { Trophy, Users, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface HolderQuestBarProps {
  current: number;
  target: number;
  milestones: number[];
}

export const HolderQuestBar = ({
  current,
  target,
  milestones,
}: HolderQuestBarProps) => {
  const progress = Math.min(100, (current / target) * 100);
  const nextMilestone = milestones.find((m) => m > current) || target;

  return (
    <div className="bg-gradient-to-r from-terrain-dark via-terrain-shadow to-terrain-dark border-2 border-goblin-green/60 rounded-2xl p-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-goblin-green/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-goblin-green" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-goblin-green font-display">
              Holder Quest
            </h3>
            <p className="text-xs text-muted-foreground">
              Join the goblin horde!
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-goblin-gold font-display">
            {current.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">
            / {target.toLocaleString()} goblins
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-4">
        <Progress 
          value={progress} 
          className="h-4 bg-terrain-shadow/50 border border-goblin-green/30"
        />
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-goblin-green via-goblin-gold to-terrain-purple rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Milestones */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {milestones.map((milestone, idx) => {
          const achieved = current >= milestone;
          return (
            <div
              key={milestone}
              className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                achieved
                  ? "bg-goblin-green/10 border-goblin-green/40"
                  : "bg-terrain-shadow/30 border-terrain-shadow/50"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  achieved
                    ? "bg-goblin-green text-terrain-dark"
                    : "bg-terrain-shadow/50 text-muted-foreground"
                }`}
              >
                {achieved ? (
                  <Trophy className="w-3.5 h-3.5" />
                ) : (
                  <TrendingUp className="w-3.5 h-3.5" />
                )}
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">
                  {(milestone / 1000).toFixed(milestone >= 1000 ? 1 : 0)}K
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {achieved ? "Achieved!" : "Milestone"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Milestone */}
      {nextMilestone && nextMilestone !== target && (
        <div className="mt-4 pt-4 border-t border-border/40">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Next milestone:</span>
            <span className="font-semibold text-goblin-gold">
              {(nextMilestone - current).toLocaleString()} more goblins
            </span>
          </div>
        </div>
      )}

      {/* Footer note */}
      <p className="text-[10px] text-muted-foreground mt-4 text-center">
        Holder count updates automatically from on-chain data. Progress represents community growth.
      </p>
    </div>
  );
};

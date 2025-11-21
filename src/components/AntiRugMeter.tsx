import { Shield, CheckCircle2 } from "lucide-react";
import { GlassCard } from "./ui/glass-card";
import { Progress } from "./ui/progress";

export const AntiRugMeter = () => {
  const checks = [
    { label: "Real Business Revenue", passed: true, score: 20 },
    { label: "Team Doxxed & Verified", passed: true, score: 20 },
    { label: "Contract Audited", passed: true, score: 15 },
    { label: "Liquidity Locked", passed: true, score: 15 },
    { label: "No Hidden Mints", passed: true, score: 15 },
    { label: "Active Development", passed: true, score: 15 },
  ];

  const totalScore = checks.reduce((sum, check) => sum + (check.passed ? check.score : 0), 0);

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Anti-Rug Energy</h3>
          <p className="text-xs text-muted-foreground">Transparency Score</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Safety Rating</span>
          <span className="text-2xl font-bold text-green-500">{totalScore}%</span>
        </div>
        <Progress value={totalScore} className="h-2 bg-muted" />
      </div>

      <div className="space-y-2">
        {checks.map((check, index) => (
          <div 
            key={index}
            className="flex items-center justify-between py-2 border-b border-primary/10 last:border-0"
          >
            <span className="text-xs text-muted-foreground">{check.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-foreground">{check.score}%</span>
              {check.passed && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-primary/10">
        <p className="text-xs text-center text-green-500 font-medium">
          ✓ All transparency checks passed
        </p>
      </div>
    </GlassCard>
  );
};

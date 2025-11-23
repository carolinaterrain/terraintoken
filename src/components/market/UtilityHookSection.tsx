import { Zap, Lock, TrendingUp, AlertTriangle } from "lucide-react";

export const UtilityHookSection = () => {
  const utilityPoints = [
    {
      icon: Zap,
      text: "TRN powers Terrain Vision AI & drainage analysis tools used by professionals.",
      color: "goblin-green",
    },
    {
      icon: Lock,
      text: "Tokens used in the ecosystem are removed from circulation or locked in reserves.",
      color: "goblin-gold",
    },
    {
      icon: TrendingUp,
      text: "As more users adopt TerrainScape platform, demand for TRN may increase organically.",
      color: "terrain-purple",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Utility Points */}
      <div className="grid md:grid-cols-3 gap-4">
        {utilityPoints.map((point, idx) => {
          const Icon = point.icon;
          return (
            <div
              key={idx}
              className="bg-card/40 backdrop-blur-sm border border-border/40 rounded-xl p-4 hover:border-primary/40 transition-all"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg bg-${point.color}/10 flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`w-5 h-5 text-${point.color}`} />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {point.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk Disclaimer */}
      <div className="bg-destructive/5 border border-destructive/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-destructive">
              High Risk Investment
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              TRN is a highly volatile crypto asset. You could lose 100% of your investment. 
              This panel is for education and entertainment only and does not constitute financial advice. 
              Never invest more than you can afford to lose. Do your own research.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, DollarSign, Shield, Activity, Target } from "lucide-react";
import { calculateMetrics, balanceSheet } from "@/lib/financialData";

interface ScoreItem {
  label: string;
  grade: string;
  value: string;
  color: string;
  icon: typeof TrendingUp;
  description: string;
}

export const FinancialHealthScore = () => {
  const metrics = calculateMetrics();

  const getGrade = (value: number, thresholds: number[]) => {
    if (value >= thresholds[0]) return { grade: 'A+', color: 'text-green-500' };
    if (value >= thresholds[1]) return { grade: 'A', color: 'text-green-400' };
    if (value >= thresholds[2]) return { grade: 'B+', color: 'text-blue-500' };
    if (value >= thresholds[3]) return { grade: 'B', color: 'text-blue-400' };
    return { grade: 'C', color: 'text-yellow-500' };
  };

  const revenueGrowthGrade = getGrade(metrics.growthRate, [40, 30, 20, 10]);
  const profitabilityGrade = getGrade(metrics.netProfitMargin, [15, 12, 10, 8]);
  const liquidityGrade = getGrade(metrics.currentRatio, [3, 2.5, 2, 1.5]);
  const assetEfficiencyGrade = getGrade(metrics.assetTurnoverRatio, [4, 3, 2, 1]);

  const scores: ScoreItem[] = [
    {
      label: "Revenue Growth",
      grade: revenueGrowthGrade.grade,
      value: `${metrics.growthRate.toFixed(1)}% YoY`,
      color: revenueGrowthGrade.color,
      icon: TrendingUp,
      description: "Year-over-year revenue increase"
    },
    {
      label: "Profitability",
      grade: profitabilityGrade.grade,
      value: `${metrics.netProfitMargin.toFixed(1)}% margin`,
      color: profitabilityGrade.color,
      icon: DollarSign,
      description: "Net profit margin"
    },
    {
      label: "Liquidity",
      grade: liquidityGrade.grade,
      value: `${metrics.currentRatio.toFixed(1)}x ratio`,
      color: liquidityGrade.color,
      icon: Shield,
      description: "Current ratio"
    },
    {
      label: "Asset Efficiency",
      grade: assetEfficiencyGrade.grade,
      value: `${metrics.assetTurnoverRatio.toFixed(1)}x turnover`,
      color: assetEfficiencyGrade.color,
      icon: Activity,
      description: "Asset turnover ratio"
    },
    {
      label: "Equipment Investment",
      grade: "A+",
      value: `$${(balanceSheet.equipmentValue / 1000).toFixed(0)}k fleet`,
      color: "text-green-500",
      icon: Target,
      description: "Heavy machinery capacity"
    },
    {
      label: "Transparency",
      grade: "A+",
      value: "100% disclosure",
      color: "text-green-500",
      icon: Trophy,
      description: "Complete financial openness"
    }
  ];

  const overallGrade = "A+";
  const overallColor = "text-green-500";

  return (
    <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent" style={{ textShadow: '0 0 20px hsl(var(--primary-glow) / 0.3)' }}>
            Financial Health Report Card
          </h3>
          <p className="text-sm text-muted-foreground">Comprehensive Performance Analysis</p>
        </div>
        <Badge variant="outline" className="border-green-500/40 text-green-500 gap-2 text-xl font-bold py-2 px-4">
          <Trophy className="w-5 h-5" />
          Overall: {overallGrade}
        </Badge>
      </div>

      {/* Score Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {scores.map((score, index) => {
          const Icon = score.icon;
          return (
            <div 
              key={index}
              className="p-5 rounded-lg bg-background/80 border border-border/50 hover:border-primary/40 transition-all hover:scale-105 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-background/80 ${score.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`text-3xl font-bold ${score.color}`}>
                  {score.grade}
                </div>
              </div>
              <div className="font-semibold text-foreground mb-1">{score.label}</div>
              <div className="text-sm text-primary font-medium mb-1">{score.value}</div>
              <div className="text-xs text-muted-foreground">{score.description}</div>
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      <div className="p-4 rounded-lg bg-muted/50 border border-muted">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Operational Strength:</span> Carolina Terrain demonstrates
          strong operational health across these metrics. <span className="font-bold text-primary">$TRN is tied to an active
          licensed contracting business</span> — but business performance does not guarantee token value. $TRN is a
          utility/incentive token, not an investment or security.
        </p>
      </div>
    </Card>
  );
};
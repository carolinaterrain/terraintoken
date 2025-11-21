import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import CountUp from "react-countup";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: string;
  delay?: number;
}

export const MetricCard = ({
  icon: Icon,
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  description,
  trend,
  trendValue,
  color = "text-primary",
  delay = 0,
}: MetricCardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case "neutral":
        return <Minus className="w-4 h-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover:scale-105 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-background/80 ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            {trendValue && (
              <span className={`text-sm font-medium ${
                trend === "up" ? "text-green-500" : 
                trend === "down" ? "text-red-500" : 
                "text-muted-foreground"
              }`}>
                {trendValue}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="font-display text-3xl font-bold mb-1">
        {prefix}
        <CountUp
          start={0}
          end={value}
          decimals={decimals}
          duration={2}
          delay={delay}
          separator=","
          preserveValue
        />
        {suffix}
      </div>

      <div className="font-semibold text-foreground mb-1">
        {label}
      </div>

      {description && (
        <div className="text-sm text-muted-foreground">
          {description}
        </div>
      )}
    </Card>
  );
};

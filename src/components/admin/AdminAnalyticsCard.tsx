import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface AdminAnalyticsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
}

export function AdminAnalyticsCard({ 
  title, 
  value, 
  change, 
  changeLabel,
  icon 
}: AdminAnalyticsCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {isPositive && <TrendingUp className="h-3 w-3 text-primary" />}
            {isNegative && <TrendingDown className="h-3 w-3 text-destructive" />}
            <span className={isPositive ? "text-primary" : isNegative ? "text-destructive" : ""}>
              {change > 0 && "+"}{change}%
            </span>
            {changeLabel && <span className="ml-1">{changeLabel}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

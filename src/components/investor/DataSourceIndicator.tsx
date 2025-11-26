import { Badge } from "@/components/ui/badge";
import { Check, Activity, TrendingUp, Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DataSourceIndicatorProps {
  source: "live" | "projected" | "estimated";
  lastUpdated?: Date;
  confidence?: number;
  className?: string;
}

export const DataSourceIndicator = ({ 
  source, 
  lastUpdated, 
  confidence,
  className = "" 
}: DataSourceIndicatorProps) => {
  const config = {
    live: {
      icon: Check,
      text: "LIVE DATA",
      color: "bg-goblin-green text-black hover:bg-goblin-green/90",
      description: "Real-time data from blockchain or business systems"
    },
    projected: {
      icon: TrendingUp,
      text: "PROJECTED",
      color: "bg-chart-2 text-white hover:bg-chart-2/90",
      description: "Financial projection based on market analysis"
    },
    estimated: {
      icon: Activity,
      text: "ESTIMATED",
      color: "bg-chart-4 text-white hover:bg-chart-4/90",
      description: "Market research estimate from industry sources"
    }
  };

  const { icon: Icon, text, color, description } = config[source];

  const tooltipContent = (
    <div className="space-y-2">
      <p className="text-sm">{description}</p>
      {lastUpdated && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Last updated: {lastUpdated.toLocaleString()}
        </p>
      )}
      {confidence !== undefined && (
        <p className="text-xs text-muted-foreground">
          Confidence: {confidence}%
        </p>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`flex items-center gap-1 ${color} ${className}`}>
            <Icon className="w-3 h-3" />
            <span className="text-xs font-bold">{text}</span>
            {confidence !== undefined && (
              <span className="text-xs">({confidence}%)</span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

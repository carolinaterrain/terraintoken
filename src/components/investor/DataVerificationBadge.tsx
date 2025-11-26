import { Badge } from "@/components/ui/badge";
import { CheckCircle, TrendingUp, Search, ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DataVerificationBadgeProps {
  status: "verified" | "projected" | "estimated";
  source?: string;
  link?: string;
  className?: string;
}

export const DataVerificationBadge = ({ 
  status, 
  source,
  link,
  className = "" 
}: DataVerificationBadgeProps) => {
  const config = {
    verified: {
      icon: CheckCircle,
      text: "Verified",
      color: "text-goblin-green",
      variant: "outline" as const,
      borderColor: "border-goblin-green"
    },
    projected: {
      icon: TrendingUp,
      text: "Projected",
      color: "text-chart-2",
      variant: "outline" as const,
      borderColor: "border-chart-2"
    },
    estimated: {
      icon: Search,
      text: "Estimated",
      color: "text-chart-4",
      variant: "outline" as const,
      borderColor: "border-chart-4"
    }
  };

  const { icon: Icon, text, color, variant, borderColor } = config[status];

  const tooltipContent = (
    <div className="space-y-1">
      <p className="text-sm font-semibold">{text} Data</p>
      {source && <p className="text-xs text-muted-foreground">Source: {source}</p>}
      {link && (
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline inline-flex items-center gap-1"
        >
          View source <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={variant} className={`flex items-center gap-1 ${color} ${borderColor} ${className}`}>
            <Icon className="w-3 h-3" />
            <span className="text-xs">{text}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

import { Badge } from "@/components/ui/badge";
import { Check, Clock, AlertCircle } from "lucide-react";

interface DataBadgeProps {
  type: "live" | "demo" | "coming-soon";
  className?: string;
}

export const DataBadge = ({ type, className = "" }: DataBadgeProps) => {
  const config = {
    live: {
      icon: Check,
      text: "LIVE DATA",
      variant: "default" as const,
      className: "bg-goblin-green text-black hover:bg-goblin-green/90",
    },
    demo: {
      icon: AlertCircle,
      text: "DEMO MODE",
      variant: "outline" as const,
      className: "border-orange-500 text-orange-500",
    },
    "coming-soon": {
      icon: Clock,
      text: "COMING SOON",
      variant: "outline" as const,
      className: "border-muted text-muted-foreground",
    },
  };

  const { icon: Icon, text, variant, className: badgeClassName } = config[type];

  return (
    <Badge variant={variant} className={`flex items-center gap-1 ${badgeClassName} ${className}`}>
      <Icon className="w-3 h-3" />
      <span className="text-xs font-bold">{text}</span>
    </Badge>
  );
};
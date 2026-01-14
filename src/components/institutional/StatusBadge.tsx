import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Calendar, Sparkles } from "lucide-react";

type Status = "live" | "in_progress" | "planned";

interface StatusBadgeProps {
  status: Status;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "default";
}

const statusConfig: Record<Status, { label: string; icon: typeof CheckCircle; className: string }> = {
  live: {
    label: "Live",
    icon: CheckCircle,
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
  },
  in_progress: {
    label: "In Progress",
    icon: Clock,
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
  },
  planned: {
    label: "Planned",
    icon: Calendar,
    className: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20 hover:bg-slate-500/20"
  }
};

export function StatusBadge({ status, className, showIcon = true, size = "default" }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium transition-colors",
        config.className,
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1",
        className
      )}
    >
      {showIcon && <Icon className={cn("mr-1.5", size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />}
      {config.label}
    </Badge>
  );
}

interface OptionalBadgeProps {
  className?: string;
}

export function OptionalBadge({ className }: OptionalBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium text-xs px-2 py-0.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
        className
      )}
    >
      <Sparkles className="h-3 w-3 mr-1" />
      Optional
    </Badge>
  );
}

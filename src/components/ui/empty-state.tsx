import { LucideIcon, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  compact?: boolean;
}

export const EmptyState = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStateProps) => {
  if (compact) {
    return (
      <div className={cn("flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border/50", className)}>
        <div className="rounded-full bg-muted p-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{title}</p>
          {description && (
            <p className="text-xs text-muted-foreground truncate">{description}</p>
          )}
        </div>
        {action && (
          <Button variant="ghost" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      )}
      {action && (
        <Button variant="outline" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

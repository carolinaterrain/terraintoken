import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
}

export const ErrorState = ({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
  className,
  compact = false,
}: ErrorStateProps) => {
  if (compact) {
    return (
      <div className={cn("flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20", className)}>
        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-destructive">{title}</p>
          <p className="text-xs text-muted-foreground truncate">{message}</p>
        </div>
        {onRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry} className="flex-shrink-0">
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="rounded-full bg-destructive/10 p-4 mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;

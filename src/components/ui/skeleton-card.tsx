import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

interface SkeletonCardProps {
  className?: string;
  variant?: 'default' | 'video' | 'stat';
}

export const SkeletonCard = ({ className, variant = 'default' }: SkeletonCardProps) => {
  if (variant === 'video') {
    return (
      <div className={cn("space-y-3", className)}>
        <Skeleton className="aspect-video rounded-lg" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    );
  }

  if (variant === 'stat') {
    return (
      <div className={cn("space-y-2", className)}>
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-4 p-6 rounded-lg border border-primary/20", className)}>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
};

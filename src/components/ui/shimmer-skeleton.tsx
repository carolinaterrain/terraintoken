import { cn } from "@/lib/utils";

interface ShimmerSkeletonProps {
  className?: string;
  variant?: "default" | "circular" | "text" | "card";
}

export const ShimmerSkeleton = ({ className, variant = "default" }: ShimmerSkeletonProps) => {
  const baseClasses = "animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer";
  
  const variantClasses = {
    default: "rounded-md",
    circular: "rounded-full",
    text: "rounded h-4",
    card: "rounded-lg",
  };

  return (
    <div 
      className={cn(baseClasses, variantClasses[variant], className)} 
      style={{
        animation: "shimmer 2s ease-in-out infinite",
      }}
    />
  );
};

// Preset skeleton layouts for common use cases
export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn("space-y-3 p-4 rounded-lg border border-border/50 bg-card", className)}>
    <ShimmerSkeleton className="h-4 w-3/4" variant="text" />
    <ShimmerSkeleton className="h-4 w-1/2" variant="text" />
    <ShimmerSkeleton className="h-20 w-full" variant="card" />
  </div>
);

export const SkeletonList = ({ count = 3, className }: { count?: number; className?: string }) => (
  <div className={cn("space-y-3", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <ShimmerSkeleton className="h-10 w-10" variant="circular" />
        <div className="flex-1 space-y-2">
          <ShimmerSkeleton className="h-4 w-3/4" variant="text" />
          <ShimmerSkeleton className="h-3 w-1/2" variant="text" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonStats = ({ className }: { className?: string }) => (
  <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="p-4 rounded-lg border border-border/50 bg-card">
        <ShimmerSkeleton className="h-3 w-16 mb-2" variant="text" />
        <ShimmerSkeleton className="h-6 w-24" variant="text" />
      </div>
    ))}
  </div>
);

export default ShimmerSkeleton;

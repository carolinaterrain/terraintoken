import { memo } from 'react';
import { Users } from 'lucide-react';
import { useLiveHolderCount } from '@/hooks/useLiveHolderCount';

interface SocialProofBadgeProps {
  className?: string;
  variant?: 'default' | 'compact' | 'inline';
}

export const SocialProofBadge = memo(({ className = '', variant = 'default' }: SocialProofBadgeProps) => {
  const { data, isLoading } = useLiveHolderCount();
  
  // Use cached count or fallback
  const displayCount = data?.holderCount || 180;
  
  if (variant === 'inline') {
    return (
      <span className={`text-muted-foreground text-xs ${className}`}>
        Join {displayCount.toLocaleString()}+ holders
      </span>
    );
  }
  
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 text-xs text-muted-foreground ${className}`}>
        <Users className="w-3 h-3" />
        <span>{displayCount.toLocaleString()}+ holders</span>
      </div>
    );
  }
  
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full ${className}`}>
      <div className="flex -space-x-1.5">
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-primary/60 border-2 border-background" />
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-chart-3 to-chart-3/60 border-2 border-background" />
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-chart-1 to-chart-1/60 border-2 border-background" />
      </div>
      <span className="text-xs font-medium text-foreground">
        {displayCount.toLocaleString()}+ holders
      </span>
      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
    </div>
  );
});

SocialProofBadge.displayName = 'SocialProofBadge';

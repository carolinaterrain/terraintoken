import { memo, forwardRef } from 'react';
import { Clock, Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';

export type DataSource = 'live' | 'cache' | 'fallback';

interface DataFreshnessBadgeProps {
  source: DataSource;
  lastUpdated?: string | Date;
  className?: string;
  showTimestamp?: boolean;
}

// Forward ref properly to avoid React warnings
const DataFreshnessBadgeInner = forwardRef<HTMLDivElement, DataFreshnessBadgeProps>(({ 
  source, 
  lastUpdated, 
  className = '',
  showTimestamp = false 
}, ref) => {
  const config = {
    live: {
      icon: Wifi,
      label: 'Live',
      color: 'bg-green-500/20 text-green-500 border-green-500/30',
      description: 'Real-time data from blockchain',
    },
    cache: {
      icon: Clock,
      label: 'Cached',
      color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      description: 'Recently cached data',
    },
    fallback: {
      icon: WifiOff,
      label: 'Offline',
      color: 'bg-red-500/20 text-red-500 border-red-500/30',
      description: 'Using fallback data - live data unavailable',
    },
  };

  const { icon: Icon, label, color, description } = config[source];
  
  const formattedTime = lastUpdated 
    ? formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })
    : null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div ref={ref} className="inline-flex">
            <Badge 
              variant="outline" 
              className={`${color} ${className} text-[10px] px-1.5 py-0 h-4 cursor-help`}
            >
              <Icon className="w-2.5 h-2.5 mr-0.5" />
              {label}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <p className="font-medium">{description}</p>
            {formattedTime && (
              <p className="text-muted-foreground mt-1">Updated {formattedTime}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

DataFreshnessBadgeInner.displayName = 'DataFreshnessBadgeInner';

export const DataFreshnessBadge = memo(DataFreshnessBadgeInner);

// Compact version for inline use
export const DataSourceDot = memo(({ source }: { source: DataSource }) => {
  const colors = {
    live: 'bg-green-500',
    cache: 'bg-yellow-500',
    fallback: 'bg-red-500',
  };

  return (
    <span 
      className={`inline-block w-1.5 h-1.5 rounded-full ${colors[source]} ${source === 'live' ? 'animate-pulse' : ''}`}
      title={source === 'live' ? 'Live data' : source === 'cache' ? 'Cached data' : 'Fallback data'}
    />
  );
});

DataSourceDot.displayName = 'DataSourceDot';

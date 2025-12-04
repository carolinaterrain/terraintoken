import { Users, TrendingUp, Clock } from "lucide-react";
import { useLiveHolderCount } from "@/hooks/useLiveHolderCount";
import { Skeleton } from "@/components/ui/skeleton";
import { DataBadge } from "./DataBadge";
import { formatDistanceToNow } from "date-fns";

export const LiveHolderTracker = () => {
  const { data, isLoading } = useLiveHolderCount();

  if (isLoading) {
    return <Skeleton className="h-24 rounded-xl" />;
  }

  const holderCount = data?.holderCount || data?.totalHolders || 0;
  const target = 5000;
  const progress = (holderCount / target) * 100;
  const source = data?.source || 'unknown';
  const lastUpdated = data?.lastUpdated ? new Date(data.lastUpdated) : null;

  return (
    <div className="bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-green/60 rounded-xl p-6 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-goblin-green/20 rounded-lg">
            <Users className="w-6 h-6 text-goblin-green" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm text-muted-foreground">Live Holder Count</h3>
              <DataBadge type={source === 'cache' ? 'cached' : 'live'} className="scale-75" />
            </div>
            <p className="text-3xl font-bold text-goblin-green">{holderCount.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-goblin-green animate-pulse">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-semibold">Live</span>
        </div>
      </div>

      {/* Progress to target */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress to {target.toLocaleString()} holders</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-terrain-shadow rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-goblin-green to-terrain-purple transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-3">
        <Clock className="w-3 h-3" />
        <span>
          {lastUpdated 
            ? `Updated ${formatDistanceToNow(lastUpdated, { addSuffix: true })}` 
            : 'Updated via Helius API'}
        </span>
      </div>
    </div>
  );
};

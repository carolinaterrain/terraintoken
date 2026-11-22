import { Users, Activity, Clock } from "lucide-react";
import { useTokenData } from "@/providers/TokenDataProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { DataFreshnessBadge } from "@/components/ui/data-freshness-badge";
import { formatDistanceToNow } from "date-fns";

export const LiveHolderTracker = () => {
  const { holderCount, isLoading, dataSource, lastUpdated } = useTokenData();

  if (isLoading) {
    return <Skeleton className="h-24 rounded-xl" />;
  }

  const count = holderCount?.holderCount || 0;
  const formattedTime = lastUpdated ? new Date(lastUpdated) : null;

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
              <DataFreshnessBadge source={dataSource} className="scale-75" />
            </div>
            <p className="text-3xl font-bold text-goblin-green">{count.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-goblin-green animate-pulse">
          <Activity className="w-4 h-4" />
          <span className="text-sm font-semibold">Live</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-3">
        <Clock className="w-3 h-3" />
        <span>
          {formattedTime 
            ? `Updated ${formatDistanceToNow(formattedTime, { addSuffix: true })}` 
            : 'Updated via Helius API'}
        </span>
      </div>
    </div>
  );
};

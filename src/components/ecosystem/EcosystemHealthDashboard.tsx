import { useEcosystemHealth } from "@/hooks/useEcosystemHealth";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Activity,
  Server,
  Wifi,
  WifiOff,
  RefreshCw
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const ProducerStatusBadge = ({ isStale, lastEventAt }: { isStale: boolean; lastEventAt: string | null }) => {
  if (!lastEventAt) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        <WifiOff className="w-3 h-3 mr-1" />
        Never seen
      </Badge>
    );
  }
  
  if (isStale) {
    return (
      <Badge variant="destructive">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Stale
      </Badge>
    );
  }
  
  return (
    <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
      <Wifi className="w-3 h-3 mr-1" />
      Active
    </Badge>
  );
};

const ProducerCard = ({ producer, events24h, events7d, lastEventAt, hoursSinceLastEvent, isStale }: {
  producer: string;
  events24h: number;
  events7d: number;
  lastEventAt: string | null;
  hoursSinceLastEvent: number | null;
  isStale: boolean;
}) => {
  const displayName: Record<string, string> = {
    terrainvision: "TerrainVision AI",
    stormwaterscm: "StormwaterSCM",
    carolinaterrain: "Carolina Terrain",
    terrainguard: "TerrainGuard",
    trn: "TRN Token",
  };

  return (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
      <div className="flex items-center gap-3">
        <Server className="w-4 h-4 text-muted-foreground" />
        <div>
          <p className="font-medium text-sm">{displayName[producer] || producer}</p>
          <p className="text-xs text-muted-foreground">
            {lastEventAt 
              ? `Last: ${formatDistanceToNow(new Date(lastEventAt), { addSuffix: true })}`
              : "No events recorded"
            }
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-mono">{events24h}</p>
          <p className="text-xs text-muted-foreground">24h</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-mono">{events7d}</p>
          <p className="text-xs text-muted-foreground">7d</p>
        </div>
        <ProducerStatusBadge isStale={isStale} lastEventAt={lastEventAt} />
      </div>
    </div>
  );
};

export const EcosystemHealthDashboard = () => {
  const { data: health, isLoading, error, refetch, isFetching } = useEcosystemHealth();

  if (isLoading) {
    return (
      <GlassCard className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-14" />
            ))}
          </div>
        </div>
      </GlassCard>
    );
  }

  if (error || !health) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-5 h-5" />
          <p>Failed to load ecosystem health data</p>
        </div>
      </GlassCard>
    );
  }

  const hasAlerts = health.alerts.length > 0;

  return (
    <GlassCard className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="font-display font-bold text-lg">Ecosystem Health</h3>
          {hasAlerts ? (
            <Badge variant="destructive">{health.alerts.length} Alert{health.alerts.length > 1 ? 's' : ''}</Badge>
          ) : (
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Healthy
            </Badge>
          )}
        </div>
        <button 
          onClick={() => refetch()}
          className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
          disabled={isFetching}
        >
          <RefreshCw className={`w-4 h-4 text-muted-foreground ${isFetching ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Alerts */}
      {hasAlerts && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <p className="font-medium text-sm text-destructive">Active Alerts</p>
          </div>
          <ul className="space-y-1">
            {health.alerts.map((alert, i) => (
              <li key={i} className="text-sm text-muted-foreground">• {alert}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Events (24h)</p>
          <p className="text-2xl font-mono font-bold">{health.events_last_24h}</p>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Properties</p>
          <p className="text-2xl font-mono font-bold">{health.properties_count}</p>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Pending Work Orders</p>
          <p className="text-2xl font-mono font-bold">{health.work_orders_pending}</p>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Compliance Overdue</p>
          <p className={`text-2xl font-mono font-bold ${health.compliance_overdue > 0 ? 'text-destructive' : ''}`}>
            {health.compliance_overdue}
          </p>
        </div>
      </div>

      {/* Producer Status */}
      <div className="mb-6">
        <h4 className="font-medium text-sm mb-3">App Connectivity</h4>
        <div className="space-y-2">
          {health.producers.map(producer => (
            <ProducerCard
              key={producer.producer}
              producer={producer.producer}
              events24h={producer.events_24h}
              events7d={producer.events_7d}
              lastEventAt={producer.last_event_at}
              hoursSinceLastEvent={producer.hours_since_last_event}
              isStale={producer.is_stale}
            />
          ))}
        </div>
      </div>

      {/* Webhook Health */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
        <div>
          <p className="text-xs text-muted-foreground">Webhooks Total</p>
          <p className="font-mono">{health.webhooks_total}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Pending</p>
          <p className="font-mono">{health.webhooks_pending}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Failed</p>
          <p className={`font-mono ${health.webhooks_failed > 0 ? 'text-destructive' : ''}`}>
            {health.webhooks_failed}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Failure Rate</p>
          <p className={`font-mono ${health.webhook_failure_rate > 0.1 ? 'text-destructive' : ''}`}>
            {(health.webhook_failure_rate * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
        <Clock className="w-3 h-3 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          Updated {health.snapshot_at ? formatDistanceToNow(new Date(health.snapshot_at), { addSuffix: true }) : 'now'}
        </p>
      </div>
    </GlassCard>
  );
};

/**
 * Canonical Ecosystem Dashboard (READ-ONLY)
 * 
 * Displays aggregate stats from the shared Terrain Lifecycle backend.
 * TerrainToken does NOT own this data - it only observes for incentive/governance context.
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Building2, 
  ClipboardList, 
  AlertTriangle, 
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { 
  useCanonicalPropertyStats, 
  useCanonicalWorkOrderStats, 
  useCanonicalComplianceStats,
  useCanonicalEventsByProducer 
} from '@/hooks/useCanonicalEcosystem';
import { formatDistanceToNow } from 'date-fns';

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  subtitle,
  loading,
  variant = 'default'
}: { 
  title: string; 
  value: number | string; 
  icon: React.ElementType;
  subtitle?: string;
  loading?: boolean;
  variant?: 'default' | 'warning' | 'success';
}) {
  const variantStyles = {
    default: 'text-muted-foreground',
    warning: 'text-amber-500',
    success: 'text-emerald-500',
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-muted/50 ${variantStyles[variant]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">{title}</p>
            {loading ? (
              <Skeleton className="h-6 w-16 mt-1" />
            ) : (
              <p className="text-xl font-bold">{value}</p>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProducerActivityCard({ 
  producers, 
  loading 
}: { 
  producers: Array<{ name: string; events24h: number; events7d: number; lastEvent: string; isStale: boolean }>;
  loading: boolean;
}) {
  if (loading) {
    return (
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Producer Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Producer Activity (Canonical)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {producers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent events</p>
        ) : (
          producers.map(producer => (
            <div 
              key={producer.name} 
              className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
            >
              <div className="flex items-center gap-2">
                <Badge variant={producer.isStale ? 'destructive' : 'secondary'} className="text-xs">
                  {producer.name}
                </Badge>
                {producer.isStale && (
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                )}
              </div>
              <div className="text-right">
                <p className="text-xs font-medium">{producer.events24h} / 24h</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(producer.lastEvent), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function CanonicalEcosystemDashboard() {
  const { data: propertyStats, isLoading: propertiesLoading } = useCanonicalPropertyStats();
  const { data: workOrderStats, isLoading: workOrdersLoading } = useCanonicalWorkOrderStats();
  const { data: complianceStats, isLoading: complianceLoading } = useCanonicalComplianceStats();
  const { data: producerData, isLoading: producersLoading } = useCanonicalEventsByProducer();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            Terrain Ecosystem (Read-Only)
            <Badge variant="outline" className="text-xs">
              <ExternalLink className="h-3 w-3 mr-1" />
              Canonical
            </Badge>
          </h3>
          <p className="text-sm text-muted-foreground">
            Live aggregate data from shared Terrain Lifecycle backend
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          title="Properties"
          value={propertyStats?.totalProperties ?? 0}
          icon={Building2}
          loading={propertiesLoading}
        />
        <StatCard
          title="Work Orders"
          value={workOrderStats?.total ?? 0}
          icon={ClipboardList}
          subtitle={`${workOrderStats?.pending ?? 0} pending`}
          loading={workOrdersLoading}
        />
        <StatCard
          title="Compliance Overdue"
          value={complianceStats?.overdue ?? 0}
          icon={AlertTriangle}
          variant={complianceStats?.overdue ? 'warning' : 'default'}
          loading={complianceLoading}
        />
        <StatCard
          title="Upcoming (30d)"
          value={complianceStats?.upcoming ?? 0}
          icon={Calendar}
          loading={complianceLoading}
        />
      </div>

      {/* Producer Activity */}
      <ProducerActivityCard 
        producers={producerData?.producers || []} 
        loading={producersLoading}
      />

      {/* Data Source Notice */}
      <p className="text-xs text-muted-foreground text-center">
        Data source: izxzkqprhekrgiwakepm.supabase.co • TerrainToken observes but does not own this data
      </p>
    </div>
  );
}

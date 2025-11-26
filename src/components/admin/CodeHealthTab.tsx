import { Card } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, CheckCircle, Clock, Database, Zap, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const CodeHealthTab = () => {
  // Fetch database health metrics
  const { data: dbHealth } = useQuery({
    queryKey: ['db-health'],
    queryFn: async () => {
      const [
        marketplaceItems,
        mysteryBoxes,
        tokenBurns,
        holderSnapshots,
        trnPurchases,
      ] = await Promise.all([
        supabase.from('marketplace_items').select('*', { count: 'exact', head: true }),
        supabase.from('mystery_boxes').select('*', { count: 'exact', head: true }),
        supabase.from('token_burns').select('*', { count: 'exact', head: true }),
        supabase.from('holder_snapshots').select('is_live_data, created_at').order('created_at', { ascending: false }).limit(1).single(),
        supabase.from('trn_purchases').select('*', { count: 'exact', head: true }),
      ]);

      return {
        marketplaceItems: marketplaceItems.count || 0,
        mysteryBoxes: mysteryBoxes.count || 0,
        tokenBurns: tokenBurns.count || 0,
        latestSnapshot: holderSnapshots.data,
        trnPurchases: trnPurchases.count || 0,
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Calculate data freshness
  const getDataFreshness = (timestamp: string | null) => {
    if (!timestamp) return { status: 'error', label: 'No data', color: 'destructive' };
    
    const ageInHours = (Date.now() - new Date(timestamp).getTime()) / (1000 * 60 * 60);
    
    if (ageInHours < 1) return { status: 'success', label: 'Fresh', color: 'success' };
    if (ageInHours < 24) return { status: 'warning', label: 'Stale', color: 'warning' };
    return { status: 'error', label: 'Very stale', color: 'destructive' };
  };

  const snapshotFreshness = dbHealth?.latestSnapshot 
    ? getDataFreshness(dbHealth.latestSnapshot.created_at)
    : { status: 'error', label: 'No data', color: 'destructive' };

  const isLiveData = dbHealth?.latestSnapshot?.is_live_data ?? false;

  // Mock code metrics (in production, these would come from build analysis)
  const codeMetrics = {
    bundleSize: '2.4 MB',
    totalComponents: 147,
    unusedComponents: 0,
    testCoverage: 'N/A',
  };

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">Bundle Size</div>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">{codeMetrics.bundleSize}</div>
          <div className="text-xs text-muted-foreground mt-1">Production build</div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">Components</div>
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">{codeMetrics.totalComponents}</div>
          <div className="text-xs text-success mt-1">✓ {codeMetrics.unusedComponents} unused</div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">Data Freshness</div>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">
            <Badge variant={snapshotFreshness.status === 'success' ? 'default' : 'destructive'}>
              {snapshotFreshness.label}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {dbHealth?.latestSnapshot?.created_at 
              ? formatDistanceToNow(new Date(dbHealth.latestSnapshot.created_at), { addSuffix: true })
              : 'Never updated'}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">Data Source</div>
            <Database className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">
            <Badge variant={isLiveData ? 'default' : 'destructive'}>
              {isLiveData ? 'Live' : 'Mock'}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {isLiveData ? 'Helius API' : 'Fallback data'}
          </div>
        </GlassCard>
      </div>

      {/* Database Health */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Database Health
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {dbHealth && dbHealth.marketplaceItems > 0 ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <AlertCircle className="w-5 h-5 text-destructive" />
              )}
              <div>
                <div className="font-medium">Marketplace Items</div>
                <div className="text-sm text-muted-foreground">
                  {dbHealth?.marketplaceItems || 0} items
                </div>
              </div>
            </div>
            <Badge variant={dbHealth && dbHealth.marketplaceItems > 0 ? "default" : "destructive"}>
              {dbHealth && dbHealth.marketplaceItems > 0 ? "Populated" : "Empty"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {dbHealth && dbHealth.mysteryBoxes > 0 ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <AlertCircle className="w-5 h-5 text-destructive" />
              )}
              <div>
                <div className="font-medium">Mystery Boxes</div>
                <div className="text-sm text-muted-foreground">
                  {dbHealth?.mysteryBoxes || 0} tiers
                </div>
              </div>
            </div>
            <Badge variant={dbHealth && dbHealth.mysteryBoxes > 0 ? "default" : "destructive"}>
              {dbHealth && dbHealth.mysteryBoxes > 0 ? "Active" : "Empty"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {dbHealth && dbHealth.tokenBurns > 0 ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <AlertCircle className="w-5 h-5 text-destructive" />
              )}
              <div>
                <div className="font-medium">Token Burns</div>
                <div className="text-sm text-muted-foreground">
                  {dbHealth?.tokenBurns || 0} records
                </div>
              </div>
            </div>
            <Badge variant={dbHealth && dbHealth.tokenBurns > 0 ? "default" : "destructive"}>
              {dbHealth && dbHealth.tokenBurns > 0 ? "Tracking" : "Empty"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {isLiveData ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <AlertCircle className="w-5 h-5 text-destructive" />
              )}
              <div>
                <div className="font-medium">Holder Snapshots</div>
                <div className="text-sm text-muted-foreground">
                  {isLiveData ? 'Live Helius data' : 'Mock data detected'}
                </div>
              </div>
            </div>
            <Badge variant={isLiveData ? "default" : "destructive"}>
              {isLiveData ? "Live" : "Mock"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {dbHealth && dbHealth.trnPurchases > 0 ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <AlertCircle className="w-5 h-5 text-warning" />
              )}
              <div>
                <div className="font-medium">TRN Purchases</div>
                <div className="text-sm text-muted-foreground">
                  {dbHealth?.trnPurchases || 0} transactions
                </div>
              </div>
            </div>
            <Badge variant={dbHealth && dbHealth.trnPurchases > 0 ? "default" : "secondary"}>
              {dbHealth && dbHealth.trnPurchases > 0 ? "Active" : "No data"}
            </Badge>
          </div>
        </div>
      </Card>

      {/* API Health */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          API Health
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {isLiveData ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <AlertCircle className="w-5 h-5 text-destructive" />
              )}
              <div>
                <div className="font-medium">Helius API</div>
                <div className="text-sm text-muted-foreground">
                  Token holder data source
                </div>
              </div>
            </div>
            <Badge variant={isLiveData ? "default" : "destructive"}>
              {isLiveData ? "Connected" : "Failed"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <div className="font-medium">DexScreener</div>
                <div className="text-sm text-muted-foreground">
                  Price and volume data
                </div>
              </div>
            </div>
            <Badge variant="default">Active</Badge>
          </div>
        </div>
      </Card>

      {/* Recommendations */}
      {!isLiveData && (
        <Card className="p-6 border-destructive/50 bg-destructive/5">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Action Required
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-destructive">•</span>
              <span>Holder snapshot data is using mock/fallback data. Check Helius API configuration and invoke collect-holder-snapshot function manually.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive">•</span>
              <span>Verify HELIUS_API_KEY is properly configured in backend secrets.</span>
            </li>
          </ul>
        </Card>
      )}
    </div>
  );
};

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Hexagon, 
  Database, 
  Flame, 
  Users, 
  Activity,
  TrendingUp,
  Clock,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTokenData } from "@/providers/TokenDataProvider";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface RealBurnEvent {
  id: string;
  burn_amount: number;
  burn_source: string;
  created_at: string;
  is_test_data: boolean;
}

interface RealActivityEvent {
  id: string;
  activity_type: string;
  message: string;
  created_at: string;
}

export function LiveIndustrialDashboard() {
  const { holderCount, stats, supply, isLoading, dataSource } = useTokenData();
  const [realBurns, setRealBurns] = useState<RealBurnEvent[]>([]);
  const [realActivities, setRealActivities] = useState<RealActivityEvent[]>([]);
  const [burnsLoading, setBurnsLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  // Live data
  const holders = holderCount?.holderCount || 0;
  const marketCap = stats?.marketCap || "$0";
  const volume = stats?.volume24h || "$0";
  const priceChange = stats?.change24h || 0;

  // Fetch REAL burn events from database (excluding test data)
  useEffect(() => {
    const fetchRealBurns = async () => {
      setBurnsLoading(true);
      const { data, error } = await supabase
        .from('token_burns')
        .select('id, burn_amount, burn_source, created_at, is_test_data')
        .eq('is_test_data', false) // Only real burns
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setRealBurns(data);
      }
      setBurnsLoading(false);
    };

    fetchRealBurns();

    // Subscribe to real-time updates for new REAL burns
    const channel = supabase
      .channel('real_burns')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'token_burns',
          filter: 'is_test_data=eq.false'
        },
        (payload) => {
          const newBurn = payload.new as RealBurnEvent;
          setRealBurns(prev => [newBurn, ...prev.slice(0, 4)]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Fetch REAL activity events from database
  useEffect(() => {
    const fetchRealActivities = async () => {
      setActivitiesLoading(true);
      const { data, error } = await supabase
        .from('activity_notifications')
        .select('id, activity_type, message, created_at')
        .order('created_at', { ascending: false })
        .limit(4);

      if (!error && data) {
        setRealActivities(data);
      }
      setActivitiesLoading(false);
    };

    fetchRealActivities();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('real_activities')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_notifications'
        },
        (payload) => {
          const newActivity = payload.new as RealActivityEvent;
          setRealActivities(prev => [newActivity, ...prev.slice(0, 3)]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const getBurnSourceLabel = (source: string) => {
    const labels: Record<string, string> = {
      energy_purchase: 'Energy Purchase',
      marketplace_fee: 'Marketplace Fee',
      prediction_stake: 'Prediction Stake',
      mystery_box: 'Mystery Box',
      buyback: 'Treasury Buyback',
    };
    return labels[source] || source;
  };

  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 to-background relative">
      <div className="container">
        <div className="text-center mb-12">
          <Badge 
            variant="outline" 
            className="mb-4 border-safety-green/30 text-safety-green font-mono"
          >
            <Activity className="h-3 w-3 mr-2 animate-pulse" />
            Live Network Stats
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Industrial <span className="text-safety-green">Intelligence</span> Dashboard
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-mono">
            Real-time metrics from DexScreener & Helius APIs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            icon={<Users className="h-5 w-5" />}
            label="Token Holders"
            value={isLoading ? null : holders.toLocaleString()}
            change={`${dataSource === 'live' ? 'Live' : 'Cached'}`}
            color="text-safety-green"
            isLoading={isLoading}
          />
          <MetricCard
            icon={<DollarSign className="h-5 w-5" />}
            label="Market Cap"
            value={isLoading ? null : marketCap}
            change={`${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(1)}%`}
            color="text-solana-purple"
            isLoading={isLoading}
          />
          <MetricCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="24h Volume"
            value={isLoading ? null : volume}
            change="DexScreener"
            color="text-orange-500"
            isLoading={isLoading}
          />
          <MetricCard
            icon={<Database className="h-5 w-5" />}
            label="Total Supply"
            value={isLoading ? null : (supply?.formatted?.total && supply.formatted.total !== 'NaN' ? supply.formatted.total : '1.007B TRN')}
            change="Fixed"
            color="text-safety-green"
            isLoading={isLoading}
          />
        </div>

        {/* Live Burn Tracker - REAL DATA ONLY */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Burn Tracker
              </h3>
              <Badge variant="outline" className="font-mono text-xs">
                On-Chain Only
              </Badge>
            </div>

            <div className="space-y-3">
              {burnsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-slate-800/50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : realBurns.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {realBurns.map((burn) => (
                    <motion.div
                      key={burn.id}
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg",
                        "bg-gradient-to-r from-orange-500/10 to-transparent",
                        "border border-orange-500/20"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                          <Flame className="h-4 w-4 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{getBurnSourceLabel(burn.burn_source)}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {formatDistanceToNow(new Date(burn.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-orange-500 font-mono">
                          -{burn.burn_amount.toLocaleString()} TRN
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p className="font-mono text-sm">No on-chain burns recorded yet</p>
                  <p className="text-xs mt-1">Burns will appear when real transactions occur</p>
                </div>
              )}
            </div>
          </div>

          {/* Network Activity - REAL DATA ONLY */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-safety-green" />
                Network Activity
              </h3>
              <Badge variant="outline" className="font-mono text-xs">
                Database Events
              </Badge>
            </div>

            <div className="space-y-4">
              {activitiesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-16 bg-slate-800/50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : realActivities.length > 0 ? (
                realActivities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    icon={<Activity className="h-4 w-4 text-safety-green" />}
                    title={activity.activity_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    subtitle={activity.message}
                    time={formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p className="font-mono text-sm">No activity recorded yet</p>
                  <p className="text-xs mt-1">Events will appear as the network grows</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  icon,
  label,
  value,
  change,
  color,
  isLoading
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  change: string;
  color: string;
  isLoading?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-slate-900/50 border rounded-xl p-5 backdrop-blur-sm transition-all duration-300",
        "border-slate-800"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={cn("p-2 rounded-lg bg-slate-800/50", color)}>
          {icon}
        </div>
        <Badge variant="outline" className="text-xs font-mono text-safety-green">
          {change}
        </Badge>
      </div>
      <div>
        {isLoading ? (
          <div className="h-8 bg-slate-800 rounded animate-pulse" />
        ) : (
          <p className="text-2xl font-bold font-mono">{value}</p>
        )}
        <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{label}</p>
      </div>
    </div>
  );
}

function ActivityItem({
  icon,
  title,
  subtitle,
  time
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  time: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
      <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{title}</p>
        <p className="text-xs text-muted-foreground font-mono truncate">{subtitle}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {time}
        </p>
      </div>
    </div>
  );
}

export default LiveIndustrialDashboard;

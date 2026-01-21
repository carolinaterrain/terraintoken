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
  CheckCircle2,
  DollarSign
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTokenData } from "@/providers/TokenDataProvider";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface BurnEvent {
  id: string;
  amount: number;
  source: string;
  timestamp: Date;
}

export function LiveIndustrialDashboard() {
  const { holderCount, stats, supply, isLoading, dataSource } = useTokenData();
  const [burnEvents, setBurnEvents] = useState<BurnEvent[]>([]);
  const [showBurnAnimation, setShowBurnAnimation] = useState(false);

  // Live data
  const holders = holderCount?.holderCount || 0;
  const marketCap = stats?.marketCap || "$0";
  const volume = stats?.volume24h || "$0";
  const priceChange = stats?.change24h || 0;

  // Simulate burn events for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const sources = [
        "Inspection Audit Completed",
        "Survey Data Verified",
        "Training Module Completed",
        "Compliance Report Filed"
      ];
      
      const newEvent: BurnEvent = {
        id: crypto.randomUUID(),
        amount: Math.floor(Math.random() * 500) + 100,
        source: sources[Math.floor(Math.random() * sources.length)],
        timestamp: new Date()
      };

      setBurnEvents(prev => [newEvent, ...prev.slice(0, 4)]);
      setShowBurnAnimation(true);
      
      setTimeout(() => setShowBurnAnimation(false), 2000);
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, []);

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
            highlight={showBurnAnimation}
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

        {/* Live Burn Tracker */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Live Burn Tracker
              </h3>
              <Badge variant="outline" className="font-mono text-xs">
                Usage-Linked
              </Badge>
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {burnEvents.length > 0 ? (
                  burnEvents.map((event) => (
                    <motion.div
                      key={event.id}
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
                          <p className="text-sm font-medium">{event.source}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {event.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-orange-500 font-mono">
                          -{event.amount.toLocaleString()} TRN
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground font-mono text-sm">
                    Waiting for burn events...
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Network activity */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-safety-green" />
                Network Activity
              </h3>
              <div className="flex items-center gap-1 text-safety-green text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-safety-green animate-pulse" />
                Live
              </div>
            </div>

            <div className="space-y-4">
              <ActivityItem
                icon={<CheckCircle2 className="h-4 w-4 text-safety-green" />}
                title="Survey Verification"
                subtitle="Charlotte Metro Region"
                time="2 min ago"
                badge="Surveyor Class"
              />
              <ActivityItem
                icon={<Hexagon className="h-4 w-4 text-solana-purple" />}
                title="New Hex Claim"
                subtitle="H3 Index: 8644b1a2fffffff"
                time="5 min ago"
                badge="Scout Class"
              />
              <ActivityItem
                icon={<Database className="h-4 w-4 text-safety-green" />}
                title="Point Cloud Upload"
                subtitle="342MB LAS file processed"
                time="8 min ago"
                badge="Verified"
              />
              <ActivityItem
                icon={<TrendingUp className="h-4 w-4 text-orange-500" />}
                title="Bounty Completed"
                subtitle="Waxhaw drainage assessment"
                time="12 min ago"
                badge="+1,500 TRN"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Burn animation overlay */}
      <AnimatePresence>
        {showBurnAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: [0, 1, 0] }}
              transition={{ duration: 1.5 }}
              className="w-32 h-32"
            >
              <Flame className="w-full h-full text-orange-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.8)]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function MetricCard({
  icon,
  label,
  value,
  change,
  color,
  highlight,
  isLoading
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  color: string;
  highlight?: boolean;
  isLoading?: boolean;
}) {
  return (
    <motion.div
      className={cn(
        "bg-slate-900/50 border rounded-xl p-5 backdrop-blur-sm transition-all duration-300",
        highlight 
          ? "border-orange-500 shadow-lg shadow-orange-500/20" 
          : "border-slate-800"
      )}
      animate={highlight ? { scale: [1, 1.02, 1] } : {}}
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
    </motion.div>
  );
}

function ActivityItem({
  icon,
  title,
  subtitle,
  time,
  badge
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  time: string;
  badge: string;
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
        <Badge variant="secondary" className="text-xs font-mono mb-1">
          {badge}
        </Badge>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {time}
        </p>
      </div>
    </div>
  );
}

export default LiveIndustrialDashboard;

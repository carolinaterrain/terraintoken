import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Globe, FileText, Hexagon, Database, Shield, Users, TrendingUp, TrendingDown, Radio, Cpu, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { useTokenData } from "@/providers/TokenDataProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export function IndustrialHero() {
  const { holderCount, stats, isLoading, dataSource } = useTokenData();
  const [ingestCount, setIngestCount] = useState(0);
  const [mintCount, setMintCount] = useState(0);

  // Simulate live data ingestion
  useEffect(() => {
    const interval = setInterval(() => {
      setIngestCount(prev => prev + Math.floor(Math.random() * 3) + 1);
      if (Math.random() > 0.7) {
        setMintCount(prev => prev + 1);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Live data from TokenDataProvider
  const holders = holderCount?.holderCount || 0;
  const marketCap = stats?.marketCap || "$0";
  const priceChange = stats?.change24h || 0;
  const volume = stats?.volume24h || "$0";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Tactical HUD Grid Background */}
      <div className="absolute inset-0">
        {/* Animated grid */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(185 85% 50% / 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(185 85% 50% / 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        {/* Glowing overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        {/* Corner HUD elements */}
        <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-primary/40 opacity-60" />
        <div className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-primary/40 opacity-60" />
        <div className="absolute bottom-32 left-8 w-24 h-24 border-l-2 border-b-2 border-primary/40 opacity-60" />
        <div className="absolute bottom-32 right-8 w-24 h-24 border-r-2 border-b-2 border-primary/40 opacity-60" />
      </div>

      {/* Floating data nodes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-20"
            initial={{ 
              x: `${10 + i * 12}%`, 
              y: `${5 + i * 10}%`,
              rotate: 0 
            }}
            animate={{ 
              y: [`${5 + i * 10}%`, `${10 + i * 10}%`, `${5 + i * 10}%`],
              rotate: [0, 5, 0],
              opacity: [0.15, 0.25, 0.15]
            }}
            transition={{ 
              duration: 8 + i * 0.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Hexagon 
              className="text-primary" 
              size={40 + i * 15} 
              strokeWidth={1}
            />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="container relative z-10 px-4 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Parent Brand Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-3"
          >
            <Badge 
              variant="outline" 
              className="px-4 py-2 text-xs font-mono border-primary/30 text-primary bg-primary/5 uppercase tracking-widest"
            >
              <span className="mr-2 inline-block w-2 h-2 bg-primary rounded-full animate-pulse" />
              Terrain Ecosystem • Financial Protocol
            </Badge>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
          >
            <span className="text-foreground">The </span>
            <span className="text-primary">Financial Protocol</span>
            <br />
            <span className="text-foreground">of the Terrain Ecosystem</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-mono"
          >
            Tokenizing Ground-Truth Metadata for the Next Generation of Terrain Intelligence.
            <br />
            <span className="text-primary/70">Powered by Terrain Vision AI • Operationalized by Carolina Terrain, LLC</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Link to="/ecosystem">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-background font-semibold gap-2 px-8"
              >
                <Globe className="h-5 w-5" />
                Enter Protocol
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/whitepaper">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-accent/50 text-accent hover:bg-accent/10 font-semibold gap-2"
              >
                <FileText className="h-5 w-5" />
                Read 2026 Whitepaper
              </Button>
            </Link>
          </motion.div>

          {/* Live Data Ingestion Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="bg-card/50 border border-border rounded-lg p-4 max-w-2xl mx-auto backdrop-blur-sm"
          >
            <div className="flex items-center justify-between gap-4 font-mono text-sm">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                <span className="text-muted-foreground">LIVE FEED</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Ingesting Terrain Data: <span className="text-primary">{ingestCount.toLocaleString()}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-accent" />
                  <span className="text-foreground">Minting Metadata: <span className="text-accent">{mintCount}</span></span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Live Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 max-w-4xl mx-auto"
          >
            <StatCard 
              icon={<Users className="h-5 w-5 text-primary" />}
              value={isLoading ? null : holders.toLocaleString()}
              label="Token Holders"
              isLive={dataSource === 'live'}
            />
            <StatCard 
              icon={<Database className="h-5 w-5 text-accent" />}
              value={isLoading ? null : marketCap}
              label="Market Cap"
              isLive={dataSource === 'live'}
            />
            <StatCard 
              icon={priceChange >= 0 ? <TrendingUp className="h-5 w-5 text-primary" /> : <TrendingDown className="h-5 w-5 text-destructive" />}
              value={isLoading ? null : `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(1)}%`}
              label="24h Change"
              isLive={dataSource === 'live'}
              valueColor={priceChange >= 0 ? 'text-primary' : 'text-destructive'}
            />
            <StatCard 
              icon={<Activity className="h-5 w-5 text-accent" />}
              value={isLoading ? null : volume}
              label="24h Volume"
              isLive={dataSource === 'live'}
            />
          </motion.div>

          {/* Data source indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-mono"
          >
            <span className={`w-2 h-2 rounded-full ${dataSource === 'live' ? 'bg-primary animate-pulse' : 'bg-amber-500'}`} />
            {dataSource === 'live' ? 'Live Protocol Data • DexScreener + Helius' : 'Cached data'}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

function StatCard({ 
  icon, 
  value, 
  label,
  isLive,
  valueColor = 'text-foreground'
}: { 
  icon: React.ReactNode; 
  value: string | null;
  label: string;
  isLive?: boolean;
  valueColor?: string;
}) {
  return (
    <div className="bg-card/50 border border-border rounded-lg p-4 backdrop-blur-sm hover:border-primary/50 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        {value === null ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <span className={`text-2xl font-bold font-mono ${valueColor}`}>{value}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{label}</p>
        {isLive && (
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        )}
      </div>
    </div>
  );
}

export default IndustrialHero;

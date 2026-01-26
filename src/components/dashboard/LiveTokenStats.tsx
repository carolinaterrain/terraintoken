import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, Droplets } from "lucide-react";
import { useGoblinMarketData } from "@/hooks/useGoblinMarketData";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4
    }
  })
};

export function LiveTokenStats() {
  const { data: marketData, isLoading } = useGoblinMarketData();

  const stats = marketData?.stats || {
    priceUsd: "0",
    priceChange24h: 0,
    volume24h: 0,
    marketCap: 0,
    liquidity: 0,
    holders: 0,
  };

  const priceChange = parseFloat(stats.priceChange24h?.toString() || "0");
  const isPositive = priceChange >= 0;

  const statItems = [
    {
      label: "Price",
      value: `$${parseFloat(stats.priceUsd || "0").toFixed(8)}`,
      change: `${isPositive ? "+" : ""}${priceChange.toFixed(2)}%`,
      isPositive,
      icon: DollarSign,
      color: isPositive ? "text-green-500" : "text-red-500"
    },
    {
      label: "Market Cap",
      value: `$${(stats.marketCap || 0).toLocaleString()}`,
      icon: Activity,
      color: "text-primary"
    },
    {
      label: "24h Volume",
      value: `$${(stats.volume24h || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-terrain-purple"
    },
    {
      label: "Liquidity",
      value: `$${(stats.liquidity || 0).toLocaleString()}`,
      icon: Droplets,
      color: "text-cyan-500"
    },
    {
      label: "Holders",
      value: (stats.holders || 0).toLocaleString(),
      icon: Users,
      color: "text-amber-500"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.label}
          custom={index}
          variants={statVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <GlassCard className="p-4 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-lg md:text-xl font-bold font-mono text-foreground">
                {stat.value}
              </span>
              {stat.change && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${stat.isPositive ? "border-green-500/30 text-green-500" : "border-red-500/30 text-red-500"}`}
                >
                  {stat.isPositive ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {stat.change}
                </Badge>
              )}
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

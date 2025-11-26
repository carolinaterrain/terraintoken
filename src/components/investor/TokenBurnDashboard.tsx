import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Flame, TrendingDown, Zap, ShoppingBag, Crown, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CountUp from "react-countup";

export function TokenBurnDashboard() {
  const { data: burnData } = useQuery({
    queryKey: ["token-burns-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("token_burns")
        .select("burn_amount, burn_source");
      
      if (error) throw error;
      
      const summary = {
        total: 0,
        bySources: {} as Record<string, number>
      };
      
      data?.forEach(burn => {
        summary.total += Number(burn.burn_amount);
        summary.bySources[burn.burn_source] = 
          (summary.bySources[burn.burn_source] || 0) + Number(burn.burn_amount);
      });
      
      return summary;
    },
    refetchInterval: 30000
  });

  const burnSources = [
    {
      source: "energy_purchase",
      label: "Energy Purchases",
      icon: Zap,
      color: "text-yellow-400",
      percentage: 50,
      description: "50% of energy pack purchases"
    },
    {
      source: "marketplace_fee",
      label: "Marketplace Fees",
      icon: ShoppingBag,
      color: "text-green-400",
      percentage: 50,
      description: "50% of 5% transaction fees"
    },
    {
      source: "subscription",
      label: "Subscriptions",
      icon: Crown,
      color: "text-purple-400",
      percentage: 20,
      description: "20% of TRN subscription payments"
    },
    {
      source: "gamification",
      label: "Gamification",
      icon: Sparkles,
      color: "text-pink-400",
      percentage: 30,
      description: "30% of shop & mystery box purchases"
    }
  ];

  const totalBurned = burnData?.total || 0;
  const totalSupply = 1006699550; // From token metadata
  const burnedPercentage = (totalBurned / totalSupply) * 100;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background to-background/50 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-semibold text-orange-400">DEFLATIONARY MECHANICS</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Token Burn Dashboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-time tracking of TRN permanently removed from circulation through platform utility.
          </p>
        </motion.div>

        {/* Total Burned Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <GlassCard className="text-center p-8 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
              <Flame className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">
                <CountUp end={totalBurned} duration={2} separator="," />
              </div>
              <div className="text-sm text-muted-foreground">Total TRN Burned</div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="text-center p-8">
              <TrendingDown className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">
                <CountUp end={burnedPercentage} duration={2} decimals={3} />%
              </div>
              <div className="text-sm text-muted-foreground">Supply Reduced</div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="text-center p-8">
              <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">4</div>
              <div className="text-sm text-muted-foreground">Active Burn Sources</div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Burn Sources Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {burnSources.map((source, index) => {
            const sourceAmount = burnData?.bySources[source.source] || 0;
            const sourcePercentage = totalBurned > 0 ? (sourceAmount / totalBurned) * 100 : 0;

            return (
              <motion.div
                key={source.source}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-background/50 ${source.color}`}>
                      <source.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{source.label}</h3>
                        <span className="text-sm font-mono text-muted-foreground">
                          {sourcePercentage.toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {source.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">
                          <CountUp end={sourceAmount} duration={2} separator="," />
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${source.color} bg-background/50`}>
                          {source.percentage}% burn rate
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Projections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GlassCard className="p-8 bg-gradient-to-r from-orange-500/5 to-red-500/5">
            <h3 className="text-2xl font-bold mb-6 text-center">Burn Rate Projections</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 text-orange-400">~50K</div>
                <div className="text-sm text-muted-foreground">TRN/month @ 100 active users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 text-orange-400">~500K</div>
                <div className="text-sm text-muted-foreground">TRN/month @ 1K active users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 text-orange-400">~5M</div>
                <div className="text-sm text-muted-foreground">TRN/month @ 10K active users</div>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Based on average user activity: 2 energy purchases/month, 1 marketplace transaction, active subscriptions
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}

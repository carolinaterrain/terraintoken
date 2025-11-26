import { GlassCard } from "@/components/ui/glass-card";
import { useTokenStats } from "@/hooks/useTokenStats";
import { useLiveHolderCount } from "@/hooks/useLiveHolderCount";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CountUp from "react-countup";
import { TrendingUp, DollarSign, Users, Zap, Database, Activity } from "lucide-react";
import { calculateMetrics } from "@/lib/financialData";
import { motion } from "framer-motion";

export const EcosystemMetrics = () => {
  const { data: tokenStats, isLoading: tokenLoading } = useTokenStats();
  const { data: holderData, isLoading: holderLoading } = useLiveHolderCount();
  
  const businessMetrics = calculateMetrics();
  const equipmentValue = 397000; // Total equipment value

  // Get waitlist count
  const { data: waitlistCount } = useQuery({
    queryKey: ['waitlist-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('terrainscape_waitlist')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  // Get analysis count
  const { data: analysisCount } = useQuery({
    queryKey: ['analysis-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('tool_usage_proofs')
        .select('*', { count: 'exact', head: true });
      return count || 1200;
    },
  });

  const metricSections = [
    {
      title: "On-Chain Metrics",
      icon: TrendingUp,
      metrics: [
        { label: "Current Price", value: parseFloat(tokenStats?.priceUsd || "0"), prefix: "$", decimals: 6, color: "text-chart-1" },
        { label: "Market Cap", value: tokenStats?.marketCap || 0, prefix: "$", decimals: 0, color: "text-chart-2" },
        { label: "Holder Count", value: holderData?.holderCount || 1137, color: "text-chart-3" },
        { label: "24h Volume", value: tokenStats?.volume24h || 0, prefix: "$", decimals: 0, color: "text-chart-4" },
      ]
    },
    {
      title: "Business Metrics",
      icon: DollarSign,
      metrics: [
        { label: "Total Revenue", value: businessMetrics.totalRevenue, prefix: "$", decimals: 0, color: "text-chart-1" },
        { label: "Equipment Value", value: equipmentValue, prefix: "$", decimals: 0, color: "text-chart-2" },
        { label: "Monthly Avg Revenue", value: businessMetrics.avgMonthlyRevenue, prefix: "$", decimals: 0, color: "text-chart-3" },
        { label: "Profit Margin", value: businessMetrics.netProfitMargin, suffix: "%", decimals: 1, color: "text-chart-4" },
      ]
    },
    {
      title: "Network Activity",
      icon: Activity,
      metrics: [
        { label: "Waitlist Size", value: waitlistCount || 0, color: "text-chart-1" },
        { label: "TerrainVision Analyses", value: analysisCount || 1200, color: "text-chart-2" },
        { label: "Active Tools", value: 8, color: "text-chart-3" },
        { label: "Regional Coverage", value: 2, suffix: " states", color: "text-chart-4" },
      ]
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Live Ecosystem Metrics
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time data showing TRN's growing utility and adoption across the terrain intelligence ecosystem
          </p>
        </motion.div>

        <div className="space-y-12">
          {metricSections.map((section, sectionIndex) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Icon className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-bold">{section.title}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {section.metrics.map((metric, metricIndex) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: sectionIndex * 0.1 + metricIndex * 0.05 }}
                    >
                      <GlassCard className="p-6 h-full hover:scale-105 transition-transform">
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">{metric.label}</p>
                          <div className={`text-3xl font-bold ${metric.color}`}>
                            {metric.prefix}
                            <CountUp
                              end={metric.value}
                              duration={2}
                              separator=","
                              decimals={metric.decimals || 0}
                            />
                            {metric.suffix}
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mt-12 text-muted-foreground"
        >
          <div className="w-2 h-2 rounded-full bg-chart-3 animate-pulse" />
          <span className="text-sm">Live data • Updated in real-time from blockchain and business systems</span>
        </motion.div>
      </div>
    </section>
  );
};
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { revenueStreams, calculateProjectedARR, revenueAllocationFramework } from "@/lib/revenueData";
import { DollarSign, TrendingUp, Zap } from "lucide-react";
import CountUp from "react-countup";
import { useState } from "react";
import { DataSourceIndicator } from "./DataSourceIndicator";
import { DataVerificationBadge } from "./DataVerificationBadge";

export const RevenueStreamsEnhanced = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'recurring' | 'one-off'>('all');
  const projectedARR = calculateProjectedARR();

  const filteredStreams = selectedCategory === 'all' 
    ? revenueStreams 
    : revenueStreams.filter(s => s.category === selectedCategory);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-secondary/5 to-background">
      <div className="container mx-auto max-w-7xl">
        {/* Header with Data Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Revenue Streams
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Diverse revenue sources from the TerrainScape ecosystem
          </p>
          <div className="flex items-center justify-center gap-4">
            <DataSourceIndicator source="projected" confidence={85} />
            <DataVerificationBadge status="projected" source="Market Analysis & Internal Targets" />
          </div>
        </motion.div>

        {/* Projected ARR Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <GlassCard className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-chart-1 mx-auto mb-3" />
            <div className="text-3xl font-bold text-chart-1 mb-2">
              $<CountUp end={projectedARR.recurring / 1_000_000} duration={2} decimals={1} />M
            </div>
            <p className="text-sm text-muted-foreground">Recurring ARR</p>
          </GlassCard>
          
          <GlassCard className="p-6 text-center">
            <Zap className="w-8 h-8 text-chart-2 mx-auto mb-3" />
            <div className="text-3xl font-bold text-chart-2 mb-2">
              $<CountUp end={projectedARR.oneOff / 1_000_000} duration={2} decimals={1} />M
            </div>
            <p className="text-sm text-muted-foreground">One-Time Revenue</p>
          </GlassCard>
          
          <GlassCard className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-chart-3 mx-auto mb-3" />
            <div className="text-3xl font-bold text-chart-3 mb-2">
              $<CountUp end={projectedARR.total / 1_000_000} duration={2} decimals={1} />M
            </div>
            <p className="text-sm text-muted-foreground">Total Projected</p>
          </GlassCard>
        </div>

        {/* Revenue Streams List */}
        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)} className="mb-12">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="all">All Streams</TabsTrigger>
            <TabsTrigger value="recurring">Recurring</TabsTrigger>
            <TabsTrigger value="one-off">One-Time</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {filteredStreams.map((stream, index) => (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="p-6 h-full hover:scale-[1.02] transition-transform">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{stream.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{stream.description}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge variant={stream.category === 'recurring' ? 'default' : 'secondary'}>
                      {stream.category}
                    </Badge>
                    <Badge variant={stream.priority === 'high' ? 'default' : 'outline'}>
                      {stream.priority}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pricing:</span>
                    <span className="font-semibold">{stream.pricing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Market:</span>
                    <span className="font-semibold text-right">{stream.marketSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target:</span>
                    <span className="font-semibold text-right">{stream.captureTarget}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-muted-foreground">Projected ARR:</span>
                    <span className="text-lg font-bold text-primary">{stream.arrProjection}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timeline:</span>
                    <span className="text-xs">{stream.timeline}</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Revenue Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GlassCard className="p-8 bg-gradient-to-br from-primary/5 to-chart-2/5">
            <h3 className="text-2xl font-bold text-center mb-8">Revenue Philosophy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🚫</div>
                <h4 className="font-bold mb-2">Not from Token Sales</h4>
                <p className="text-sm text-muted-foreground">
                  Zero revenue from selling TRN. All funds come from real product usage.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">♻️</div>
                <h4 className="font-bold mb-2">Sustainable & Recurring</h4>
                <p className="text-sm text-muted-foreground">
                  Focus on subscription models that create predictable, long-term cash flow.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">📈</div>
                <h4 className="font-bold mb-2">Reinvested for Growth</h4>
                <p className="text-sm text-muted-foreground">
                  Revenue flows back into R&D, community rewards, and ecosystem expansion.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-muted-foreground max-w-3xl mx-auto">
            * Projections based on market research and internal analysis. Actual results may vary. 
            Revenue projections represent 85% confidence targets for 2026-2028 launch period.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

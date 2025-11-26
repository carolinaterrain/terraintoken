import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { useState } from "react";
import { DollarSign, Repeat, Zap, TrendingUp } from "lucide-react";
import { revenueStreams, calculateProjectedARR, revenueAllocationFramework } from "@/lib/revenueData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const RevenueStreams = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'recurring' | 'one-off'>('all');
  const projectedARR = calculateProjectedARR();

  const filteredStreams = selectedCategory === 'all' 
    ? revenueStreams 
    : revenueStreams.filter(s => s.category === selectedCategory);

  const priorityColors = {
    high: 'text-chart-3 border-chart-3/30',
    medium: 'text-chart-2 border-chart-2/30',
    low: 'text-muted-foreground border-border'
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-secondary/5 to-background">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Revenue Streams Dashboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Diversified revenue model combining recurring subscriptions, marketplace fees, and strategic one-off opportunities
          </p>

          {/* Projected ARR Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <GlassCard className="p-6 bg-gradient-to-br from-chart-1/10 to-chart-1/5">
              <Repeat className="w-8 h-8 text-chart-1 mx-auto mb-3" />
              <div className="text-3xl font-bold text-chart-1">${(projectedARR.recurring / 1000).toFixed(1)}M</div>
              <div className="text-sm text-muted-foreground mt-1">Recurring ARR</div>
            </GlassCard>
            <GlassCard className="p-6 bg-gradient-to-br from-chart-2/10 to-chart-2/5">
              <Zap className="w-8 h-8 text-chart-2 mx-auto mb-3" />
              <div className="text-3xl font-bold text-chart-2">${(projectedARR.oneOff / 1000).toFixed(1)}M</div>
              <div className="text-sm text-muted-foreground mt-1">One-Off Revenue</div>
            </GlassCard>
            <GlassCard className="p-6 bg-gradient-to-br from-primary/10 to-chart-3/5">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-primary">${(projectedARR.total / 1000).toFixed(1)}M</div>
              <div className="text-sm text-muted-foreground mt-1">Total Projected</div>
            </GlassCard>
          </div>
        </motion.div>

        {/* Revenue Stream Categories */}
        <Tabs defaultValue="all" className="mb-12">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="all" onClick={() => setSelectedCategory('all')}>
              All Streams
            </TabsTrigger>
            <TabsTrigger value="recurring" onClick={() => setSelectedCategory('recurring')}>
              Recurring
            </TabsTrigger>
            <TabsTrigger value="one-off" onClick={() => setSelectedCategory('one-off')}>
              One-Off
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Revenue Stream Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredStreams.map((stream, index) => (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className={`p-6 h-full border-2 ${priorityColors[stream.priority]}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{stream.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      stream.category === 'recurring' 
                        ? 'bg-chart-1/10 text-chart-1 border-chart-1/30' 
                        : 'bg-chart-2/10 text-chart-2 border-chart-2/30'
                    }`}>
                      {stream.category === 'recurring' ? '♻️ Recurring' : '⚡ One-Off'}
                    </span>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full border ${priorityColors[stream.priority]}`}>
                    {stream.priority.toUpperCase()}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{stream.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pricing:</span>
                    <span className="font-semibold">{stream.pricing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Market:</span>
                    <span className="text-xs text-right">{stream.marketSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target:</span>
                    <span className="text-xs text-right">{stream.captureTarget}</span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Projected:</span>
                      <span className="font-bold text-primary">{stream.arrProjection}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    Timeline: {stream.timeline}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Revenue Philosophy */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <GlassCard className="p-8 bg-gradient-to-br from-primary/10 to-chart-2/10">
            <h3 className="text-2xl font-bold text-center mb-6">Revenue Philosophy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <DollarSign className="w-10 h-10 text-chart-3 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Not from Token Sales</h4>
                <p className="text-sm text-muted-foreground">
                  We don't sell tokens to fund development. Revenue comes from building real products people pay for.
                </p>
              </div>
              <div>
                <Repeat className="w-10 h-10 text-chart-2 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Sustainable & Recurring</h4>
                <p className="text-sm text-muted-foreground">
                  Focus on subscription ARR and marketplace fees that scale with adoption, not speculation.
                </p>
              </div>
              <div>
                <TrendingUp className="w-10 h-10 text-primary mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Reinvested for Growth</h4>
                <p className="text-sm text-muted-foreground">
                  Profits flow back into AI training, platform development, and token utility expansion.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};
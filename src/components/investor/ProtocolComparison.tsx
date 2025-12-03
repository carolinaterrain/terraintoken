import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { protocolComparison, trnPositioning, type ProtocolComparison as ProtocolType } from "@/lib/marketData";
import { Database, Cpu, Leaf, Globe, Radio, ArrowRight, Sparkles } from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
  'Data': Database,
  'Compute': Cpu,
  'Climate/ReFi': Leaf,
  'Infrastructure': Globe,
  'Oracle': Radio,
};

const categoryColors: Record<string, string> = {
  'Data': 'bg-chart-1/10 text-chart-1 border-chart-1/30',
  'Compute': 'bg-chart-2/10 text-chart-2 border-chart-2/30',
  'Climate/ReFi': 'bg-chart-3/10 text-chart-3 border-chart-3/30',
  'Infrastructure': 'bg-chart-5/10 text-chart-5 border-chart-5/30',
  'Oracle': 'bg-chart-4/10 text-chart-4 border-chart-4/30',
};

type CategoryFilter = 'All' | ProtocolType['category'];

export const ProtocolComparison = () => {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('All');
  
  const categories: CategoryFilter[] = ['All', 'Data', 'Compute', 'Climate/ReFi', 'Infrastructure', 'Oracle'];
  
  const filteredProtocols = activeFilter === 'All' 
    ? protocolComparison 
    : protocolComparison.filter(p => p.category === activeFilter);

  // Separate TRN from other protocols for highlighting
  const trnProtocol = protocolComparison.find(p => p.name === 'TRN');
  const otherProtocols = filteredProtocols.filter(p => p.name !== 'TRN');

  return (
    <section id="protocol-comparison" className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Strategic Protocol Positioning
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Where TRN Fits in Web3
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            TRN connects the fragmented physical infrastructure stack — the connective tissue between data, compute, climate, and infrastructure protocols.
          </p>
        </motion.div>

        {/* Key Differentiators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {trnPositioning.keyDifferentiators.map((diff, index) => (
            <GlassCard key={diff.title} className="p-4 text-center">
              <h4 className="font-bold text-primary mb-2">{diff.title}</h4>
              <p className="text-sm text-muted-foreground">{diff.description}</p>
            </GlassCard>
          ))}
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => {
            const Icon = category === 'All' ? Sparkles : categoryIcons[category];
            return (
              <Button
                key={category}
                variant={activeFilter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(category)}
                className="gap-2"
              >
                {Icon && <Icon className="w-4 h-4" />}
                {category}
              </Button>
            );
          })}
        </div>

        {/* TRN Highlight Card */}
        {trnProtocol && (activeFilter === 'All' || activeFilter === 'Data') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <GlassCard className="p-6 border-2 border-primary/50 bg-gradient-to-br from-primary/10 to-chart-2/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-primary">{trnProtocol.name}</span>
                    <Badge className={categoryColors[trnProtocol.category]}>
                      {trnProtocol.category}
                    </Badge>
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      You Are Here
                    </Badge>
                  </div>
                  <p className="text-lg font-medium mb-1">{trnProtocol.focus}</p>
                  <p className="text-muted-foreground">{trnProtocol.trnSynergy}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Current FDV</p>
                  <p className="text-2xl font-bold text-chart-3">{trnProtocol.fdv}</p>
                  <p className="text-xs text-muted-foreground">Early opportunity</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Protocol Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherProtocols.map((protocol, index) => {
            const Icon = categoryIcons[protocol.category];
            return (
              <motion.div
                key={protocol.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="p-5 h-full hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
                      <span className="font-bold">{protocol.name}</span>
                    </div>
                    <Badge className={`text-xs ${categoryColors[protocol.category]}`}>
                      {protocol.category}
                    </Badge>
                  </div>
                  
                  <p className="text-sm font-medium text-foreground mb-1">{protocol.focus}</p>
                  <p className="text-xs text-muted-foreground mb-3">Data: {protocol.dataType}</p>
                  
                  <div className="border-t border-border/50 pt-3 mt-auto">
                    <div className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        <span className="text-primary font-medium">TRN Synergy:</span> {protocol.trnSynergy}
                      </p>
                    </div>
                    {protocol.fdv && (
                      <p className="text-xs text-muted-foreground mt-2">
                        FDV: <span className="font-medium">{protocol.fdv}</span>
                      </p>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <GlassCard className="p-8 bg-gradient-to-br from-primary/5 to-chart-3/5">
            <p className="text-xl font-semibold mb-2">{trnPositioning.tagline}</p>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {trnPositioning.uniqueValue}
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

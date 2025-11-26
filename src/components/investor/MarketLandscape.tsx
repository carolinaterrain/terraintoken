import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { TrendingUp, Users, Brain, Target, Zap, CloudRain, ExternalLink } from "lucide-react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { marketSegments, marketOpportunity, competitiveLandscape, adoptionDrivers, marketPositioning } from "@/lib/marketData";
import { DataVerificationBadge } from "./DataVerificationBadge";

const iconMap = {
  Brain,
  Users,
  TrendingDown: TrendingUp,
  Zap,
  CloudRain
};

export const MarketLandscape = () => {
  const growthData = marketSegments.map(s => ({
    name: s.name,
    '2024': s.size2024,
    '2029': s.size2029,
    cagr: s.cagr,
    color: s.color
  }));

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              Market Landscape
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Multi-billion dollar market opportunity at the intersection of AI, terrain intelligence, and Web3
            </p>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
              <DataVerificationBadge 
                status="estimated"
                source="IBISWorld, Grand View Research, Markets & Markets"
                className="text-xs"
              />
              <span>Market data as of 2024</span>
            </div>
          </motion.div>

        {/* Market Size Growth */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            >
              <GlassCard className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-2xl font-bold">Market Growth 2024-2029</h3>
                  <DataVerificationBadge 
                    status="estimated"
                    source="Industry Research Reports"
                  />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                <BarChart data={growthData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 12 }} label={{ value: 'Billion USD', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => `$${value.toFixed(1)}B`}
                  />
                  <Bar dataKey="2024" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="2029" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {marketSegments.map((segment, index) => (
              <GlassCard key={segment.name} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">{segment.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{segment.description}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-muted-foreground">2024: <span className="font-semibold">${segment.size2024}B</span></span>
                      <span className="text-muted-foreground">2029: <span className="font-semibold">${segment.size2029}B</span></span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <TrendingUp className="w-5 h-5 text-chart-3 mb-2" />
                    <span className="text-2xl font-bold text-chart-3">+{segment.cagr}%</span>
                    <span className="text-xs text-muted-foreground">CAGR</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        </div>

        {/* TAM/SAM/SOM Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-2">Market Opportunity Funnel</h3>
              <DataVerificationBadge 
                status="estimated"
                source="TAM/SAM/SOM analysis based on market research"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketOpportunity.map((level, index) => (
              <div
                key={level.label}
                style={{ 
                  transform: `scale(${1 - index * 0.05})`,
                  transformOrigin: 'top'
                }}
              >
                <GlassCard className="p-8 text-center">
                <div className="mb-4">
                  <div className="text-5xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                    ${level.value}B
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {level.percentage}% of TAM
                  </div>
                </div>
                <h4 className="font-bold text-lg mb-2">{level.label}</h4>
                <p className="text-sm text-muted-foreground">{level.description}</p>
              </GlassCard>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Competitive Landscape */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-center mb-8">Competitive Landscape</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {competitiveLandscape.map((comp, index) => (
              <GlassCard key={comp.category} className="p-6">
                <h4 className="font-bold text-lg mb-3 text-primary">{comp.category}</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Competitors</span>
                    <p className="text-sm mt-1">{comp.competitors.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Market Gap</span>
                    <p className="text-sm mt-1 text-yellow-500">{comp.gap}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase">TRN Advantage</span>
                    <p className="text-sm mt-1 text-chart-3 font-semibold">{comp.trnAdvantage}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Adoption Drivers */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-center mb-8">Key Adoption Drivers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adoptionDrivers.map((driver) => {
              const Icon = iconMap[driver.icon as keyof typeof iconMap] || Brain;
              return (
                <GlassCard key={driver.title} className="p-6 hover:scale-105 transition-transform">
                  <Icon className="w-8 h-8 text-primary mb-3" />
                  <div className="text-3xl font-bold text-chart-2 mb-2">{driver.stat}</div>
                  <h4 className="font-semibold mb-2">{driver.title}</h4>
                  <p className="text-sm text-muted-foreground">{driver.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </motion.div>

        {/* Blue Ocean Positioning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GlassCard className="p-8 bg-gradient-to-br from-primary/10 to-chart-2/10">
            <div className="text-center mb-8">
              <Target className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">{marketPositioning.blueOcean.title}</h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {marketPositioning.blueOcean.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="text-center">
                <h4 className="font-bold text-lg mb-2 text-chart-1">🥇 First-Mover Advantage</h4>
                <p className="text-sm text-muted-foreground">{marketPositioning.firstMover.description}</p>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-lg mb-2 text-chart-2">🔄 Network Effects</h4>
                <p className="text-sm text-muted-foreground">{marketPositioning.networkEffects.description}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};
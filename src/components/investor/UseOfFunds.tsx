import { GlassCard } from "@/components/ui/glass-card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { Zap, Code, Database, Handshake, Shield } from "lucide-react";

export const UseOfFunds = () => {
  const allocations = [
    {
      name: "TRN Reward Pool Expansion",
      value: 30,
      icon: Zap,
      color: "hsl(var(--chart-1))",
      description: "Expanding rewards for tool users, holders, and community participation"
    },
    {
      name: "TerrainVision AI Development",
      value: 25,
      icon: Code,
      color: "hsl(var(--chart-2))",
      description: "AI model improvements, new tool development, and accuracy enhancements"
    },
    {
      name: "Marketplace 2026 Build",
      value: 20,
      icon: Database,
      color: "hsl(var(--chart-3))",
      description: "Terrain Data Marketplace infrastructure, dataset acquisition, and platform development"
    },
    {
      name: "Ecosystem Partnerships",
      value: 15,
      icon: Handshake,
      color: "hsl(var(--chart-4))",
      description: "OEM integrations, contractor partnerships, and regional expansion"
    },
    {
      name: "Security & Operations",
      value: 10,
      icon: Shield,
      color: "hsl(var(--chart-5))",
      description: "Code audits, infrastructure, uptime, and regulatory compliance"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Use of Funds
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Strategic allocation focused on sustainable ecosystem growth and long-term utility expansion
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-8">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={allocations}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={(entry) => `${entry.value}%`}
                  >
                    {allocations.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* Breakdown */}
          <div className="space-y-6">
            {allocations.map((allocation, index) => {
              const Icon = allocation.icon;
              return (
                <motion.div
                  key={allocation.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6 hover:scale-105 transition-transform">
                    <div className="flex items-start gap-4">
                      <div 
                        className="p-3 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: allocation.color + '20' }}
                      >
                        <Icon className="w-6 h-6" style={{ color: allocation.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between mb-2">
                          <h3 className="font-semibold">{allocation.name}</h3>
                          <span className="text-2xl font-bold" style={{ color: allocation.color }}>
                            {allocation.value}%
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{allocation.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Transparency Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <GlassCard className="p-8 text-center">
            <h3 className="text-xl font-bold mb-4">On-Chain Transparency</h3>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              All fund movements are tracked on-chain and reported monthly in our transparency reports. 
              Strategic investors receive quarterly detailed financial briefings with utilization metrics 
              and milestone progress updates.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};
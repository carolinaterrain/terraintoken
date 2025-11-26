import { GlassCard } from "@/components/ui/glass-card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { Zap, Code, Database, TrendingUp, Shield } from "lucide-react";

export const UseOfFunds = () => {
  // Updated allocation framework based on strategic analysis (50/10/20/10/10)
  const allocations = [
    {
      name: "Core Operations",
      value: 50,
      icon: Shield,
      color: "hsl(var(--chart-1))",
      description: "Salaries, infrastructure, compute costs, legal, accounting, and day-to-day operations",
      subcategories: ["Team salaries", "Cloud infrastructure", "AI compute", "Legal & compliance"]
    },
    {
      name: "Community Rewards Vault",
      value: 10,
      icon: Zap,
      color: "hsl(var(--chart-2))",
      description: "TRN rewards for data contributors, tool usage proofs, referrals, and community engagement",
      subcategories: ["Data upload rewards", "Tool usage incentives", "Referral bonuses", "Quest rewards"]
    },
    {
      name: "Growth & R&D",
      value: 20,
      icon: Code,
      color: "hsl(var(--chart-3))",
      description: "AI model training, new features, integrations, marketplace build, and marketing campaigns",
      subcategories: ["AI model improvements", "Product development", "Marketplace infrastructure", "Marketing & growth"]
    },
    {
      name: "Strategic Buybacks",
      value: 10,
      icon: TrendingUp,
      color: "hsl(var(--chart-4))",
      description: "Token buyback and burn programs to reduce supply and support long-term token value",
      subcategories: ["Quarterly buybacks", "Burn mechanics", "Liquidity management"]
    },
    {
      name: "Strategic Reserves",
      value: 10,
      icon: Database,
      color: "hsl(var(--chart-5))",
      description: "Emergency fund, opportunistic investments, partnerships, and strategic flexibility",
      subcategories: ["Cash reserves", "Partnership opportunities", "Emergency buffer"]
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
            Revenue Redeployment Framework
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            50% Operations | 10% Rewards | 20% Growth | 10% Buybacks | 10% Strategic Reserves
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Revenue from real products, not token sales. Profits reinvested to grow utility, not speculation.
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
                        <p className="text-sm text-muted-foreground mb-3">{allocation.description}</p>
                        {'subcategories' in allocation && allocation.subcategories && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <ul className="space-y-1">
                              {allocation.subcategories.map((sub: string, i: number) => (
                                <li key={i} className="text-xs text-muted-foreground flex items-start">
                                  <span className="text-chart-3 mr-2">•</span>
                                  {sub}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
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
          <GlassCard className="p-8 bg-gradient-to-br from-primary/10 to-chart-2/10">
            <h3 className="text-xl font-bold mb-4 text-center">Deployment Philosophy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Shield className="w-10 h-10 text-chart-1 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Product-First Revenue</h4>
                <p className="text-sm text-muted-foreground">
                  Revenue from subscriptions, licensing, and marketplace fees—not token sales
                </p>
              </div>
              <div>
                <Code className="w-10 h-10 text-chart-3 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Utility Expansion</h4>
                <p className="text-sm text-muted-foreground">
                  Profits reinvested to improve AI, expand token utilities, and build marketplace
                </p>
              </div>
              <div>
                <TrendingUp className="w-10 h-10 text-chart-4 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">On-Chain Transparency</h4>
                <p className="text-sm text-muted-foreground">
                  Quarterly reports on revenue deployment and milestone progress
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Zap, Crown, ShoppingBag, Coins, Sparkles, Flame } from "lucide-react";

const developments = [
  {
    icon: Zap,
    title: "Energy Economy System",
    status: "LIVE",
    description: "Users purchase energy packs to power AI analyses. 50% of TRN spent is allocated for burn.",
    metrics: [
      "5 Energy: 50 TRN (25 for burn)",
      "15 Energy: 120 TRN (60 for burn)",
      "50 Energy: 350 TRN (175 for burn)"
    ],
    color: "text-yellow-400"
  },
  {
    icon: Crown,
    title: "Premium Subscription Engine",
    status: "LIVE",
    description: "4-tier subscription model with both TRN and Stripe fiat payments. 20% of TRN subscriptions allocated for burn.",
    metrics: [
      "Starter: 100 TRN/month",
      "Pro: 250 TRN/month or $25 fiat",
      "Expert: 500 TRN/month or $45 fiat",
      "Enterprise: 1000 TRN/month or $80 fiat"
    ],
    color: "text-purple-400"
  },
  {
    icon: ShoppingBag,
    title: "P2P Marketplace",
    status: "LIVE",
    description: "Peer-to-peer trading of services, assets, and tools. 5% platform fee with 50% allocated for burn.",
    metrics: [
      "User-created listings",
      "Instant TRN transactions",
      "Burn allocation on sales"
    ],
    color: "text-green-400"
  },
  {
    icon: Sparkles,
    title: "Gamification Layer",
    status: "LIVE",
    description: "Mystery boxes, shop items, and premium effects. All purchases include burn allocation tracking.",
    metrics: [
      "Mystery Boxes with rare rewards",
      "Shop items (badges, effects)",
      "Burn allocation on every purchase"
    ],
    color: "text-pink-400"
  },
  {
    icon: Coins,
    title: "Staking Pools",
    status: "LIVE",
    description: "Multiple staking options with competitive APY. Reduces circulating supply and rewards holders.",
    metrics: [
      "Flexible staking: 5% APY",
      "30-day lock: 12% APY",
      "90-day lock: 25% APY"
    ],
    color: "text-blue-400"
  },
  {
    icon: Flame,
    title: "Real-World Service Redemption",
    status: "LIVE",
    description: "Unique bridge between token utility and actual drainage services. TRN holders unlock discounts on Carolina Terrain work.",
    metrics: [
      "10K TRN: 10% discount",
      "25K TRN: 20% discount",
      "50K TRN: 30% discount"
    ],
    color: "text-orange-400"
  }
];

export function RecentDevelopments() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-green-400">MAJOR DEPLOYMENTS</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Recent Developments
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We've just deployed a complete utility ecosystem with <span className="text-primary font-semibold">burn allocation tracking</span>, 
            real revenue streams, and genuine on-chain utility.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developments.map((dev, index) => (
            <motion.div
              key={dev.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="h-full hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg bg-background/50 ${dev.color}`}>
                    <dev.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{dev.title}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                        {dev.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {dev.description}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 pl-[60px]">
                  {dev.metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">{metric}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <GlassCard className="inline-block px-8 py-6 bg-gradient-to-r from-primary/10 to-purple-500/10">
            <p className="text-lg font-semibold mb-2">
              🔥 All Systems Operational
            </p>
            <p className="text-sm text-muted-foreground">
              These features are deployed, tested, and tracking burn allocations in real-time. On-chain burns execute as volume grows.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}

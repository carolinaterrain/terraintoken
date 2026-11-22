import { motion } from "framer-motion";
import { Users, Database, Lock, Flame, Hash } from "lucide-react";
import { useTokenData } from "@/providers/TokenDataProvider";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";

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

/**
 * On-chain facts only. No price, capitalization, or projections are shown here
 * (compliance: token pages must not present investment-style metrics).
 */
export function LiveTokenStats() {
  const { holderCount, isLoading } = useTokenData();
  const holders = holderCount?.holderCount || 0;

  const statItems = [
    { label: "Holders (live)", value: holders.toLocaleString(), icon: Users, color: "text-amber-500", loading: isLoading },
    { label: "Fixed Supply", value: "1,250,000,000", icon: Database, color: "text-primary", loading: false },
    { label: "Mint Authority", value: "Revoked", icon: Lock, color: "text-terrain-purple", loading: false },
    { label: "LP Tokens", value: "Burned", icon: Flame, color: "text-orange-500", loading: false },
    { label: "Decimals", value: "9", icon: Hash, color: "text-cyan-500", loading: false },
  ];

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
            {stat.loading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <span className="text-lg md:text-xl font-bold font-mono text-foreground">
                {stat.value}
              </span>
            )}
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

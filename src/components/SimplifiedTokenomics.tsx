import { GlassCard } from "@/components/ui/glass-card";
import { Coins, Shield, Rocket, Gift } from "lucide-react";

const keyStats = [
  {
    icon: Coins,
    label: "Supply",
    value: "10.43M TRN",
  },
  {
    icon: Shield,
    label: "Taxes",
    value: "0%",
  },
  {
    icon: Rocket,
    label: "Distribution",
    value: "100% Fair",
  },
  {
    icon: Gift,
    label: "Earn Per Upload",
    value: "10-75 TRN",
  },
];

export const SimplifiedTokenomics = () => {
  return (
    <section className="py-8 px-4">
      <div className="container mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-center">
          <span className="text-primary">Key Numbers</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {keyStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <GlassCard 
                key={index}
                className="p-4 text-center"
              >
                <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="font-display text-lg md:text-xl font-bold text-primary">{stat.value}</p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

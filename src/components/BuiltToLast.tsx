import { GlassCard } from "@/components/ui/glass-card";
import { Shield, Lock, TrendingDown, Users, AlertTriangle } from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "Fixed Supply",
    description: "1 billion TRN total. Mint authority revoked. No inflation, no dilution, ever."
  },
  {
    icon: TrendingDown,
    title: "Micro-Burn Mechanism",
    description: "Platform usage creates sustainable deflation. Supply decreases over time through real activity."
  },
  {
    icon: Shield,
    title: "Treasury Reserves",
    description: "Multi-sig controlled reserves with time-locks. No single point of failure."
  },
  {
    icon: Users,
    title: "Progressive Decentralization",
    description: "Moving toward community governance. Token holders shape platform direction."
  }
];

const BuiltToLast = () => {
  return (
    <section id="built-to-last" className="py-16 px-4 relative overflow-hidden bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto relative max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Built To <span className="text-primary">Last</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Sustainable by design. No Ponzi mechanics. Real utility backing.
          </p>
          <p className="font-body text-sm text-muted-foreground max-w-2xl mx-auto">
            We studied failed token models and built the opposite. TRN rewards come from 
            real contribution—not from new money entering the system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <GlassCard key={index} hover className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="font-body text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Important Disclaimer */}
        <GlassCard className="p-6 border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-display text-lg font-bold text-yellow-500 mb-2">
                Important: What TRN Is NOT
              </h3>
              <ul className="font-body text-sm text-muted-foreground space-y-2">
                <li>• <strong>Not an investment</strong> — TRN is a utility token for platform access</li>
                <li>• <strong>No profit promises</strong> — We don't guarantee price appreciation</li>
                <li>• <strong>No yield</strong> — Rewards come from contribution, not staking interest</li>
                <li>• <strong>Not financial advice</strong> — Always do your own research</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-4 italic">
                TRN powers platform access and sustainability. Value comes from real utility, not speculation.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

export default BuiltToLast;

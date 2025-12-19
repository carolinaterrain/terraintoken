import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import TokenomicsDashboard from "@/components/TokenomicsDashboard";
import { Coins, Shield, Rocket, RefreshCw, Gift } from "lucide-react";
import { useTokenData } from "@/providers/TokenDataProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { DataFreshnessBadge } from "@/components/ui/data-freshness-badge";
import { GlossaryTooltip } from "@/components/ecosystem/GlossaryTooltip";
import { EcosystemImpactCard } from "@/components/ecosystem/EcosystemImpactCard";
import { Link } from "react-router-dom";

const Tokenomics = () => {
  const { supply, isLoading, dataSource } = useTokenData();
  
  const stats = [
  {
    icon: Coins,
    label: "Fixed Supply",
    value: isLoading ? "..." : supply ? `${supply.formatted.total} TRN` : "—",
    description: "No additional minting. What exists is all there will ever be.",
    glossaryKey: null
  },
  {
    icon: Shield,
    label: "No Transaction Taxes",
    value: "0% Fees",
    description: "Transfers have no built-in fees or taxes",
    glossaryKey: null
  },
  {
    icon: Rocket,
    label: "Fair Launch",
    value: "Community Distribution",
    description: "No pre-mine, no insider allocation, no VC deals",
    glossaryKey: null
  },
  {
    icon: Gift,
    label: "Contribution Credits",
    value: "Earn by Contributing",
    description: "Upload terrain data to earn credits. No purchase required.",
    glossaryKey: null
  },
  {
    icon: RefreshCw,
    label: "Utility Focus",
    value: "Service Access",
    description: "Designed for platform utility, not speculation",
    glossaryKey: null
  }
];

  return (
    <section id="tokenomics" className="py-12 px-4 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10"
        style={{ background: "var(--terrain-grid)" }}
      />
      
      <div className="container mx-auto relative">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">Token Structure</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
            Fixed supply. Utility access. Transparent ledger.
          </p>
          <p className="font-body text-sm text-muted-foreground max-w-2xl mx-auto mb-3">
            TRN is designed for <span className="font-semibold">platform utility</span>—service access, data contribution credits, and optional discounts. 
            Value comes from real services, not speculation. <span className="text-destructive font-semibold">TRN is not an investment.</span>
          </p>
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              size="sm"
              className="font-display"
              asChild
            >
              <a href="/whitepaper">
                Read Full Tokenomics in Whitepaper 📄
              </a>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <GlassCard 
                key={index}
                hover
                className="p-6 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <h3 className="font-display text-sm font-semibold text-muted-foreground">{stat.label}</h3>
                  {index === 0 && <DataFreshnessBadge source={dataSource} className="scale-75" />}
                </div>
                {isLoading && index === 0 ? (
                  <Skeleton className="h-8 w-32 mx-auto mb-2" />
                ) : (
                  <p className="font-display text-2xl font-bold mb-2 text-primary">{stat.value}</p>
                )}
                <p className="font-body text-sm text-muted-foreground">{stat.description}</p>
              </GlassCard>
            );
          })}
        </div>

        {/* Ecosystem Impact Card - Compact view */}
        <div className="mt-12 flex justify-center">
          <EcosystemImpactCard variant="compact" className="max-w-md" />
        </div>

        {/* Cross-App Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/transparency">
              View Transparency Hub →
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/market">
              Live Market Data
            </Link>
          </Button>
        </div>

        {/* Interactive Dashboard */}
        <div className="mt-16">
          <TokenomicsDashboard />
        </div>
      </div>
    </section>
  );
};

export default Tokenomics;

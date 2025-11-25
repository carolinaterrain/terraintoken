import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import TokenomicsDashboard from "@/components/TokenomicsDashboard";
import { Coins, Shield, Rocket, RefreshCw, Gift } from "lucide-react";
import { useTokenSupply, formatSupply } from "@/hooks/useTokenSupply";
import { Skeleton } from "@/components/ui/skeleton";

const Tokenomics = () => {
  const { data: supplyData, isLoading } = useTokenSupply();
  
  const stats = [
  {
    icon: Coins,
    label: "Total Supply (Live)",
    value: isLoading ? "..." : supplyData ? `${formatSupply(supplyData.totalSupply, supplyData.decimals)} TRN` : "—",
    description: "No additional minting possible"
  },
  {
    icon: Shield,
    label: "No Taxes",
    value: "0% Fees",
    description: "Pure transfer freedom"
  },
  {
    icon: Rocket,
    label: "Fair Launch",
    value: "100% Community",
    description: "No pre-mine or insider allocation"
  },
  {
    icon: Gift,
    label: "Earn By Contributing",
    value: "Upload & Earn",
    description: "Earn 10-75+ TRN per photo upload on TerrainVision AI. Live NOW. No wallet required to start."
  },
  {
    icon: RefreshCw,
    label: "Upgradeable",
    value: "Future Utility",
    description: "Evolves with ecosystem needs"
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
            <span className="text-primary">Tokenomics</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
            Simple, transparent, and community-first token design
          </p>
          <p className="font-body text-sm text-primary italic max-w-2xl mx-auto mb-3">
            Unlike other meme coins, a portion of ecosystem growth funds REAL terrain projects through Carolina Terrain. 
            Your memes literally pay for French drains. This is the future. 💚
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
                <h3 className="font-display text-sm font-semibold text-muted-foreground mb-2">{stat.label}</h3>
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

        {/* Interactive Dashboard */}
        <div className="mt-16">
          <TokenomicsDashboard />
        </div>
      </div>
    </section>
  );
};

export default Tokenomics;

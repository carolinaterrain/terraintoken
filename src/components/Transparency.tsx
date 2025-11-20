import { GlassCard } from "@/components/ui/glass-card";
import { Shield, CheckCircle, Lock, TrendingUp, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Transparency = () => {
  const { toast } = useToast();
  const contractAddress = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: `${label} Copied!`,
        description: "Address copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please copy manually",
        variant: "destructive",
      });
    }
  };

  const transparencyStats = [
    {
      icon: Shield,
      label: "Contract Address",
      value: contractAddress,
      description: "Verified on Solscan",
      link: `https://solscan.io/token/${contractAddress}`,
      copyable: true,
    },
    {
      icon: TrendingUp,
      label: "Total Supply",
      value: "10,431,918 TRN",
      description: "Fixed supply - no minting",
      copyable: false,
    },
    {
      icon: CheckCircle,
      label: "Dev Holdings",
      value: "~1%",
      description: "Minimal team allocation",
      copyable: false,
    },
    {
      icon: Lock,
      label: "Liquidity Status",
      value: "Community Pool",
      description: "Fair launch on Pump.fun",
      copyable: false,
    },
  ];

  const topHolders = [
    { rank: 1, address: "Pump.fun Bonding Curve", percentage: "~45%", description: "Protocol liquidity pool" },
    { rank: 2, address: "Community Holders", percentage: "~54%", description: "Distributed among holders" },
    { rank: 3, address: "Dev/Team Wallet", percentage: "~1%", description: "Minimal team allocation" },
  ];

  return (
    <section id="transparency" className="py-16 px-4 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-5"
        style={{ background: "var(--terrain-grid)" }}
      />
      
      <div className="container mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              <span className="text-primary">Radical Transparency</span>
            </h2>
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mb-3">
            No secrets, no rug pulls, no BS. Just straight facts from the goblins.
          </p>
          <p className="font-body text-sm text-primary italic max-w-2xl mx-auto">
            Unlike other meme coins that imploded (*cough* BEER *cough*), we're putting everything on the table. 
            This is how you build trust in crypto. 💚
          </p>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {transparencyStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <GlassCard 
                key={index}
                hover
                className="p-6"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-sm font-semibold text-muted-foreground mb-2">
                    {stat.label}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-display text-lg font-bold text-primary break-all">
                      {stat.copyable && stat.value.length > 20 
                        ? `${stat.value.slice(0, 8)}...${stat.value.slice(-8)}`
                        : stat.value}
                    </p>
                    {stat.copyable && (
                      <button
                        onClick={() => copyToClipboard(stat.value, stat.label)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="font-body text-xs text-muted-foreground mb-3">{stat.description}</p>
                  {stat.link && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      asChild
                    >
                      <a
                        href={stat.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        View on Solscan
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Top Holders Breakdown */}
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-8">
            <h3 className="font-display text-2xl font-bold text-center mb-6">
              📊 Top Holdings Breakdown
            </h3>
            <div className="space-y-4">
              {topHolders.map((holder) => (
                <div 
                  key={holder.rank}
                  className="flex items-center justify-between p-4 bg-background/30 rounded-lg border border-primary/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      #{holder.rank}
                    </div>
                    <div>
                      <p className="font-display font-semibold">{holder.address}</p>
                      <p className="text-sm text-muted-foreground">{holder.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl font-bold text-primary">{holder.percentage}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-center text-muted-foreground">
                <strong className="text-primary">🛡️ Transparency Pledge:</strong> We publish monthly reports on wallet holdings, 
                treasury activity, and development progress. No insider dumps, no hidden wallets, no goblin funny business. 
                Just pure, verified facts.
              </p>
            </div>

            <div className="mt-4 text-center">
              <Button
                variant="outline"
                className="font-display"
                asChild
              >
                <a
                  href={`https://solscan.io/token/${contractAddress}#holders`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  View All Holders on Solscan
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* Real-World Backing Callout */}
        <div className="mt-12 max-w-3xl mx-auto">
          <GlassCard className="p-8 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="text-center">
              <h3 className="font-display text-2xl font-bold mb-4">
                💪 Backed by Real Revenue
              </h3>
              <p className="text-muted-foreground mb-4">
                Unlike 99% of meme coins built on speculation alone, TRN is connected to <strong className="text-primary">Carolina Terrain</strong> — 
                a licensed drainage contractor generating <strong className="text-primary">$2M+ in annual revenue</strong> from real projects.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Certifications</p>
                  <p className="font-display text-lg font-bold text-primary">8+ Industry Certs</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Annual Revenue</p>
                  <p className="font-display text-lg font-bold text-primary">$2M+</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Google Reviews</p>
                  <p className="font-display text-lg font-bold text-primary">125+ ⭐⭐⭐⭐⭐</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default Transparency;

import { GlassCard } from "@/components/ui/glass-card";
import { Shield, CheckCircle, Lock, TrendingUp, Copy, ExternalLink, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTokenData } from "@/providers/TokenDataProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { DataFreshnessBadge } from "@/components/ui/data-freshness-badge";
import { TRN_MINT_ADDRESS } from "@/lib/airdropConstants";

const Transparency = () => {
  const { toast } = useToast();
  const { supply, isLoading, dataSource, lastUpdated } = useTokenData();
  const contractAddress = TRN_MINT_ADDRESS;

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
      description: "Fair community launch",
      copyable: false,
    },
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
            Unlike other community tokens that imploded (*cough* BEER *cough*), we're putting everything on the table. 
            This is how you build trust in crypto. 💚
          </p>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Live Total Supply Card */}
          <GlassCard hover className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div className="flex items-center gap-1 mb-2">
                <h3 className="font-display text-sm font-semibold text-muted-foreground">
                  Total Supply
                </h3>
                <DataFreshnessBadge source={dataSource} />
              </div>
              {isLoading ? (
                <Skeleton className="h-7 w-32 mb-2" />
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-display text-lg font-bold text-primary">
                      {supply?.formatted.total || '—'} TRN
                    </p>
                    {dataSource === 'fallback' && (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <p className="font-body text-xs text-muted-foreground mb-3">
                    Fixed supply - mint revoked
                  </p>
                  <Button variant="ghost" size="sm" className="text-xs" asChild>
                    <a
                      href={`https://solscan.io/token/${contractAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      Verify on Solscan
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                  {lastUpdated && (
                    <p className="text-[10px] text-muted-foreground mt-2">
                      Updated: {new Date(lastUpdated).toLocaleTimeString()}
                    </p>
                  )}
                </>
              )}
            </div>
          </GlassCard>

          {/* Static Stats */}
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

        {/* Tied to Real Operations Callout */}
        <div className="mt-12 max-w-3xl mx-auto">
          <GlassCard className="p-8 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="text-center">
              <h3 className="font-display text-2xl font-bold mb-4">
                Tied to Real Operations
              </h3>
              <p className="text-muted-foreground mb-4">
                $TRN is the incentive layer of an ecosystem connected to <strong className="text-primary">Carolina Terrain</strong> —
                a licensed NC drainage contractor with established operations. Business performance does not guarantee token value.
                $TRN is a utility/incentive token, not an investment or security.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Certifications</p>
                  <p className="font-display text-lg font-bold text-primary">8+ Industry Certs</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">License</p>
                  <p className="font-display text-lg font-bold text-primary">NC #CL.1872</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Google Reviews</p>
                  <p className="font-display text-lg font-bold text-primary">125+ ⭐⭐⭐⭐⭐</p>
                </div>
              </div>
              <div className="mt-6">
                <Button asChild>
                  <Link to="/transparency" className="inline-flex items-center gap-2">
                    View Full Transparency Hub
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default Transparency;

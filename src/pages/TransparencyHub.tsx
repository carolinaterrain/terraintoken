import { Helmet } from "react-helmet-async";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToHome from "@/components/BackToHome";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Users, Calendar, ExternalLink, Wallet, BarChart3 } from "lucide-react";
import { useTokenData } from "@/providers/TokenDataProvider";
import { useTreasuryBalance } from "@/hooks/useTreasuryBalance";
import { MonthlyReportViewer } from "@/components/ecosystem/MonthlyReportViewer";
import { PoweredByTerrainVision } from "@/components/ecosystem/PoweredByTerrainVision";
import { ConstraintProof } from "@/components/ecosystem/ConstraintProof";
import { TRN_MINT_ADDRESS } from "@/lib/airdropConstants";

// Data source badge component
const DataBadge = ({ type }: { type: 'live' | 'verified' | 'coming-soon' }) => {
  const badges = {
    'live': { text: '🟢 Live', className: 'text-green-400' },
    'verified': { text: '🔵 Verified', className: 'text-blue-400' },
    'coming-soon': { text: '⚪ Coming Soon', className: 'text-muted-foreground' }
  };
  const badge = badges[type];
  return <div className={`text-xs mt-2 ${badge.className}`}>{badge.text}</div>;
};

const TransparencyHub = () => {
  // Use unified TokenDataProvider for all token data
  const { 
    holderCount: holderData,
    dataSource,
    isLoading: tokenLoading,
  } = useTokenData();
  
  // Treasury balance uses its own hook (separate API call)
  const { treasuryBalance, loading: treasuryLoading, isLive: treasuryIsLive } = useTreasuryBalance();

  const currentHolders = holderData?.holderCount || 0;
  const isLive = dataSource === 'live';

  return (
    <>
      <Helmet>
        <title>Transparency Hub - All Monthly Reports | Terrain Token</title>
        <meta name="description" content="Archive of TRN monthly transparency reports: holder counts, on-chain supply, treasury wallets, and development updates." />
        <link rel="canonical" href="https://terraintoken.com/transparency" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Transparency Hub - All Monthly Reports | Terrain Token" />
        <meta property="og:description" content="Archive of TRN monthly transparency reports: holder counts, on-chain supply, treasury wallets, and development updates." />
        <meta property="og:image" content="https://terraintoken.com/og-terrain.png" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Transparency Hub | Terrain Token" />
        <meta name="twitter:description" content="Complete archive of monthly transparency reports for the Terrain Token ($TRN) ecosystem." />
      </Helmet>

      <ScrollProgress />
      <DesktopNav />

      <main id="main-content" className="min-h-screen bg-background pt-32 pb-20">
        <BackToHome />
        
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <PoweredByTerrainVision showAnalysisCount />
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">
              Transparency <span className="text-primary">Hub</span>
            </h1>
            <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
              Complete archive of TRN's monthly transparency reports. On-chain supply, holder counts, and development updates over time. No secrets, just facts.
            </p>
          </div>

          {/* Live Stats Dashboard */}
          <section className="mb-16">
            <h2 className="font-display text-3xl font-bold mb-8 text-center">
              Live <span className="text-primary">On-Chain Stats</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Holders - LIVE */}
              <GlassCard className="p-6 text-center">
                <Users className="w-10 h-10 text-primary mx-auto mb-3" />
                {tokenLoading ? (
                  <Skeleton className="h-9 w-24 mx-auto mb-2" />
                ) : (
                  <div className="text-3xl font-bold text-primary mb-1">{currentHolders.toLocaleString()}</div>
                )}
                <div className="text-sm text-muted-foreground">Total Holders</div>
                <DataBadge type={isLive ? "live" : "verified"} />
              </GlassCard>

              {/* Total Supply - fixed on-chain */}
              <GlassCard className="p-6 text-center">
                <BarChart3 className="w-10 h-10 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary mb-1">1.25B</div>
                <div className="text-sm text-muted-foreground">Fixed Total Supply</div>
                <DataBadge type="verified" />
              </GlassCard>

              {/* Contract - verify on Solscan */}
              <GlassCard className="p-6 text-center">
                <ExternalLink className="w-10 h-10 text-primary mx-auto mb-3" />
                <a
                  href={`https://solscan.io/token/${TRN_MINT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-primary mb-1 hover:underline block"
                >
                  Verify on Solscan
                </a>
                <div className="text-xs text-muted-foreground font-mono break-all">{TRN_MINT_ADDRESS}</div>
              </GlassCard>

              {/* Treasury TRN Balance - LIVE */}
              <GlassCard className="p-6 text-center">
                <Wallet className="w-10 h-10 text-primary mx-auto mb-3" />
                {treasuryLoading ? (
                  <Skeleton className="h-9 w-24 mx-auto mb-2" />
                ) : (
                  <div className="text-3xl font-bold text-primary mb-1">{treasuryBalance.balanceFormatted}</div>
                )}
                <div className="text-sm text-muted-foreground">Treasury TRN</div>
                <DataBadge type={treasuryIsLive ? "live" : "verified"} />
              </GlassCard>
            </div>
          </section>

          {/* Constraint Proof Dashboard */}
          <ConstraintProof />

          {/* Monthly Reports Archive - Using MonthlyReportViewer */}
          <section className="mb-16">
            <h2 className="font-display text-3xl font-bold mb-8 text-center">
              Monthly <span className="text-primary">Ecosystem Reports</span>
            </h2>
            <MonthlyReportViewer />
            
            {/* Coming Soon */}
            <GlassCard className="p-8 mt-8 text-center bg-card/20">
              <Calendar className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
              <h3 className="font-display text-xl font-bold mb-2">More Reports Coming Soon</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We publish a new transparency report on the 1st of each month. Check back here or follow us on social media to stay updated.
              </p>
            </GlassCard>
          </section>

          {/* Data Sources Legend */}
          <section className="mb-16">
            <GlassCard className="p-6">
              <h3 className="font-display text-lg font-bold mb-4">Data Sources</h3>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-muted-foreground"><strong className="text-green-400">Live</strong> — Real-time blockchain/API data</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-muted-foreground"><strong className="text-blue-400">Verified</strong> — Manually verified, updated monthly</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                  <span className="text-muted-foreground"><strong>Coming Soon</strong> — Feature in development</span>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* Cross-App Navigation */}
          <section className="mb-16">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/proof">
                  View Proof of Work →
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/#tokenomics">
                  Explore Tokenomics
                </Link>
              </Button>
            </div>
          </section>

          {/* Verification Section */}
          <section>
            <GlassCard className="p-8 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/40">
              <h3 className="font-display text-2xl font-bold mb-4 text-center">
                Don't Trust, <span className="text-primary">Verify</span>
              </h3>
              <p className="text-muted-foreground mb-6 text-center max-w-3xl mx-auto">
                All wallet addresses are published in our monthly reports. You can verify every claim we make by checking on-chain data via Solscan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="outline" className="border-primary" asChild>
                  <a href={`https://solscan.io/token/${TRN_MINT_ADDRESS}`} target="_blank" rel="noopener noreferrer">
                    View TRN on Solscan
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button size="lg" asChild>
                  <Link to="/risk-disclosure">
                    Read the Risk Disclosure
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </GlassCard>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default TransparencyHub;

import { Helmet } from "react-helmet-async";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToHome from "@/components/BackToHome";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, Users, DollarSign, Calendar, Download, ExternalLink } from "lucide-react";
import { ContextualWaitlistModal } from "@/components/ContextualWaitlistModal";

const TransparencyHub = () => {
  const reports = [
    {
      month: "November 2025",
      slug: "transparency-report-november-2025",
      holders: 2100,
      revenue: 180000,
      treasury: 620000,
      date: "2025-11-01"
    }
  ];

  const latestReport = reports[0];

  return (
    <>
      <Helmet>
        <title>Transparency Hub - All Monthly Reports | Terrain Token</title>
        <meta name="description" content="Complete archive of TRN monthly transparency reports with holder growth, revenue tracking, treasury balances, and development updates. Full financial transparency." />
        <link rel="canonical" href="https://terraintoken.com/transparency" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Transparency Hub - All Monthly Reports | Terrain Token" />
        <meta property="og:description" content="Complete archive of TRN monthly transparency reports with holder growth, revenue tracking, treasury balances, and development updates." />
        <meta property="og:image" content="https://terraintoken.com/og-terrain.png" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Transparency Hub | Terrain Token" />
        <meta name="twitter:description" content="Complete archive of monthly transparency reports. See how TRN's $2M+ backing translates to real growth." />
      </Helmet>

      <ScrollProgress />
      <DesktopNav />

      <main id="main-content" className="min-h-screen bg-background pt-32 pb-20">
        <BackToHome />
        
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">
              Transparency <span className="text-primary">Hub</span>
            </h1>
            <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
              Complete archive of TRN's monthly transparency reports. Track our growth, revenue, and community metrics over time. No secrets, just facts.
            </p>
          </div>

          {/* Current Stats Dashboard */}
          <section className="mb-16">
            <h2 className="font-display text-3xl font-bold mb-8 text-center">
              Current <span className="text-primary">Stats</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard className="p-8 text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold text-primary mb-2">{latestReport.holders.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Holders</div>
                <div className="text-xs text-green-400 mt-2">Latest: {latestReport.month}</div>
              </GlassCard>

              <GlassCard className="p-8 text-center">
                <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold text-primary mb-2">${(latestReport.revenue / 1000).toFixed(0)}K</div>
                <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                <div className="text-xs text-green-400 mt-2">From real business operations</div>
              </GlassCard>

              <GlassCard className="p-8 text-center">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold text-primary mb-2">${(latestReport.treasury / 1000).toFixed(0)}K</div>
                <div className="text-sm text-muted-foreground">USDC Treasury</div>
                <div className="text-xs text-green-400 mt-2">Backing token value</div>
              </GlassCard>
            </div>
          </section>

          {/* Growth Trends Chart Placeholder */}
          <section className="mb-16">
            <GlassCard className="p-8">
              <h3 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Growth Trends
              </h3>
              <div className="h-64 flex items-center justify-center bg-card/40 rounded-lg border border-primary/20">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">📊 Interactive charts coming soon</p>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    We're building interactive charts to visualize holder growth, revenue trends, and treasury performance over time.
                  </p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex justify-between p-3 bg-card/40 rounded border border-primary/10">
                  <span className="text-muted-foreground">Holder Growth</span>
                  <span className="text-green-400 font-semibold">+50% MoM</span>
                </div>
                <div className="flex justify-between p-3 bg-card/40 rounded border border-primary/10">
                  <span className="text-muted-foreground">Revenue Growth</span>
                  <span className="text-green-400 font-semibold">+12% MoM</span>
                </div>
                <div className="flex justify-between p-3 bg-card/40 rounded border border-primary/10">
                  <span className="text-muted-foreground">Retention Rate</span>
                  <span className="text-green-400 font-semibold">87%</span>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* Monthly Reports Archive */}
          <section className="mb-16">
            <h2 className="font-display text-3xl font-bold mb-8 text-center">
              Monthly <span className="text-primary">Reports</span>
            </h2>
            
            <div className="space-y-6">
              {reports.map((report) => (
                <GlassCard key={report.month} hover className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <h3 className="font-display text-2xl font-bold">{report.month}</h3>
                        <span className="px-3 py-1 bg-green-500/20 rounded-full text-xs font-bold text-green-400">
                          LATEST
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Holders</div>
                          <div className="text-xl font-bold text-primary">{report.holders.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Revenue</div>
                          <div className="text-xl font-bold text-primary">${(report.revenue / 1000).toFixed(0)}K</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Treasury</div>
                          <div className="text-xl font-bold text-primary">${(report.treasury / 1000).toFixed(0)}K</div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        Full breakdown of wallet holdings, treasury activity, community growth, and development updates. Includes all wallet addresses for on-chain verification.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 md:min-w-[200px]">
                      <Button asChild>
                        <Link to={`/blog/${report.slug}`}>
                          Read Full Report
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" className="border-primary" disabled>
                        <Download className="mr-2 h-4 w-4" />
                        Download CSV
                        <span className="ml-2 text-xs">(Soon)</span>
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Coming Soon */}
            <GlassCard className="p-8 mt-8 text-center bg-card/20">
              <Calendar className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
              <h3 className="font-display text-xl font-bold mb-2">More Reports Coming Soon</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We publish a new transparency report on the 1st of each month. Check back here or follow us on social media to stay updated.
              </p>
            </GlassCard>
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
                  <a href="https://solscan.io" target="_blank" rel="noopener noreferrer">
                    View on Solscan
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button size="lg" asChild>
                  <Link to="/blog/why-meme-coins-need-real-world-backing">
                    Why Transparency Matters
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </GlassCard>
          </section>
        </div>
      </main>

      <Footer />
      
      {/* Contextual waitlist prompt after engagement */}
      <ContextualWaitlistModal
        modalType="waitlist-transparency"
        title="Impressed by Our Transparency? 📊"
        description="Join the TerrainScape waitlist and be part of the most transparent meme token project. Early access to earn TRN rewards."
        emoji="💎"
      />
    </>
  );
};

export default TransparencyHub;

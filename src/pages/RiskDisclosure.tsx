import { Helmet } from "react-helmet-async";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToHome from "@/components/BackToHome";
import { GlassCard } from "@/components/ui/glass-card";
import { AlertTriangle, TrendingDown, Shield, AlertCircle } from "lucide-react";

const RiskDisclosure = () => {
  return (
    <>
      <Helmet>
        <title>Risk Disclosure - Important Information | Terrain Token</title>
        <meta name="description" content="Complete risk disclosure for TRN token holders. Understand the speculative nature, volatility, and risks associated with investing in Terrain Token." />
        <link rel="canonical" href="https://terraintoken.com/risk-disclosure" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <ScrollProgress />
      <DesktopNav />

      <main id="main-content" className="min-h-screen bg-background pt-32 pb-20">
        <BackToHome />
        
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              <span className="font-bold text-yellow-500">Required Reading</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              Risk <span className="text-primary">Disclosure</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Before purchasing or holding TRN tokens, you must understand the risks involved. This is not financial advice.
            </p>
          </div>

          {/* Primary Warnings */}
          <section className="mb-12 space-y-6">
            <GlassCard className="p-8 border-yellow-500/40 bg-gradient-to-br from-yellow-500/10 to-orange-500/5">
              <div className="flex items-start gap-4 mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                <div>
                  <h2 className="font-display text-2xl font-bold mb-2">Speculative Meme Token</h2>
                  <p className="text-muted-foreground">
                    TRN is a <strong className="text-foreground">meme token</strong> with speculative value. While backed by a real business (Carolina Terrain LLC), 
                    the token itself is primarily a community-driven digital asset with no guaranteed intrinsic value.
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-8 border-red-500/40 bg-gradient-to-br from-red-500/10 to-red-500/5">
              <div className="flex items-start gap-4 mb-4">
                <TrendingDown className="w-8 h-8 text-red-500 flex-shrink-0" />
                <div>
                  <h2 className="font-display text-2xl font-bold mb-2">High Volatility Risk</h2>
                  <p className="text-muted-foreground">
                    Cryptocurrency and meme tokens are <strong className="text-foreground">extremely volatile</strong>. TRN's price can fluctuate 
                    dramatically in short periods. You could lose <strong className="text-red-400">100% of your investment</strong>.
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-8 border-primary/40">
              <div className="flex items-start gap-4 mb-4">
                <Shield className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h2 className="font-display text-2xl font-bold mb-2">Business Separation</h2>
                  <p className="text-muted-foreground">
                    Carolina Terrain LLC's business performance is <strong className="text-foreground">separate from token value</strong>. 
                    Even if the business grows and generates revenue, there is <strong className="text-foreground">no guarantee</strong> that 
                    TRN token price will increase.
                  </p>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* Detailed Risks */}
          <section className="mb-12">
            <h2 className="font-display text-3xl font-bold mb-6">
              Specific <span className="text-primary">Risks</span>
            </h2>
            
            <div className="space-y-4">
              <GlassCard className="p-6">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  Market Risk
                </h3>
                <p className="text-sm text-muted-foreground">
                  Crypto markets are unpredictable. External factors (regulation, market sentiment, competitor tokens) can drastically affect TRN's value.
                </p>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  Liquidity Risk
                </h3>
                <p className="text-sm text-muted-foreground">
                  You may not be able to sell your TRN tokens quickly or at a favorable price if market liquidity is low.
                </p>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  Technology Risk
                </h3>
                <p className="text-sm text-muted-foreground">
                  Smart contracts, blockchain networks, and exchanges can have bugs, outages, or security vulnerabilities.
                </p>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  Regulatory Risk
                </h3>
                <p className="text-sm text-muted-foreground">
                  Cryptocurrency regulations are evolving. New laws could restrict trading, holding, or using TRN tokens.
                </p>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  No Guarantees
                </h3>
                <p className="text-sm text-muted-foreground">
                  TRN is not a security, investment contract, or financial product. It offers no dividends, voting rights, or ownership claims.
                </p>
              </GlassCard>
            </div>
          </section>

          {/* What We Provide */}
          <section className="mb-12">
            <GlassCard className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/40">
              <h2 className="font-display text-2xl font-bold mb-4">What We <span className="text-primary">Do Provide</span></h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>✅ <strong className="text-foreground">Full Transparency:</strong> Monthly reports on holder count, business revenue, and treasury.</p>
                <p>✅ <strong className="text-foreground">Real Business Backing:</strong> Carolina Terrain LLC is a legitimate drainage company with verifiable operations.</p>
                <p>✅ <strong className="text-foreground">Active Development:</strong> We're building AI-powered terrain analysis and drainage assessment tools.</p>
                <p>✅ <strong className="text-foreground">Engaged Community:</strong> Active Discord and social media presence.</p>
                <p>✅ <strong className="text-foreground">On-Chain Verification:</strong> All wallet addresses and transactions are publicly visible on Solscan.</p>
              </div>
            </GlassCard>
          </section>

          {/* Final Warning */}
          <section>
            <GlassCard className="p-8 border-red-500/40 bg-gradient-to-br from-red-500/10 to-orange-500/5 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold mb-4">
                Only Invest What You Can Afford to <span className="text-red-400">Lose</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                If losing your entire investment would cause financial hardship, <strong className="text-foreground">do not purchase TRN</strong>. 
                This is a high-risk, speculative asset suitable only for those who understand and accept these risks.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/80 rounded-lg border border-border">
                <input type="checkbox" id="acknowledge" className="w-4 h-4" />
                <label htmlFor="acknowledge" className="text-xs text-muted-foreground cursor-pointer">
                  I have read and understand the risks
                </label>
              </div>
            </GlassCard>
          </section>

          {/* Additional Resources */}
          <section className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Questions? Join our community or read our transparency reports.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <a href="/transparency" className="text-primary hover:underline font-medium">
                📊 Transparency Hub
              </a>
              <a href="/whitepaper" className="text-primary hover:underline font-medium">
                📄 Whitepaper
              </a>
              <a href="https://discord.gg/BmUmr2Kx" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                💬 Discord
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default RiskDisclosure;

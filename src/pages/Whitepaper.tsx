import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Shield, Target, Users, TrendingUp, Lock, Coins, BookOpen } from "lucide-react";
import { Helmet } from "react-helmet-async";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToHome from "@/components/BackToHome";

const Whitepaper = () => {
  const sections = [
    {
      icon: FileText,
      title: "Executive Summary",
      description: "Terrain Token blends meme culture with real-world utility, backed by Carolina Terrain LLC—a licensed drainage contractor generating $2M+ annual revenue."
    },
    {
      icon: BookOpen,
      title: "Origin Story",
      description: "Born as a playful experiment from Carolina Terrain's founders, TRN bridges the serious world of stormwater management with community-driven crypto culture."
    },
    {
      icon: Coins,
      title: "Tokenomics",
      description: "Fixed supply of 10,431,918 TRN. 50% DEX liquidity (locked), 25% treasury, 15% community rewards, 10% team (vested over 2 years)."
    },
    {
      icon: Target,
      title: "Vision & Roadmap",
      description: "Phase 1: Genesis (establishing community). Phase 2: Alignment (real-world integration). Phase 3: Expansion (governance & scaling)."
    },
    {
      icon: Shield,
      title: "Transparency",
      description: "No presale, no VC allocations. Mint authority revoked. Multi-sig treasury. Open-book approach with quarterly transparency reports."
    },
    {
      icon: Users,
      title: "Community Governance",
      description: "Community-first decision making through open dialogue. Future DAO evolution planned with token-weighted voting when ready."
    }
  ];

  const keyHighlights = [
    "Meme-Origin, Real-Backed by licensed NC contractor",
    "Solana-Powered (65k TPS, ~400ms blocks, negligible fees)",
    "Fixed Supply with mint authority removed",
    "Fair Launch on Pump.fun (no presale/VC)",
    "Liquidity Locked for community protection",
    "Team tokens vested over 2 years"
  ];

  return (
    <>
      <Helmet>
        <title>Whitepaper | Terrain Token (TRN)</title>
        <meta name="description" content="Read the official Terrain Token whitepaper. Learn about tokenomics, vision, roadmap, and how we're bridging meme culture with real-world drainage expertise." />
      </Helmet>

      <ScrollProgress />
      <DesktopNav />

      <main id="main-content" className="min-h-screen bg-background pt-32 pb-20">
        <BackToHome />
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <FileText className="w-10 h-10 text-primary" />
              <h1 className="font-display text-5xl md:text-6xl font-bold">
                TRN <span className="text-primary">Whitepaper</span>
              </h1>
            </div>
            <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              The complete technical and strategic overview of Terrain Token — from meme origins to meaningful utility.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="font-display font-semibold" asChild>
                <a href="/Terrain_Token_TRN_Whitepaper.pdf" download>
                  <Download className="mr-2 h-5 w-5" />
                  Download PDF Whitepaper
                </a>
              </Button>
              <Button size="lg" variant="outline" className="font-display font-semibold border-primary" asChild>
                <a href="/Terrain_Token_TRN_Whitepaper.pdf" target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-5 w-5" />
                  View in Browser
                </a>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground italic">
              Last Updated: November 2025 | Version 1.0
            </p>
          </div>

          {/* Key Highlights */}
          <div className="mb-16">
            <GlassCard className="p-8">
              <h2 className="font-display text-3xl font-bold mb-6 text-center">
                📋 Key Highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {keyHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-background/30 rounded-lg border border-primary/10">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm font-bold">✓</span>
                    </div>
                    <p className="text-muted-foreground">{highlight}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* What's Inside */}
          <div className="mb-16">
            <h2 className="font-display text-3xl font-bold text-center mb-8">
              📖 What's Inside the Whitepaper
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <GlassCard key={index} hover className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </GlassCard>
                );
              })}
            </div>
          </div>

          {/* Tokenomics Snapshot */}
          <div className="mb-16">
            <GlassCard className="p-8">
              <h2 className="font-display text-3xl font-bold mb-6 text-center">
                💎 Tokenomics Snapshot
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-display text-xl font-semibold mb-4 text-primary">Supply Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-background/30 rounded-lg">
                      <span className="text-muted-foreground">Total Supply:</span>
                      <span className="font-bold text-primary">10,431,918 TRN</span>
                    </div>
                    <div className="flex justify-between p-3 bg-background/30 rounded-lg">
                      <span className="text-muted-foreground">Mint Authority:</span>
                      <span className="font-bold text-primary">Revoked ✓</span>
                    </div>
                    <div className="flex justify-between p-3 bg-background/30 rounded-lg">
                      <span className="text-muted-foreground">Freeze Authority:</span>
                      <span className="font-bold text-primary">None ✓</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold mb-4 text-primary">Distribution</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-background/30 rounded-lg">
                      <span className="text-muted-foreground">DEX Liquidity:</span>
                      <span className="font-bold">50% (Locked)</span>
                    </div>
                    <div className="flex justify-between p-3 bg-background/30 rounded-lg">
                      <span className="text-muted-foreground">Treasury:</span>
                      <span className="font-bold">25% (Multi-sig)</span>
                    </div>
                    <div className="flex justify-between p-3 bg-background/30 rounded-lg">
                      <span className="text-muted-foreground">Community:</span>
                      <span className="font-bold">15%</span>
                    </div>
                    <div className="flex justify-between p-3 bg-background/30 rounded-lg">
                      <span className="text-muted-foreground">Team:</span>
                      <span className="font-bold">10% (Vested)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-center text-muted-foreground">
                  <Lock className="inline w-4 h-4 mr-2 text-primary" />
                  <strong className="text-primary">Security First:</strong> Liquidity locked, team tokens vested over 2 years (12-month cliff + quarterly release). No rug pull possible.
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Roadmap Overview */}
          <div className="mb-16">
            <GlassCard className="p-8">
              <h2 className="font-display text-3xl font-bold mb-6 text-center">
                🗺️ Three-Phase Roadmap
              </h2>
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="font-display text-xl font-bold mb-2">Phase 1: Genesis (2025)</h3>
                  <p className="text-muted-foreground">
                    Establish token, build community, launch social channels, ensure transparency. Deploy fair launch on Pump.fun with locked liquidity.
                  </p>
                </div>
                <div className="border-l-4 border-earth-green pl-6">
                  <h3 className="font-display text-xl font-bold mb-2">Phase 2: Alignment (2026)</h3>
                  <p className="text-muted-foreground">
                    Integrate with Carolina Terrain services, launch Terrain Vision AI beta, explore token-gated perks, grow to thousands of community members.
                  </p>
                </div>
                <div className="border-l-4 border-earth-brown pl-6">
                  <h3 className="font-display text-xl font-bold mb-2">Phase 3: Expansion (2027+)</h3>
                  <p className="text-muted-foreground">
                    Scale utilities, explore DAO governance, pursue strategic partnerships, list on reputable platforms. Long-term sustainable ecosystem.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Mission & Values */}
          <div className="mb-16">
            <GlassCard className="p-8 bg-gradient-to-br from-primary/10 to-primary/5">
              <h2 className="font-display text-3xl font-bold mb-6 text-center">
                🎯 Mission Philosophy
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display font-bold mb-2">Community-First</h3>
                  <p className="text-sm text-muted-foreground">No VC agenda. Grassroots involvement. Your voice matters in every decision.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display font-bold mb-2">No Promises</h3>
                  <p className="text-sm text-muted-foreground">Just possibilities. Under-promise, over-deliver. Experiments, not guarantees.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display font-bold mb-2">Real Values</h3>
                  <p className="text-sm text-muted-foreground">Blending crypto innovation with Carolina Terrain's reliability and environmental stewardship.</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Risk Disclosure */}
          <div className="mb-16">
            <GlassCard className="p-8 border-destructive/30">
              <h2 className="font-display text-2xl font-bold mb-4 text-center">
                ⚠️ Important Risk Disclosures
              </h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• <strong>Market Volatility:</strong> Crypto prices are highly volatile. TRN value could drop sharply or go to zero.</p>
                <p>• <strong>No Investment Advice:</strong> This is not financial advice. TRN is a community token, not an investment vehicle.</p>
                <p>• <strong>Liquidity Risk:</strong> As a micro-cap token, liquidity may be limited. Large trades could impact price significantly.</p>
                <p>• <strong>No Utility Guarantees:</strong> Planned utilities are experimental. No guarantees of implementation or success.</p>
                <p>• <strong>Regulatory Uncertainty:</strong> Crypto regulations are evolving. Future changes may impact the project.</p>
              </div>
              <div className="mt-6 p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                <p className="text-sm text-center font-semibold">
                  Only participate if you understand and accept these risks. Never invest more than you can afford to lose.
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Download CTA */}
          <div className="text-center">
            <GlassCard className="p-12 bg-gradient-to-br from-primary/20 to-primary/5">
              <FileText className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="font-display text-3xl font-bold mb-4">
                Ready to Dive Deeper?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Download the complete 25-page whitepaper for full technical details, tokenomics breakdowns, risk disclosures, and the long-term vision.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="font-display font-semibold" asChild>
                  <a href="/Terrain_Token_TRN_Whitepaper.pdf" download>
                    <Download className="mr-2 h-5 w-5" />
                    Download PDF (2.1 MB)
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="font-display font-semibold border-primary" asChild>
                  <a href="/">
                    Back to Home
                  </a>
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Whitepaper;

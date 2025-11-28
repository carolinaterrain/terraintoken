import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Shield, Target, Users, TrendingUp, Lock, Coins, BookOpen, ExternalLink, Zap, Vote, Flame, Database } from "lucide-react";
import { Helmet } from "react-helmet-async";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToHome from "@/components/BackToHome";
import { useTokenSupply, formatSupply } from "@/hooks/useTokenSupply";
import { Skeleton } from "@/components/ui/skeleton";

const Whitepaper = () => {
  const { data: supplyData, isLoading } = useTokenSupply();
  const contractAddress = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";
  
  const sections = [
    {
      icon: FileText,
      title: "Executive Summary",
      description: "Terrain Token blends meme culture with AI-driven terrain intelligence, backed by Carolina Terrain LLC—a licensed NC drainage contractor with established revenue streams."
    },
    {
      icon: BookOpen,
      title: "Origin Story & Evolution",
      description: "Born as a playful experiment, TRN evolved from meme origins to a utility-powered ecosystem bridging crypto innovation with real-world terrain services."
    },
    {
      icon: Coins,
      title: "Tokenomics",
      description: "Fixed supply with mint authority revoked. Energy/XP system planned for token-to-utility conversion. Vault & Staking for sustainable ecosystem growth."
    },
    {
      icon: Zap,
      title: "Ecosystem Products",
      description: "TerrainVision AI (planned), Telegram Tip Bot (live), community engagement tools, and future AI-powered terrain analysis services."
    },
    {
      icon: Target,
      title: "Four-Phase Roadmap",
      description: "Phase 1: Genesis (2025) → Phase 2: Alignment (2026) → Phase 3: Expansion (2027) → Phase 4: Maturity (2028+)."
    },
    {
      icon: Vote,
      title: "Governance & DAO",
      description: "Multi-sig treasury governance with path to full DAO. Community-driven expansion strategy and token-weighted voting mechanisms."
    },
    {
      icon: Shield,
      title: "Transparency & Security",
      description: "No presale, no VC allocations. Mint authority revoked. Multi-sig treasury. Quarterly transparency reports and open-book approach."
    },
    {
      icon: Users,
      title: "Risks & Challenges",
      description: "Comprehensive risk disclosures including market volatility, regulatory uncertainty, liquidity risks, and technology execution challenges."
    }
  ];

  const keyHighlights = [
    "Meme-Origin, Real-Backed by licensed NC contractor",
    "Solana-Powered (65k TPS, ~400ms blocks, negligible fees)",
    "Fixed Supply with mint authority removed",
    "Fair Launch on Pump.fun (no presale/VC)",
    "Energy/XP System planned for token utility",
    "Liquidity Locked for community protection",
    "Team tokens locked 1 year + quarterly vesting",
    "Telegram Tip Bot live for community rewards"
  ];

  return (
    <>
      <Helmet>
        <title>Whitepaper v2.2 | Terrain Token (TRN)</title>
        <meta name="description" content="Read the official Terrain Token whitepaper v2.2. Learn about tokenomics, AI-powered ecosystem products, 4-phase roadmap, and governance." />
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
            <p className="text-sm text-primary font-semibold mb-2">Version 2.2 — Utility-Powered Terrain Intelligence</p>
            <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              The complete technical and strategic overview of Terrain Token — from meme origins to AI-driven terrain ecosystem.
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
              Last Updated: November 2025 | Version 2.2 | 30 Pages | Supply data is live from blockchain
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <GlassCard key={index} hover className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-bold mb-2">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </GlassCard>
                );
              })}
            </div>
          </div>

          {/* Energy Packs & 50/50 Model - NEW */}
          <div className="mb-16">
            <GlassCard className="p-8 bg-gradient-to-br from-primary/10 to-earth-green/10">
              <h2 className="font-display text-3xl font-bold mb-6 text-center">
                ⚡ Energy Economy & 50/50 Model
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-8 h-8 text-primary" />
                    <h3 className="font-display text-xl font-semibold text-primary">Energy Packs</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Token-to-utility conversion system enabling stable service pricing regardless of market volatility.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Convert TRN to Energy at fixed rates</li>
                    <li>• Spend Energy on ecosystem services</li>
                    <li>• Shields users from price fluctuations</li>
                    <li>• Creates consistent token demand</li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Flame className="w-8 h-8 text-destructive" />
                    <h3 className="font-display text-xl font-semibold text-primary">50/50 Burn & Reinvest</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Sustainable tokenomics model balancing deflation with ecosystem growth.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 50% of spent tokens are burned permanently</li>
                    <li>• 50% flows to Ecosystem Vault</li>
                    <li>• Vault funds development & rewards</li>
                    <li>• Creates long-term sustainability</li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Ecosystem Products - NEW */}
          <div className="mb-16">
            <GlassCard className="p-8">
              <h2 className="font-display text-3xl font-bold mb-6 text-center">
                🛠️ Ecosystem Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-background/30 rounded-lg border border-primary/10">
                  <h4 className="font-display font-bold text-primary mb-2">TerrainVision AI</h4>
                  <p className="text-sm text-muted-foreground">AI-powered drainage analysis from aerial imagery. Instant property assessments.</p>
                </div>
                <div className="p-4 bg-background/30 rounded-lg border border-primary/10">
                  <h4 className="font-display font-bold text-primary mb-2">FlowGuardian</h4>
                  <p className="text-sm text-muted-foreground">IoT sensor monitoring for real-time drainage system health tracking.</p>
                </div>
                <div className="p-4 bg-background/30 rounded-lg border border-primary/10">
                  <h4 className="font-display font-bold text-primary mb-2">Terrain Estimator</h4>
                  <p className="text-sm text-muted-foreground">Instant cost estimates for drainage projects based on property data.</p>
                </div>
                <div className="p-4 bg-background/30 rounded-lg border border-primary/10">
                  <h4 className="font-display font-bold text-primary mb-2">Drainage Academy</h4>
                  <p className="text-sm text-muted-foreground">Educational platform teaching DIY drainage skills with certifications.</p>
                </div>
                <div className="p-4 bg-background/30 rounded-lg border border-primary/10">
                  <h4 className="font-display font-bold text-primary mb-2">Goblin Market</h4>
                  <p className="text-sm text-muted-foreground">P2P marketplace for community services, memes, and digital goods.</p>
                </div>
                <div className="p-4 bg-background/30 rounded-lg border border-primary/10">
                  <h4 className="font-display font-bold text-primary mb-2">Staking & XP</h4>
                  <p className="text-sm text-muted-foreground">Earn non-transferable XP through staking. Unlock rewards and governance power.</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Tokenomics Snapshot */}
          <div className="mb-16">
            <GlassCard className="p-8">
              <h2 className="font-display text-3xl font-bold mb-6 text-center">
                💎 Tokenomics Snapshot
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-display text-xl font-semibold mb-4 text-primary">Supply Details (Live)</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-background/30 rounded-lg">
                      <span className="text-muted-foreground">Total Supply:</span>
                      {isLoading ? (
                        <Skeleton className="h-6 w-32" />
                      ) : (
                        <div className="text-right">
                          <span className="font-bold text-primary">
                            {supplyData ? formatSupply(supplyData.totalSupply, supplyData.decimals) : '—'} TRN
                          </span>
                          <a
                            href={`https://solscan.io/token/${contractAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
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
                  <strong className="text-primary">Security First:</strong> Liquidity locked, team tokens locked for 1 year and vest quarterly thereafter. No rug pull possible.
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Four-Phase Roadmap - UPDATED */}
          <div className="mb-16">
            <GlassCard className="p-8">
              <h2 className="font-display text-3xl font-bold mb-6 text-center">
                🗺️ Four-Phase Roadmap
              </h2>
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="font-display text-xl font-bold mb-2">Phase 1: Genesis (2025)</h3>
                  <p className="text-muted-foreground">
                    Fair launch on Pump.fun, community building, website & social presence, transparency reports, initial ecosystem infrastructure deployment.
                  </p>
                </div>
                <div className="border-l-4 border-earth-green pl-6">
                  <h3 className="font-display text-xl font-bold mb-2">Phase 2: Integration (2026)</h3>
                  <p className="text-muted-foreground">
                    TerrainVision AI launch, Energy Pack system activation, Carolina Terrain service integration, token-gated perks, community growth to 10k+ members.
                  </p>
                </div>
                <div className="border-l-4 border-earth-brown pl-6">
                  <h3 className="font-display text-xl font-bold mb-2">Phase 3: Expansion (2027)</h3>
                  <p className="text-muted-foreground">
                    FlowGuardian IoT launch, Drainage Academy platform, strategic partnerships with contractors, DEX listings, staking pools activation.
                  </p>
                </div>
                <div className="border-l-4 border-primary/60 pl-6">
                  <h3 className="font-display text-xl font-bold mb-2">Phase 4: Enterprise (2028+)</h3>
                  <p className="text-muted-foreground">
                    Enterprise Terrain Intelligence Layer, full DAO governance transition, multi-state contractor network, institutional partnerships, sustainable ecosystem maturity.
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
                <p>• <strong>Technology Risk:</strong> Smart contracts and AI systems may contain bugs or vulnerabilities.</p>
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
                Download the complete 28-page whitepaper v2.0 for full technical details, Energy Pack economics, ecosystem products, and the long-term vision.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="font-display font-semibold" asChild>
                  <a href="/Terrain_Token_TRN_Whitepaper.pdf" download>
                    <Download className="mr-2 h-5 w-5" />
                    Download PDF v2.0
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

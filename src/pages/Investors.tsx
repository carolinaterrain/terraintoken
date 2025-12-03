import { InvestorHero } from "@/components/investor/InvestorHero";
import { EcosystemMetrics } from "@/components/investor/EcosystemMetrics";
import { ValueGeneration } from "@/components/investor/ValueGeneration";
import { InvestmentTiers } from "@/components/investor/InvestmentTiers";
import { ProofSection } from "@/components/investor/ProofSection";
import { InvestorCTA } from "@/components/investor/InvestorCTA";
import { StickyNavigation } from "@/components/investor/StickyNavigation";
import { EarlyStageDisclaimer } from "@/components/investor/EarlyStageDisclaimer";
import { ProtocolComparison } from "@/components/investor/ProtocolComparison";
import { GlassCard } from "@/components/ui/glass-card";
import Roadmap from "@/components/Roadmap";
import { motion } from "framer-motion";
import { TrendingUp, Target, Rocket } from "lucide-react";
import { Helmet } from "react-helmet-async";
import SmartHeader from "@/components/SmartHeader";
import ScrollProgress from "@/components/ScrollProgress";
import SkipToContent from "@/components/SkipToContent";
import { HeyGenAvatar } from "@/components/HeyGenAvatar";

const Investors = () => {
  return (
    <>
      <Helmet>
        <title>TRN Investors - Ground-Truth Oracle for the Physical World</title>
        <meta
          name="description"
          content="TRN powers the Data-Compute-Energy Nexus of Web3. The first ground-truth oracle for terrain intelligence, connecting DePIN, ReFi, and DeSci ecosystems."
        />
        <meta name="keywords" content="TRN investment, terrain token, DePIN, ReFi, DeSci, Web3 infrastructure, ground-truth oracle" />
        <meta property="og:title" content="TRN - The Data-Compute-Energy Nexus of Web3" />
        <meta property="og:description" content="First ground-truth oracle for the physical world. Real terrain data powering AI, compute, and climate infrastructure." />
      </Helmet>

      <SkipToContent />
      <ScrollProgress />
      <SmartHeader />
      <StickyNavigation />
      
      {/* Early Stage Disclaimer Banner */}
      <EarlyStageDisclaimer />

      <main id="main-content" className="min-h-screen">
        {/* 1. Hero */}
        <section id="hero">
          <InvestorHero />
        </section>

        {/* 2. Protocol Comparison - NEW */}
        <ProtocolComparison />

        {/* 3. Why Different */}
        <section id="why-different" className="py-20 px-4 bg-gradient-to-b from-background to-secondary/5">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                Why Terrain Tokens Are Different
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: Target,
                  title: "Most Tokens Launch With",
                  items: ["Nothing behind them", "No real products", "Pure speculation", "Empty roadmaps"]
                },
                {
                  icon: Rocket,
                  title: "TRN Launches With",
                  items: [
                    "Working AI platform (TerrainVision)",
                    "Live rewards system",
                    "Tools used across NC/SC",
                    "Data-backed models",
                    "2026 Marketplace roadmap",
                    "Real demand"
                  ],
                  highlight: true
                },
                {
                  icon: TrendingUp,
                  title: "The Opportunity",
                  items: [
                    "Multi-billion dollar gap in AI",
                    "First terrain-data ecosystem",
                    "Category leadership position",
                    "Real-world utility driving adoption"
                  ]
                }
              ].map((column, index) => {
                const Icon = column.icon;
                return (
                  <motion.div
                    key={column.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard 
                      className={`p-6 h-full ${column.highlight ? 'border-primary/40 shadow-xl' : ''}`}
                    >
                      <Icon className={`w-8 h-8 ${column.highlight ? 'text-primary' : 'text-muted-foreground'} mb-4`} />
                      <h3 className="text-lg font-bold mb-4">{column.title}</h3>
                      <ul className="space-y-2">
                        {column.items.map((item, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start">
                            <span className={`mr-2 ${column.highlight ? 'text-chart-3' : 'text-muted-foreground'}`}>
                              {column.highlight ? '✓' : '×'}
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8 text-center bg-gradient-to-br from-primary/10 to-chart-2/10">
                <p className="text-xl font-semibold leading-relaxed">
                  Terrain intelligence is a multi-billion-dollar gap in AI.
                  <br />
                  <span className="text-primary">TRN is the first token anchored to a real terrain-data ecosystem.</span>
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* 4. Live Metrics */}
        <section id="ecosystem-metrics">
          <EcosystemMetrics />
        </section>

        {/* 5. Value Engine */}
        <section id="value-generation">
          <ValueGeneration />
        </section>

        {/* 6. Investment Tiers */}
        <section id="investment-tiers">
          <InvestmentTiers />
        </section>

        {/* 7. Roadmap */}
        <section id="roadmap" className="py-20">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                Ecosystem Roadmap
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From utility foundation to terrain intelligence network
              </p>
            </motion.div>
            <Roadmap />
          </div>
        </section>

        {/* 8. Trust & Proof */}
        <section id="proof-section">
          <ProofSection />
        </section>

        {/* 9. Take Action (CTA) */}
        <section id="investor-cta">
          <InvestorCTA />
        </section>

        {/* Compliance Footer */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <GlassCard className="p-8 text-center">
              <h3 className="text-lg font-semibold mb-4">Important Disclosure</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                TRN is a utility token designed to power the terrain intelligence ecosystem. This page does not constitute 
                an offer of securities or financial guarantees. Strategic allocations require NDA, KYC/AML verification, 
                and compliance with applicable regulations in your jurisdiction. Past performance and current metrics 
                do not guarantee future results. Cryptocurrency investments carry inherent risks including total loss of capital. 
                Please consult with qualified financial and legal advisors before making investment decisions.
              </p>
            </GlassCard>
          </div>
        </section>
      </main>

      {/* AI Avatar Assistant */}
      <HeyGenAvatar enabled={true} />
    </>
  );
};

export default Investors;

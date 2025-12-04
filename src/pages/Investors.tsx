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
import { Helmet } from "react-helmet-async";
import SmartHeader from "@/components/SmartHeader";
import ScrollProgress from "@/components/ScrollProgress";
import SkipToContent from "@/components/SkipToContent";

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

        {/* 2. Protocol Comparison */}
        <ProtocolComparison />

        {/* 3. Live Metrics */}
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
    </>
  );
};

export default Investors;

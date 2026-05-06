import { InvestorHero } from "@/components/investor/InvestorHero";
import { BusinessCredentials } from "@/components/investor/BusinessCredentials";
import { EcosystemMetrics } from "@/components/investor/EcosystemMetrics";
import { ValueGeneration } from "@/components/investor/ValueGeneration";
import { InvestmentTiers } from "@/components/investor/InvestmentTiers";
import { ProofSection } from "@/components/investor/ProofSection";
import { InvestorCTA } from "@/components/investor/InvestorCTA";
import { InvestorInterestForm } from "@/components/investor/InvestorInterestForm";
import { StickyNavigation } from "@/components/investor/StickyNavigation";
import { EarlyStageDisclaimer } from "@/components/investor/EarlyStageDisclaimer";
import { GlassCard } from "@/components/ui/glass-card";
import WhatsLiveToday from "@/components/WhatsLiveToday";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import SmartHeader from "@/components/SmartHeader";
import ScrollProgress from "@/components/ScrollProgress";
import SkipToContent from "@/components/SkipToContent";
import Footer from "@/components/Footer";
import { SocialShareButtons } from "@/components/SocialShareButtons";

const Investors = () => {
  return (
    <>
      <Helmet>
        <title>TRN Investors - Utility Token Backed by Real Operations</title>
        <meta
          name="description"
          content="TRN is powered by Carolina Terrain LLC — a licensed NC drainage contractor with $2M+ annual revenue. Real business backing, not just promises."
        />
        <meta name="keywords" content="TRN investment, terrain token, real utility, licensed contractor, Carolina Terrain" />
        <meta property="og:title" content="TRN - Real Contractors. Real Revenue. Real Token." />
        <meta property="og:description" content="Utility token backed by Carolina Terrain LLC — licensed NC contractor with $2M+ revenue, real equipment, and verifiable credentials." />
      </Helmet>

      <SkipToContent />
      <ScrollProgress />
      <SmartHeader />
      <StickyNavigation />
      
      {/* Early Stage Disclaimer Banner */}
      <EarlyStageDisclaimer />

      <main id="main-content" className="min-h-screen">
        {/* 1. Hero - Now business-focused */}
        <section id="hero">
          <InvestorHero />
        </section>

        {/* 2. Business Credentials - NEW - Lead with real credentials */}
        <BusinessCredentials />

        {/* 3. Live Metrics */}
        <section id="ecosystem-metrics">
          <EcosystemMetrics />
        </section>

        {/* 4. Value Engine */}
        <section id="value-generation">
          <ValueGeneration />
        </section>

        {/* 5. Investment Tiers */}
        <section id="investment-tiers">
          <InvestmentTiers />
        </section>

        {/* 6. Current Operational Status */}
        <section id="roadmap">
          <WhatsLiveToday />
        </section>

        {/* 7. Trust & Proof */}
        <section id="proof-section">
          <ProofSection />
        </section>

        {/* 8. Take Action (CTA) */}
        <section id="investor-cta">
          <InvestorCTA />
        </section>

        {/* 9. Investor Interest Form */}
        <InvestorInterestForm />

        {/* Social Share Section */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <p className="text-muted-foreground mb-4">Know someone who should see this?</p>
            <div className="flex justify-center">
              <SocialShareButtons 
                title="TRN - Real Contractors. Real Revenue. Real Token."
                description="Utility token backed by Carolina Terrain LLC — licensed NC contractor with $2M+ revenue, real equipment, and verifiable credentials."
              />
            </div>
          </div>
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

      <Footer />
    </>
  );
};

export default Investors;

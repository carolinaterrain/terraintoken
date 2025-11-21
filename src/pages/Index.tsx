import { Helmet } from "react-helmet-async";
import { lazy, Suspense } from "react";
import Hero from "@/components/Hero";
import HowToBuy from "@/components/HowToBuy";
import SkipToContent from "@/components/SkipToContent";
import SmartHeader from "@/components/SmartHeader";
import ScrollProgress from "@/components/ScrollProgress";
import AccessibilityMenu from "@/components/AccessibilityMenu";
import GoblinWisdom from "@/components/GoblinWisdom";
import AnalyzeToEarnHero from "@/components/AnalyzeToEarnHero";
import { CommunityBuzz } from "@/components/CommunityBuzz";
import { SocialProofWall } from "@/components/SocialProofWall";
import { VibeCheck } from "@/components/VibeCheck";
import { OrganicDiscoveryCounter } from "@/components/OrganicDiscoveryCounter";
import { AntiRugMeter } from "@/components/AntiRugMeter";
import { QuickStartGuide } from "@/components/QuickStartGuide";
import { spacing } from "@/lib/spacing";

// Lazy load below-fold components for performance
const About = lazy(() => import("@/components/About"));
const Roadmap = lazy(() => import("@/components/Roadmap"));
const Tokenomics = lazy(() => import("@/components/Tokenomics"));
const Community = lazy(() => import("@/components/Community"));
const FAQ = lazy(() => import("@/components/FAQ"));
const Footer = lazy(() => import("@/components/Footer"));
const MascotLore = lazy(() => import("@/components/MascotLore"));
const RealWorldRoots = lazy(() => import("@/components/RealWorldRoots"));
const MemeGenerator = lazy(() => import("@/components/MemeGenerator"));
const MemeFeed = lazy(() => import("@/components/MemeFeed"));
const MemeHallOfFame = lazy(() => import("@/components/MemeHallOfFame"));
const ContestRules = lazy(() => import("@/components/ContestRules"));
const Founders = lazy(() => import("@/components/Founders"));
const Transparency = lazy(() => import("@/components/Transparency"));
const Vision = lazy(() => import("@/components/Vision"));
const OriginStory = lazy(() => import("@/components/OriginStory"));
const LiveProof = lazy(() => import("@/components/LiveProof"));
const CompetitiveEdge = lazy(() => import("@/components/CompetitiveEdge"));
const EcosystemFlow = lazy(() => import("@/components/EcosystemFlow"));
const VideoUpdatesHub = lazy(() => import("@/components/VideoUpdatesHub").then(module => ({ default: module.VideoUpdatesHub })));
const ByTheNumbers = lazy(() => import("@/components/ByTheNumbers"));

// Loading component
const LoadingSection = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Terrain Token (TRN) - Real-World Utility Token for Stormwater Intelligence</title>
        <meta 
          name="description" 
          content="Terrain Token (TRN) powers the Carolina Terrain ecosystem - $2M+ annual revenue drainage business, Terrain Vision AI, and FlowGuardian stormwater intelligence." 
        />
        <meta property="og:title" content="Terrain Token (TRN) - Real-World Utility Token" />
        <meta property="og:description" content="Backed by real revenue and real-world utility in stormwater intelligence." />
        <meta property="og:image" content="https://terrainvision-ai.com/og-terrain.png" />
        <meta property="og:url" content="https://terrainvision-ai.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@carolinaterrain" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
      <SkipToContent />
      <ScrollProgress />
      <SmartHeader />
      <AccessibilityMenu />
        <GoblinWisdom />

        <main id="main-content" className="relative z-10 mt-[var(--banner-height,0)]" style={{ "--banner-height": "0px" } as React.CSSProperties}>
          {/* Group 1: Introduction - Above fold, no lazy loading */}
          <div className="bg-background">
            <Hero />
            <QuickStartGuide />
            <CommunityBuzz />
            <AnalyzeToEarnHero />
            <div className={spacing.section.standard}>
              <HowToBuy />
            </div>
          </div>

          {/* Group 2: Social Proof & Trust */}
          <SocialProofWall />
          
          <div className="bg-background">
            <div className="container px-4 md:px-6 py-12 md:py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <VibeCheck />
                <OrganicDiscoveryCounter />
                <AntiRugMeter />
              </div>
            </div>
          </div>

          {/* Group 3: Value Proposition - Lazy loaded */}
          <Suspense fallback={<LoadingSection />}>
            <div className="bg-gradient-to-b from-background to-background/50">
              <div className={spacing.section.major}>
                <About />
              </div>
              <div className={spacing.section.compact}>
                <MascotLore />
              </div>
              <div className={spacing.section.compact}>
                <RealWorldRoots />
              </div>
              <div className={spacing.section.standard}>
                <OriginStory />
              </div>
              <div className={spacing.section.standard}>
                <Founders />
              </div>
            </div>
          </Suspense>

          {/* Group 4: Mechanics - Lazy loaded */}
          <Suspense fallback={<LoadingSection />}>
            <div className="bg-background">
              <div className={spacing.section.major}>
                <CompetitiveEdge />
              </div>
              <div className={spacing.section.compact}>
                <EcosystemFlow />
              </div>
              <div className={spacing.section.major}>
                <Roadmap />
              </div>
            </div>
          </Suspense>

          {/* Group 5: Details - Lazy loaded */}
          <Suspense fallback={<LoadingSection />}>
            <div className="bg-gradient-to-b from-background/50 to-background">
              <div className={spacing.section.major}>
                <Tokenomics />
              </div>
              <div className={spacing.section.standard}>
                <Transparency />
              </div>
              <div className={spacing.section.standard}>
                <ByTheNumbers />
              </div>
              <div className={spacing.section.standard}>
                <LiveProof />
              </div>
            </div>
          </Suspense>

          {/* Group 6: Media - Lazy loaded */}
          <Suspense fallback={<LoadingSection />}>
            <div className="bg-background" id="video-updates">
              <div className={spacing.section.major}>
                <VideoUpdatesHub limit={6} showViewAll={true} />
              </div>
              <div className={spacing.section.standard}>
                <Vision />
              </div>
            </div>
          </Suspense>

          {/* Group 7: Engagement - Lazy loaded */}
          <Suspense fallback={<LoadingSection />}>
            <div className="bg-gradient-to-b from-background to-background/50" id="contest">
              <div className={spacing.section.major}>
                <MemeGenerator />
              </div>
              <div className={spacing.section.compact}>
                <MemeHallOfFame />
              </div>
              <div className={spacing.section.compact}>
                <MemeFeed />
              </div>
              <div className={spacing.section.standard}>
                <ContestRules />
              </div>
              <div className={spacing.section.major}>
                <Community />
              </div>
              <div className={spacing.section.major}>
                <FAQ />
              </div>
            </div>
          </Suspense>
        </main>

        <Suspense fallback={<LoadingSection />}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default Index;

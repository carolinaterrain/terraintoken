import { Helmet } from "react-helmet-async";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Roadmap from "@/components/Roadmap";
import Tokenomics from "@/components/Tokenomics";
import Community from "@/components/Community";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import HowToBuy from "@/components/HowToBuy";
import MascotLore from "@/components/MascotLore";
import RealWorldRoots from "@/components/RealWorldRoots";
import MemeGenerator from "@/components/MemeGenerator";
import MemeFeed from "@/components/MemeFeed";
import MemeHallOfFame from "@/components/MemeHallOfFame";
import ContestRules from "@/components/ContestRules";
import Founders from "@/components/Founders";
import Transparency from "@/components/Transparency";
import Vision from "@/components/Vision";
import OriginStory from "@/components/OriginStory";
import SkipToContent from "@/components/SkipToContent";
import SmartHeader from "@/components/SmartHeader";
import ScrollProgress from "@/components/ScrollProgress";
import LiveProof from "@/components/LiveProof";
import CompetitiveEdge from "@/components/CompetitiveEdge";
import EcosystemFlow from "@/components/EcosystemFlow";
import { VideoUpdatesHub } from "@/components/VideoUpdatesHub";
import AccessibilityMenu from "@/components/AccessibilityMenu";
import GoblinWisdom from "@/components/GoblinWisdom";
import AnalyzeToEarnHero from "@/components/AnalyzeToEarnHero";
import { CommunityBuzz } from "@/components/CommunityBuzz";
import { SocialProofWall } from "@/components/SocialProofWall";
import { VibeCheck } from "@/components/VibeCheck";
import { OrganicDiscoveryCounter } from "@/components/OrganicDiscoveryCounter";
import { AntiRugMeter } from "@/components/AntiRugMeter";
import { spacing } from "@/lib/spacing";

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

        <main id="main-content" className="relative z-10">
          {/* Group 1: Introduction */}
          <div className="bg-background">
            <Hero />
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

          {/* Group 3: Value Proposition */}
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

          {/* Group 4: Mechanics */}
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

          {/* Group 5: Details */}
          <div className="bg-gradient-to-b from-background/50 to-background">
            <div className={spacing.section.major}>
              <Tokenomics />
            </div>
            <div className={spacing.section.standard}>
              <Transparency />
            </div>
            <div className={spacing.section.standard}>
              <LiveProof />
            </div>
          </div>

          {/* Group 6: Media */}
          <div className="bg-background" id="video-updates">
            <div className={spacing.section.major}>
              <VideoUpdatesHub limit={6} showViewAll={true} />
            </div>
            <div className={spacing.section.standard}>
              <Vision />
            </div>
          </div>

          {/* Group 7: Engagement */}
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
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;

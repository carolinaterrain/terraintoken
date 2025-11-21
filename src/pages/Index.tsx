import { Helmet } from "react-helmet-async";
import Hero from "@/components/Hero";
import TokenStats from "@/components/TokenStats";
import HowToBuy from "@/components/HowToBuy";
import About from "@/components/About";
import Roadmap from "@/components/Roadmap";
import Tokenomics from "@/components/Tokenomics";
import Vision from "@/components/Vision";
import RealWorldRoots from "@/components/RealWorldRoots";
import Founders from "@/components/Founders";
import CompetitiveEdge from "@/components/CompetitiveEdge";
import MemeGenerator from "@/components/MemeGenerator";
import MemeHallOfFame from "@/components/MemeHallOfFame";
import MemeFeed from "@/components/MemeFeed";
import ContestRules from "@/components/ContestRules";
import Community from "@/components/Community";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import GoblinWisdom from "@/components/GoblinWisdom";
import SoundToggle from "@/components/SoundToggle";
import GoblinAudioPlayer from "@/components/GoblinAudioPlayer";
import MascotLore from "@/components/MascotLore";
import DesktopNav from "@/components/DesktopNav";
import ScrollProgress from "@/components/ScrollProgress";
import AccessibilityMenu from "@/components/AccessibilityMenu";
import SkipToContent from "@/components/SkipToContent";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import AnalyzeToEarnHero from "@/components/AnalyzeToEarnHero";
import EcosystemFlow from "@/components/EcosystemFlow";
import LiveProof from "@/components/LiveProof";
import Transparency from "@/components/Transparency";

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
        <AnnouncementBanner />
        <ScrollProgress />
        <DesktopNav />
        <main id="main-content">
          <Hero />
          <AnalyzeToEarnHero />
      <TokenStats />
      <HowToBuy />
      <About />
      <MascotLore />
      <RealWorldRoots />
      <Founders />
      <CompetitiveEdge />
      <EcosystemFlow />
      <Roadmap />
      <Tokenomics />
      <Transparency />
      <LiveProof />
      <Vision />
      <div id="contest">
        <MemeGenerator />
        <MemeHallOfFame />
        <MemeFeed />
        <ContestRules />
      </div>
      <Community />
      <FAQ />
        <Footer />
        </main>
        <GoblinWisdom />
        <SoundToggle />
        <GoblinAudioPlayer />
        <AccessibilityMenu />
      </div>
    </>
  );
};

export default Index;

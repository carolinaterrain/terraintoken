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
  );
};

export default Index;

import Hero from "@/components/Hero";
import TokenStats from "@/components/TokenStats";
import HowToBuy from "@/components/HowToBuy";
import About from "@/components/About";
import Roadmap from "@/components/Roadmap";
import Tokenomics from "@/components/Tokenomics";
import Vision from "@/components/Vision";
import RealWorldRoots from "@/components/RealWorldRoots";
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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <TokenStats />
      <HowToBuy />
      <About />
      <RealWorldRoots />
      <CompetitiveEdge />
      <Roadmap />
      <Tokenomics />
      <Vision />
      <MemeGenerator />
      <MemeHallOfFame />
      <MemeFeed />
      <ContestRules />
      <Community />
      <FAQ />
      <Footer />
      <GoblinWisdom />
      <SoundToggle />
    </div>
  );
};

export default Index;

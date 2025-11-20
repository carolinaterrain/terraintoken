import Hero from "@/components/Hero";
import About from "@/components/About";
import Roadmap from "@/components/Roadmap";
import Tokenomics from "@/components/Tokenomics";
import Vision from "@/components/Vision";
import MemeHallOfFame from "@/components/MemeHallOfFame";
import ContestRules from "@/components/ContestRules";
import Community from "@/components/Community";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <About />
      <Roadmap />
      <Tokenomics />
      <Vision />
      <MemeHallOfFame />
      <ContestRules />
      <Community />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;

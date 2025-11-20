import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import trnCoin from "@/assets/trn-coin.png";
import heroBackground from "@/assets/hero-terrain-grid.jpg";

const Hero = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      
      <div className="container relative z-10 px-4 py-20 text-center">
        <div className="flex justify-center mb-8 animate-float">
          <img 
            src={trnCoin} 
            alt="Terrain Token" 
            className="w-32 h-32 md:w-48 md:h-48 drop-shadow-[0_0_50px_hsl(var(--terrain-glow)/0.6)]"
          />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-terrain-glow to-foreground bg-clip-text text-transparent">
          Terrain Token
        </h1>
        
        <p className="text-xl md:text-2xl mb-4 text-muted-foreground font-medium">
          <span className="text-primary">TRN</span>
        </p>
        
        <p className="text-lg md:text-xl mb-12 text-muted-foreground max-w-2xl mx-auto">
          Born from the ground down — memeing today, powering terrain intelligence tomorrow.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="hero" 
            size="lg"
            className="text-lg"
            asChild
          >
            <a href="https://pump.fun/coin/2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump" target="_blank" rel="noopener noreferrer">
              Buy TRN <ArrowRight className="ml-2" />
            </a>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="text-lg border-primary/50 hover:border-primary"
            asChild
          >
            <a href="#roadmap">
              View Roadmap
            </a>
          </Button>
        </div>
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;

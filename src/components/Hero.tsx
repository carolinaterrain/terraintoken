import { Button } from "@/components/ui/button";
import { ArrowRight, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import Countdown from "./Countdown";
import ContractVerificationBadge from "./ContractVerificationBadge";
import terrainMascot from "@/assets/terrain-mascot.png";
import trnCoin from "@/assets/trn-coin.png";
import heroBackground from "@/assets/hero-terrain-grid.jpg";

const Hero = () => {
  const { toast } = useToast();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [goblinPhrase, setGoblinPhrase] = useState("");
  const contractAddress = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";
  
  const goblinPhrases = [
    "Ready to erode? 🌱",
    "Drainage awaits! ⛏️",
    "Buy the dip... literally! 📉",
    "HODL like roots grip earth! 🌿",
    "Paper hands cause erosion! 💎",
  ];
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const parallaxX = (mousePosition.x - window.innerWidth / 2) / 50;
  const parallaxY = (mousePosition.y - window.innerHeight / 2) / 50;
  
  const handleGoblinClick = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00C46A', '#06FF8C', '#22c55e']
    });
  };
  
  const handleGoblinHover = () => {
    const randomPhrase = goblinPhrases[Math.floor(Math.random() * goblinPhrases.length)];
    setGoblinPhrase(randomPhrase);
    setShowSpeechBubble(true);
    setTimeout(() => setShowSpeechBubble(false), 3000);
  };
  
  const copyContractAddress = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      toast({
        title: "Contract Address Copied!",
        description: "Address copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please copy manually",
        variant: "destructive",
      });
    }
  };
  
  return (
    <section 
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Layers - Edge to Edge */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20 animate-grid-shift"
          style={{ background: "var(--terrain-grid)" }}
        />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translate(${parallaxX * 0.5}px, ${parallaxY * 0.5}px)`,
          }}
        />
        <div 
          className="absolute inset-0"
          style={{ background: "var(--gradient-dark)" }}
        />
      </div>

      {/* Content - 50/50 Split Layout */}
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10 h-full mt-14 md:mt-0">
        
        {/* LEFT SIDE - TRN Coin with Glow */}
        <div className="flex items-center justify-center relative order-2 md:order-1">
          <div 
            className="relative"
            style={{
              transform: `translate(${parallaxX}px, ${parallaxY}px)`,
            }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 blur-3xl bg-primary/30 animate-glow-pulse" />
            
            {/* Spinning Coin */}
            <img
              src={trnCoin}
              alt="TRN Coin"
              className="relative w-72 md:w-96 h-72 md:h-96 object-contain animate-float hover:rotate-[5deg] transition-transform duration-300 cursor-pointer"
            />
          </div>
        </div>

        {/* RIGHT SIDE - Goblin + Content Stack */}
        <div className="flex flex-col items-start justify-center gap-6 text-left order-1 md:order-2">
          {/* Goblin Mascot with Blink */}
          <div className="relative">
            <img
              src={terrainMascot}
              alt="Terrain Goblin"
              className="w-24 h-24 md:w-32 md:h-32 animate-blink cursor-pointer"
              onClick={handleGoblinClick}
              onMouseEnter={handleGoblinHover}
            />
            
            {/* Speech Bubble */}
            {showSpeechBubble && (
              <div className="absolute -top-12 left-20 bg-card border border-primary rounded-lg px-3 py-2 text-sm whitespace-nowrap animate-fade-in-up shadow-glow">
                {goblinPhrase}
              </div>
            )}
          </div>

          {/* Main Title */}
          <div>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-2 leading-tight">
              TERRAIN <span className="text-primary">TOKEN</span>
            </h1>
            <p className="font-display text-xl md:text-2xl text-muted-foreground">
              Born From The Ground Down
            </p>
          </div>

          {/* Subtitle Tagline */}
          <p className="font-body text-base md:text-lg text-muted-foreground max-w-lg">
            The first meme coin backed by NDS-certified drainage contractors. Memeing today, powering terrain intelligence tomorrow.
          </p>

          {/* Contract Address with Copy + Verification */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <button
              onClick={copyContractAddress}
              className="flex items-center gap-2 px-4 py-2 bg-card/50 border border-primary/20 rounded-lg hover:border-primary/40 transition-all group w-full md:w-auto"
            >
              <span className="font-mono text-xs text-foreground/80 truncate">
                {contractAddress}
              </span>
              <Copy className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </button>
            <ContractVerificationBadge />
          </div>

          {/* Perfect Button Stack - Same Width, Aligned */}
          <div className="flex flex-col w-full md:w-auto gap-3 mt-2">
            <Button
              variant="default"
              size="lg"
              className="font-display font-semibold w-full md:w-64 animate-glow-pulse"
              asChild
            >
              <a
                href="https://pump.fun/coin/2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mint on Pump.fun
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="font-display font-semibold w-full md:w-64 border-primary/30 hover:border-primary"
              asChild
            >
              <a
                href="https://t.me/terraintoken"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Telegram
              </a>
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="font-display font-semibold w-full md:w-64 hover:bg-primary/10"
              onClick={() => document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Roadmap
            </Button>
          </div>

          {/* Countdown Timer */}
          <div className="mt-2">
            <Countdown />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

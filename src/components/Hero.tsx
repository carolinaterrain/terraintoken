import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, FileText } from "lucide-react";
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 md:pt-40"
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
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        
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
              alt="TRN coin"
              className="relative w-72 md:w-96 h-72 md:h-96 object-contain animate-float hover:rotate-[5deg] transition-transform duration-300 cursor-pointer"
            />
          </div>
        </div>

        {/* RIGHT SIDE - Goblin + Content Stack */}
        <div className="flex flex-col items-start justify-center gap-6 text-left order-1 md:order-2">
          {/* Goblin + Title Row */}
          <div className="flex items-center gap-4">
            {/* Goblin Mascot */}
            <div className="relative flex-shrink-0 group">
              <img
                src={terrainMascot}
                alt="TRN mascot"
                className="w-16 h-16 md:w-20 md:h-20 animate-blink cursor-pointer"
                onClick={handleGoblinClick}
                onMouseEnter={handleGoblinHover}
              />
              
              {/* Hint tooltip */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground whitespace-nowrap pointer-events-none">
                Click me! 🎉
              </div>
              
              {/* Speech Bubble */}
              {showSpeechBubble && (
                <div className="absolute -top-12 left-16 md:left-20 bg-card border border-primary rounded-lg px-3 py-2 text-sm whitespace-nowrap animate-fade-in-up shadow-glow z-10 max-w-[200px] md:max-w-none">
                  {goblinPhrase}
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                TERRAIN <span className="text-primary">TOKEN</span>
              </h1>
            </div>
          </div>

          {/* Subheading */}
          <p className="font-display text-lg md:text-xl lg:text-2xl text-muted-foreground -mt-3">
            Born From The Ground Down
          </p>

          {/* Subtitle Tagline */}
          <p className="font-body text-base md:text-lg text-muted-foreground max-w-lg">
            The first meme coin backed by NDS-certified drainage contractors. Memeing today, powering terrain intelligence tomorrow.
          </p>

          {/* Contract Address with Copy + Verification */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <button
              onClick={copyContractAddress}
              aria-label="Copy contract address to clipboard"
              className="flex items-center gap-2 px-4 py-2 bg-card/50 border border-primary/20 rounded-lg hover:border-primary/40 transition-all group w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              <span className="font-mono text-xs md:text-sm text-foreground/80 truncate max-w-[200px] md:max-w-none">
                {contractAddress}
              </span>
              <Copy className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </button>
            <ContractVerificationBadge />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col w-full md:w-auto gap-3 mt-2">
            <Button
              variant="default"
              size="lg"
              className="font-display font-semibold w-full md:w-64"
              asChild
            >
              <a href="/earn-trn">
                <span className="mr-2">🌱</span>
                Start Earning TRN
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="font-display font-semibold w-full md:w-64"
              asChild
            >
              <a
                href="https://pump.fun/coin/2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump"
                target="_blank"
                rel="noopener noreferrer"
              >
                Buy TRN
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="font-display font-semibold w-full md:w-64"
              asChild
            >
              <a href="/whitepaper">
                <FileText className="mr-2 h-5 w-5" />
                Whitepaper
              </a>
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

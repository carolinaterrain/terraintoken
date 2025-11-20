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
      {/* Background Layers - Edge to Edge, No Margins */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated grid background */}
        <div 
          className="absolute inset-0 opacity-20 animate-grid-shift"
          style={{ background: "var(--terrain-grid)" }}
        />
        
        {/* Hero terrain image */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translate(${parallaxX * 0.5}px, ${parallaxY * 0.5}px)`,
          }}
        />
        
        {/* Gradient overlay for depth */}
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
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background pointer-events-none" />
      
      {/* Bottom-left goblin peeking */}
      <div 
        className="absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 z-20 slide-in-left"
        style={{
          transform: `translate(${parallaxX * -0.3}px, ${parallaxY * -0.3}px)`,
        }}
      >
        <img 
          src={terrainMascot} 
          alt="Goblin peeking" 
          className="w-full h-full object-contain animate-occasional-wink"
        />
      </div>
      
      {/* Top-right goblin waving */}
      <div 
        className="absolute top-10 right-10 w-16 h-16 md:w-20 md:h-20 z-20 slide-in-right hidden md:block"
        style={{
          transform: `translate(${parallaxX * -0.5}px, ${parallaxY * -0.5}px)`,
        }}
      >
        <div className="animate-wave text-4xl">👋</div>
      </div>
      
      <div className="container relative z-10 px-4 py-20 text-center">
        {/* Main goblin with coin - center stage */}
        <div 
          className="flex justify-center mb-8 relative"
          style={{
            transform: `translate(${parallaxX * 1.2}px, ${parallaxY * 1.2}px)`,
          }}
        >
          <div 
            className="relative cursor-pointer group"
            onClick={handleGoblinClick}
            onMouseEnter={handleGoblinHover}
          >
            <img 
              src={goblinWithCoin} 
              alt="Terrain Token Goblin" 
              className="w-48 h-48 md:w-64 md:h-64 drop-shadow-[0_0_60px_hsl(var(--terrain-glow)/0.7)] animate-float group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Speech bubble */}
            {showSpeechBubble && (
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-card border border-primary rounded-xl px-4 py-2 whitespace-nowrap animate-fade-in shadow-glow">
                <div className="text-sm font-medium">{goblinPhrase}</div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-card border-r border-b border-primary" />
              </div>
            )}
          </div>
        </div>
        
        {/* Title with typewriter effect */}
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-foreground via-terrain-glow to-foreground bg-clip-text text-transparent animate-title-drop">
          Terrain Token
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground/80 mb-6 animate-fade-in-up max-w-3xl mx-auto" style={{ animationDelay: '0.2s' }}>
          The first meme coin backed by NDS-certified drainage contractors
        </p>
        
        {/* TRN ticker */}
        <p className="text-xl md:text-2xl mb-2 text-muted-foreground font-medium animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <span className="text-primary">TRN</span>
        </p>
        
        {/* Contract address */}
        <button 
          onClick={copyContractAddress}
          className="text-xs md:text-sm text-muted-foreground/70 hover:text-primary transition-colors mb-8 font-mono inline-flex items-center gap-2 group animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          CA: {contractAddress.slice(0, 8)}...{contractAddress.slice(-6)}
          <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        
        {/* Tagline */}
        <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          Born from the ground down — memeing today, powering terrain intelligence tomorrow.
        </p>
        
        {/* Countdown Timer */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Countdown />
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in" style={{ animationDelay: '0.8s' }}>
          <Button 
            variant="hero" 
            size="lg"
            className="text-lg hover:scale-105 transition-transform"
            asChild
          >
            <a href="https://pump.fun/coin/2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump" target="_blank" rel="noopener noreferrer">
              Buy TRN <ArrowRight className="ml-2" />
            </a>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="text-lg border-primary/50 hover:border-primary hover:scale-105 transition-all"
            asChild
          >
            <a href="#roadmap">
              View Roadmap
            </a>
          </Button>
        </div>
      </div>
      
      <style>{`
        /* Floating animation */
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          25% { 
            transform: translateY(-15px) rotate(-2deg); 
          }
          75% { 
            transform: translateY(-10px) rotate(2deg); 
          }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        /* Terrain grid animation */
        .terrain-grid {
          background-image: 
            repeating-linear-gradient(0deg, hsl(var(--primary) / 0.1) 0px, transparent 1px, transparent 30px),
            repeating-linear-gradient(90deg, hsl(var(--primary) / 0.1) 0px, transparent 1px, transparent 30px);
          animation: grid-erode 20s linear infinite;
        }
        
        @keyframes grid-erode {
          0%, 100% { 
            transform: scale(1) translateY(0); 
            opacity: 0.3; 
          }
          50% { 
            transform: scale(1.1) translateY(-20px); 
            opacity: 0.1; 
          }
        }
        
        /* Scanlines */
        .scanlines {
          background: repeating-linear-gradient(
            0deg,
            hsl(var(--terrain-glow) / 0.05) 0px,
            transparent 2px,
            transparent 4px
          );
          animation: scan 8s linear infinite;
        }
        
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        
        /* Floating particles */
        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: hsl(var(--terrain-glow));
          border-radius: 50%;
          opacity: 0;
          animation: particle-float linear infinite;
        }
        
        @keyframes particle-float {
          0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0;
          }
        }
        
        /* Slide in animations */
        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .slide-in-left {
          animation: slide-in-left 1s ease-out;
        }
        
        .slide-in-right {
          animation: slide-in-right 1s ease-out;
        }
        
        /* Winking animation */
        @keyframes wink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        
        .animate-occasional-wink {
          animation: wink 6s ease-in-out infinite;
        }
        
        /* Wave animation */
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-20deg); }
        }
        
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }
        
        /* Title drop animation */
        @keyframes title-drop {
          from {
            transform: translateY(-50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-title-drop {
          animation: title-drop 0.8s ease-out;
        }
        
        /* Fade in up */
        @keyframes fade-in-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        /* Scale in */
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default Hero;

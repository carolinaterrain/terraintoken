import { Button } from "@/components/ui/button";
import { ArrowRight, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import Countdown from "./Countdown";
import goblinWithCoin from "@/assets/goblin-with-coin.png";
import terrainMascot from "@/assets/terrain-mascot.png";
import goblinBanner from "@/assets/goblin-banner.png";
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
      colors: ['#22c55e', '#16a34a', '#15803d']
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Background Layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Layer 1 - Base terrain grid */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translate(${parallaxX * 0.5}px, ${parallaxY * 0.5}px)`,
          }}
        />
        
        {/* Layer 2 - Goblin banner watermark */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url(${goblinBanner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translate(${parallaxX * 0.8}px, ${parallaxY * 0.8}px)`,
          }}
        />
        
        {/* Animated grid overlay */}
        <div className="absolute inset-0 terrain-grid" />
        
        {/* Scanlines */}
        <div className="absolute inset-0 scanlines opacity-10" />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>
      
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

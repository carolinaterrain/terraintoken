import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, FileText, AlertTriangle } from "lucide-react";
import { useState, memo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import ContractVerificationBadge from "./ContractVerificationBadge";
import { useTokenData } from "@/providers/TokenDataProvider";
import { Skeleton } from "@/components/ui/skeleton";

// Use public folder paths directly for LCP optimization - these match index.html preloads
const terrainMascot = "/terrain-mascot.png";
const trnCoin = "/trn-coin.png";
const heroBackground = "/hero-terrain-grid.jpg";

const Hero = memo(() => {
  const { toast } = useToast();
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [goblinPhrase, setGoblinPhrase] = useState("");
  const contractAddress = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";
  const { stats: tokenStats, isLoading } = useTokenData();
  
  const price = tokenStats?.priceUsd ?? "$0.00";
  
  // Neutral, informational phrases only
  const goblinPhrases = [
    "Utility access awaits",
    "Optional credits",
    "Background infrastructure",
    "Transparent systems",
    "Verification matters",
  ];
  
  const handleGoblinClick = async () => {
    const confetti = (await import("canvas-confetti")).default;
    confetti({
      particleCount: 30,
      spread: 40,
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
        title: "Contract Address Copied",
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
          className="absolute inset-0 opacity-20"
          style={{ background: "var(--terrain-grid)" }}
        />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div 
          className="absolute inset-0"
          style={{ background: "var(--gradient-dark)" }}
        />
      </div>

      {/* MANDATORY DISCLOSURE - Above fold, unmissable */}
      <div className="absolute top-20 left-0 right-0 bg-destructive/10 border-y border-destructive/30 z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-3 text-center">
            <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
            <p className="text-xs md:text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">TRN is not an investment</span>, does not represent ownership or profit rights, and is not required to use Terrain services.
            </p>
          </div>
        </div>
      </div>

      {/* Content - 50/50 Split Layout */}
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* LEFT SIDE - TRN Coin with Glow */}
        <div className="flex items-center justify-center relative order-2 md:order-1">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 blur-3xl bg-primary/20" />
            
            {/* Coin */}
            <img
              src={trnCoin}
              alt="TRN utility credit symbol"
              className="relative w-72 md:w-96 h-72 md:h-96 object-contain animate-float"
              width="384"
              height="384"
              loading="eager"
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
                alt="Terrain mascot"
                className="w-16 h-16 md:w-20 md:h-20 animate-blink cursor-pointer"
                width="80"
                height="80"
                loading="eager"
                onClick={handleGoblinClick}
                onMouseEnter={handleGoblinHover}
              />
              
              {/* Speech Bubble */}
              {showSpeechBubble && (
                <div className="absolute -top-12 left-16 md:left-20 bg-card border border-border rounded-lg px-3 py-2 text-sm whitespace-nowrap animate-fade-in-up shadow-lg z-50 max-w-[200px] md:max-w-none pointer-events-none">
                  {goblinPhrase}
                </div>
              )}
            </div>

            {/* Title - Declarative, neutral */}
            <div>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                TRN <span className="text-primary">Utility Credits</span>
              </h1>
              <p className="font-display text-lg md:text-xl text-muted-foreground mt-1">
                for the Terrain System
              </p>
            </div>
          </div>

          {/* Subheading - Explicit optionality */}
          <p className="font-display text-lg md:text-xl lg:text-2xl text-muted-foreground -mt-3">
            Optional access and stewardship credits used within Terrain services.
          </p>

          {/* Description - Background infrastructure framing */}
          <p className="font-body text-base md:text-lg text-muted-foreground max-w-lg">
            No wallet required for standard use. TRN operates as an <span className="text-primary font-semibold">optional utility layer</span> for accessing premium terrain analysis, contributing data, and receiving service credits.
          </p>
          
          {/* What TRN Is NOT - Prominent Disclaimer */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 max-w-lg">
            <p className="font-body text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">TRN is NOT:</span> an investment, a promise of returns, or required to use Terrain services. It carries no expectation of profit, does not represent equity or ownership, and has no guaranteed monetary value.
            </p>
          </div>

          {/* Contract Address with Copy + Verification */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <button
              onClick={copyContractAddress}
              aria-label="Copy contract address to clipboard"
              className="flex items-center gap-2 px-4 py-2 bg-card/50 border border-border rounded-lg hover:border-primary/40 transition-all group w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              <span className="font-mono text-xs md:text-sm text-foreground/80 truncate max-w-[200px] md:max-w-none">
                {contractAddress}
              </span>
              <Copy className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </button>
            <ContractVerificationBadge />
          </div>

          {/* CTA Buttons - Learn first, buy de-emphasized */}
          <div className="flex flex-col w-full md:w-auto gap-3 mt-2">
            {/* Primary: Learn How TRN Works */}
            <Button
              variant="default"
              size="lg"
              className="font-display font-semibold w-full md:w-64"
              asChild
            >
              <Link to="/ecosystem">
                Learn How TRN Works
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            {/* Secondary actions - muted */}
            <div className="flex gap-2 w-full md:w-64">
              <Button
                variant="outline"
                size="sm"
                className="font-display font-semibold flex-1"
                asChild
              >
                <Link to="/transparency">
                  Transparency Hub
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="font-display font-semibold flex-1"
                asChild
              >
                <Link to="/whitepaper">
                  <FileText className="mr-1 h-4 w-4" />
                  Whitepaper
                </Link>
              </Button>
            </div>
            
            {/* Tertiary: Acquire TRN (de-emphasized text link) */}
            <div className="mt-2">
              <a
                href="https://raydium.io/swap/?inputMint=sol&outputMint=2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Acquire TRN on Raydium (optional) →
              </a>
            </div>
          </div>

          {/* Collapsed Price Display - Optional toggle */}
          <details className="w-full md:w-64 mt-2">
            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              View current market price
            </summary>
            <div className="mt-2 p-3 bg-card/50 border border-border rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Current Price</p>
              {isLoading ? (
                <Skeleton className="h-6 w-20" />
              ) : (
                <p className="font-mono text-lg font-semibold">{price}</p>
              )}
              <p className="text-[10px] text-muted-foreground mt-1">
                Historical data only. Not investment advice.
              </p>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
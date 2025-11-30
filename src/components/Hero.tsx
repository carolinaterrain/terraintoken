import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { useState, useEffect, memo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import ContractVerificationBadge from "./ContractVerificationBadge";
import { useTokenData } from "@/providers/TokenDataProvider";

// Use public folder paths directly for LCP optimization - these match index.html preloads
const terrainMascot = "/terrain-mascot.png";
const trnCoin = "/trn-coin.png";
const heroBackground = "/hero-terrain-grid.jpg";

const Hero = memo(() => {
  const { toast } = useToast();
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [goblinPhrase, setGoblinPhrase] = useState("");
  const [priceUpdated, setPriceUpdated] = useState(false);
  const contractAddress = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";
  const { stats: tokenStats } = useTokenData();
  
  const price = tokenStats?.priceUsd ?? "$0.00";
  const change24h = tokenStats?.change24h ?? 0;
  const volume24h = tokenStats?.volume24h ?? "$0";
  const marketCap = tokenStats?.marketCap ?? "$0";
  
  const goblinPhrases = [
    "Ready to build? 🌱",
    "Real utility awaits! ⛏️",
    "Contribute & earn! 📈",
    "Real business, real token! 🌿",
    "Backed by operations! 💎",
  ];
  
  const handleGoblinClick = async () => {
    // Dynamic import for performance - only loads when clicked
    const confetti = (await import("canvas-confetti")).default;
    confetti({
      particleCount: 50,
      spread: 50,
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

  // Pulse animation on price update
  useEffect(() => {
    if (price !== "$0.00") {
      setPriceUpdated(true);
      const timer = setTimeout(() => setPriceUpdated(false), 500);
      return () => clearTimeout(timer);
    }
  }, [price]);
  
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

      {/* Live Price Ticker */}
      {tokenStats && (
        <div className="absolute top-20 left-0 right-0 bg-gradient-to-r from-chart-1/20 via-chart-3/20 to-chart-1/20 border-y border-primary/20 backdrop-blur-sm z-20">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-4 md:gap-8 text-xs md:text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-semibold">LIVE PRICE</span>
                <span className={`font-bold text-xl md:text-2xl text-chart-3 transition-transform ${priceUpdated ? 'scale-110' : 'scale-100'}`}>
                  {price}
                </span>
                <span className={`flex items-center gap-1 font-semibold ${change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {change24h >= 0 ? "+" : ""}{change24h.toFixed(2)}%
                </span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <span className="text-muted-foreground">VOL 24H:</span>
                <span className="font-semibold">{volume24h}</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <span className="text-muted-foreground">MCAP:</span>
                <span className="font-semibold">{marketCap}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground font-semibold">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content - 50/50 Split Layout */}
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* LEFT SIDE - TRN Coin with Glow */}
        <div className="flex items-center justify-center relative order-2 md:order-1">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 blur-3xl bg-primary/20" />
            
            {/* Spinning Coin */}
            <img
              src={trnCoin}
              alt="TRN coin spinning animation representing Terrain Token"
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
                alt="Terrain Token goblin mascot - click for surprise"
                className="w-16 h-16 md:w-20 md:h-20 animate-blink cursor-pointer"
                width="80"
                height="80"
                loading="eager"
                onClick={handleGoblinClick}
                onMouseEnter={handleGoblinHover}
              />
              
              {/* Hint tooltip */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground whitespace-nowrap pointer-events-none">
                Click me! 🎉
              </div>
              
              {/* Speech Bubble */}
              {showSpeechBubble && (
                <div className="absolute -top-12 left-16 md:left-20 bg-card border border-primary rounded-lg px-3 py-2 text-sm whitespace-nowrap animate-fade-in-up shadow-glow z-50 max-w-[200px] md:max-w-none pointer-events-none">
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
            Powering Real-World Terrain Intelligence
          </p>

          {/* Subtitle Tagline */}
          <p className="font-body text-base md:text-lg text-muted-foreground max-w-lg">
            TRN powers platform access and sustainability. <span className="text-primary font-semibold">Contribute terrain data</span>, access AI analysis, and participate in governance. <span className="text-primary font-semibold">TerrainVision AI is LIVE.</span>
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
              <Link to="/earn-trn">
                <span className="mr-2">🌱</span>
                Start Earning TRN
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="font-display font-semibold w-full md:w-64"
              asChild
            >
              <a
                href="https://raydium.io/swap/?inputMint=sol&outputMint=2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump"
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
              <Link to="/whitepaper">
                <FileText className="mr-2 h-5 w-5" />
                Whitepaper
              </Link>
            </Button>
          </div>

          {/* Inline Waitlist CTA */}
          <div className="mt-8 p-6 bg-gradient-to-br from-primary/10 via-chart-3/10 to-primary/5 border-2 border-primary/30 rounded-xl backdrop-blur-sm">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎮</span>
                <h3 className="font-display text-xl font-bold">Join TerrainScape Waitlist</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Be first to play the AI-powered drainage game. <span className="text-primary font-semibold">Coming 2026</span>
              </p>
              <Button
                variant="default"
                size="lg"
                className="font-semibold w-full"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('changeTab', { detail: { tab: 'community' } }));
                  setTimeout(() => {
                    document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
              >
                🌱 Secure Beta Access
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
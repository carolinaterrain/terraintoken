import { Button } from "@/components/ui/button";
import { Wallet, Coins, Rocket, TrendingUp, ExternalLink, QrCode } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useFeatureAnalytics } from "@/hooks/useFeatureAnalytics";

const HowToBuy = () => {
  const [showQR, setShowQR] = useState(false);
  const { trackBuyButtonClick } = useFeatureAnalytics();
  const raydiumUrl = "https://raydium.io/swap/?inputMint=sol&outputMint=2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";
  
  const handleBuyClick = () => {
    trackBuyButtonClick('raydium', 'how_to_buy_section');
  };
  
  const steps = [
    {
      icon: Wallet,
      title: "Get a Wallet",
      description: "Download Phantom or any Solana wallet",
      goblinText: "👋"
    },
    {
      icon: Coins,
      title: "Add SOL",
      description: "Buy SOL on exchange or via wallet",
      goblinText: "💰"
    },
    {
      icon: Rocket,
      title: "Swap on Raydium",
      description: "Trade on Solana's leading DEX",
      goblinText: "🚀",
      isAction: true
    },
    {
      icon: TrendingUp,
      title: "Swap & HODL",
      description: "Exchange SOL for TRN — become legend",
      goblinText: "🏆"
    }
  ];
  
  return (
    <section id="how-to-buy" className="py-20 px-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, hsl(var(--primary)) 0px, transparent 1px, transparent 20px),
                           repeating-linear-gradient(90deg, hsl(var(--primary)) 0px, transparent 1px, transparent 20px)`
        }} />
      </div>
      
      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-terrain-glow to-foreground bg-clip-text text-transparent">
            How to Join the Ground Crew
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Super easy — four simple steps to become a terrain legend
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {steps.map((step, index) => (
            <Card 
              key={index}
              className="relative group hover:border-primary/50 transition-all duration-300 hover:shadow-glow overflow-hidden"
            >
              <CardContent className="p-6 text-center">
                {/* Step number */}
                <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold animate-sequence" style={{ animationDelay: `${index * 0.2}s` }}>
                  {index + 1}
                </div>
                
                {/* Goblin emoji */}
                <div className="absolute top-4 right-4 text-2xl animate-bounce" style={{ animationDelay: `${index * 0.3}s` }}>
                  {step.goblinText}
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-cyber flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                
                {/* Action button for step 3 */}
                {step.isAction && (
                  <Button 
                    variant="hero" 
                    size="sm"
                    className="w-full group-hover:scale-105 transition-transform"
                    asChild
                  >
                    <a 
                      href={raydiumUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={handleBuyClick}
                    >
                      Buy TRN Now <ExternalLink className="ml-2 w-4 h-4" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* QR Code section */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowQR(!showQR)}
            className="border-primary/30 hover:border-primary"
          >
            <QrCode className="mr-2 w-5 h-5" />
            {showQR ? "Hide" : "Show"} QR Code for Mobile
          </Button>
          
          {showQR && (
            <div className="mt-6 inline-block p-6 bg-card border border-border rounded-xl animate-fade-in">
              <p className="text-sm text-muted-foreground mb-4">
                Scan with your mobile wallet to trade on Raydium
              </p>
              <div className="bg-white p-4 rounded-lg inline-block">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(raydiumUrl)}`}
                  alt="QR Code for TRN on Raydium"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Contract: 2L1x...pump
              </p>
            </div>
          )}
        </div>
        
        {/* First time tooltip */}
        <div className="mt-8 text-center">
          <details className="inline-block text-left max-w-md">
            <summary className="cursor-pointer text-primary hover:text-terrain-glow transition-colors">
              ❓ First time buying crypto?
            </summary>
            <div className="mt-4 p-4 bg-card border border-border rounded-lg text-sm text-muted-foreground">
              <p className="mb-2">No worries! Here's a quick start:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Create a Phantom wallet (it's free and takes 2 minutes)</li>
                <li>Buy SOL using a credit card directly in Phantom</li>
                <li>Use the swap feature to exchange SOL for TRN</li>
                <li>That's it — you're now a terrain legend! 🌱</li>
              </ul>
            </div>
          </details>
        </div>
      </div>
      
      <style>{`
        @keyframes sequence-glow {
          0%, 100% {
            box-shadow: 0 0 5px hsl(var(--primary) / 0.3);
          }
          50% {
            box-shadow: 0 0 15px hsl(var(--primary) / 0.6);
          }
        }
        
        .animate-sequence {
          animation: sequence-glow 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HowToBuy;

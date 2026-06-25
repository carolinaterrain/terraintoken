import { Button } from "@/components/ui/button";
import { Wallet, Coins, ArrowRightLeft, ExternalLink, QrCode, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useFeatureAnalytics } from "@/hooks/useFeatureAnalytics";
import { TRN_MINT_ADDRESS } from "@/lib/airdropConstants";

const HowToBuy = () => {
  const [showQR, setShowQR] = useState(false);
  const { trackBuyButtonClick } = useFeatureAnalytics();
  const raydiumUrl = `https://raydium.io/swap/?inputMint=sol&outputMint=${TRN_MINT_ADDRESS}`;
  
  const handleBuyClick = () => {
    trackBuyButtonClick('raydium', 'how_to_buy_section');
  };
  
  const steps = [
    {
      icon: Wallet,
      title: "Get a Wallet",
      description: "Download Phantom or any Solana wallet"
    },
    {
      icon: Coins,
      title: "Add SOL",
      description: "Buy SOL on exchange or via wallet"
    },
    {
      icon: ArrowRightLeft,
      title: "Swap on Raydium",
      description: "Trade on Solana's DEX",
      isAction: true
    },
    {
      icon: Wallet,
      title: "Hold in Wallet",
      description: "Store TRN in your wallet (optional)"
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
        {/* Optionality Disclaimer */}
        <div className="flex items-center justify-center gap-2 mb-8 bg-muted/30 border border-border/50 rounded-lg px-4 py-3 max-w-2xl mx-auto">
          <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <p className="text-sm text-muted-foreground text-center">
            TRN acquisition is entirely optional. Standard Terrain services work without it.
          </p>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How to Acquire TRN (Optional)
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four steps to acquire TRN utility credits. Not required to use Terrain services.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {steps.map((step, index) => (
            <Card 
              key={index}
              className="relative group hover:border-primary/50 transition-all duration-300 overflow-hidden"
            >
              <CardContent className="p-6 text-center">
                {/* Step number */}
                <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                
                {/* Action button for step 3 */}
                {step.isAction && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <a 
                      href={raydiumUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={handleBuyClick}
                    >
                      Open Raydium <ExternalLink className="ml-2 w-4 h-4" />
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
            className="border-border hover:border-primary/50"
          >
            <QrCode className="mr-2 w-5 h-5" />
            {showQR ? "Hide" : "Show"} QR Code for Mobile
          </Button>
          
          {showQR && (
            <div className="mt-6 inline-block p-6 bg-card border border-border rounded-xl animate-fade-in">
              <p className="text-sm text-muted-foreground mb-4">
                Scan with your mobile wallet to swap on Raydium
              </p>
              <div className="bg-white p-4 rounded-lg inline-block">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(raydiumUrl)}`}
                  alt="QR Code for TRN on Raydium"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Contract: Dm7FAc…wtDR8m
              </p>
            </div>
          )}
        </div>
        
        {/* First time tooltip */}
        <div className="mt-8 text-center">
          <details className="inline-block text-left max-w-md">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors text-sm">
              First time using a crypto wallet?
            </summary>
            <div className="mt-4 p-4 bg-card border border-border rounded-lg text-sm text-muted-foreground">
              <p className="mb-2">Here's how to get started:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Create a Phantom wallet (free, takes 2 minutes)</li>
                <li>Buy SOL using a credit card directly in Phantom</li>
                <li>Use the swap feature to exchange SOL for TRN</li>
                <li>TRN will appear in your wallet</li>
              </ul>
              <p className="mt-3 text-xs">
                Remember: TRN is optional. Terrain services work without it.
              </p>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
};

export default HowToBuy;
import { useEffect, useState, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

// TRN Token mint address on Solana
const TRN_MINT = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";

interface BuyTier {
  id: string;
  dollarAmount: number;
  color: string;
}

const BUY_TIERS: BuyTier[] = [
  { id: "tier_10", dollarAmount: 10, color: "from-gray-500 to-gray-600" },
  { id: "tier_50", dollarAmount: 50, color: "from-orange-500 to-red-600" },
  { id: "tier_100", dollarAmount: 100, color: "from-cyan-500 to-blue-600" },
  { id: "tier_500", dollarAmount: 500, color: "from-blue-600 to-indigo-700" },
  { id: "tier_1000", dollarAmount: 1000, color: "from-purple-600 to-pink-600" },
];

export const JupiterSwap = () => {
  const { publicKey, connected } = useWallet();
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState<BuyTier | null>(null);
  const jupiterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Jupiter Terminal script
    const script = document.createElement("script");
    script.src = "https://terminal.jup.ag/main-v2.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeJupiter = (tier: BuyTier) => {
    if (!window.Jupiter || !jupiterRef.current) return;

    window.Jupiter.init({
      displayMode: "integrated",
      integratedTargetId: "jupiter-terminal",
      endpoint: "https://api.mainnet-beta.solana.com",
      defaultExplorer: "Solscan",
      formProps: {
        initialInputMint: "So11111111111111111111111111111111111111112", // SOL
        initialOutputMint: TRN_MINT,
        initialAmount: (tier.dollarAmount * 1e9).toString(), // Convert to lamports
      },
      strictTokenList: false,
      onSuccess: async ({ txid }: { txid: string }) => {
        celebratePurchase();
        console.log("Purchase successful:", txid);
      },
    });
  };

  const celebratePurchase = () => {
    // Confetti explosion
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10B981", "#F59E0B", "#8B5CF6"],
    });

    // Success toast
    toast({
      title: "🎉 Purchase Successful!",
      description: "Your TRN tokens are on the way. Check your wallet!",
      duration: 5000,
    });
  };

  const handleQuickBuy = (tier: BuyTier) => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setSelectedTier(tier);
    initializeJupiter(tier);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-gold/60">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-goblin-gold flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Quick Buy TRN
          </h3>
        </div>

        <p className="text-sm text-muted-foreground">
          One-click purchase with best prices from Jupiter aggregator.
        </p>

        {/* Buy Tier Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {BUY_TIERS.map((tier) => (
            <Button
              key={tier.id}
              onClick={() => handleQuickBuy(tier)}
              disabled={!connected}
              className={`h-auto py-4 bg-gradient-to-r ${tier.color} hover:opacity-90 text-white font-bold text-lg`}
            >
              ${tier.dollarAmount}
            </Button>
          ))}
        </div>

        {/* Jupiter Terminal Integration */}
        {selectedTier && (
          <div className="mt-4">
            <div
              id="jupiter-terminal"
              ref={jupiterRef}
              className="rounded-lg overflow-hidden"
            />
          </div>
        )}

        {!connected && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            Connect your wallet to start buying TRN
          </div>
        )}
      </div>
    </Card>
  );
};

// Extend window type for Jupiter
declare global {
  interface Window {
    Jupiter: any;
  }
}

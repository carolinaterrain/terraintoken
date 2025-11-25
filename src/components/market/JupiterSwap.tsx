import { useEffect, useState, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import confetti from "canvas-confetti";

// TRN Token mint address on Solana
const TRN_MINT = "EMrpbqAmruGBfkejNXQPZVTkuFHt7pc6DUeHRfN8qSQV";

interface BuyTier {
  id: string;
  name: string;
  emoji: string;
  dollarAmount: number;
  estimatedTRN: number;
  color: string;
}

const BUY_TIERS: BuyTier[] = [
  {
    id: "shrimp",
    name: "Shrimp Starter",
    emoji: "🦐",
    dollarAmount: 10,
    estimatedTRN: 100000,
    color: "from-gray-500 to-gray-600",
  },
  {
    id: "crab",
    name: "Crab Collector",
    emoji: "🦀",
    dollarAmount: 50,
    estimatedTRN: 500000,
    color: "from-orange-500 to-red-600",
  },
  {
    id: "dolphin",
    name: "Dolphin Dive",
    emoji: "🐬",
    dollarAmount: 100,
    estimatedTRN: 1000000,
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "shark",
    name: "Shark Attack",
    emoji: "🦈",
    dollarAmount: 500,
    estimatedTRN: 5000000,
    color: "from-blue-600 to-indigo-700",
  },
  {
    id: "whale",
    name: "Whale Entry",
    emoji: "🐋",
    dollarAmount: 1000,
    estimatedTRN: 10000000,
    color: "from-purple-600 to-pink-600",
  },
];

export const JupiterSwap = () => {
  const { publicKey, connected } = useWallet();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
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
      onSuccess: async ({ txid }) => {
        await trackPurchase(tier, txid);
        celebratePurchase(tier);
      },
    });
  };

  const trackPurchase = async (tier: BuyTier, txSignature: string) => {
    if (!publicKey) return;

    try {
      // Check for referral code in URL
      const urlParams = new URLSearchParams(window.location.search);
      const referralCode = urlParams.get("ref");

      const purchaseData: any = {
        wallet_address: publicKey.toBase58(),
        amount_trn: tier.estimatedTRN,
        amount_sol: tier.dollarAmount / 100, // Rough estimate
        purchase_tier: tier.id,
        transaction_signature: txSignature,
        metadata: {
          tier_name: tier.name,
          timestamp: new Date().toISOString(),
          referral_code: referralCode || null,
        },
      };

      const { error } = await supabase.from("trn_purchases").insert(purchaseData);

      if (error) throw error;

      // Process referral if exists
      if (referralCode) {
        const bonusAmount = tier.estimatedTRN * 0.02; // 2% bonus for buyer
        const referrerBonus = tier.estimatedTRN * 0.01; // 1% for referrer

        // Find referrer
        const { data: referrer } = await supabase
          .from("referral_codes")
          .select("*")
          .eq("referral_code", referralCode)
          .maybeSingle();

        if (referrer) {
          // Insert redemption
          await supabase.from("referral_redemptions").insert({
            referrer_wallet: referrer.wallet_address,
            referee_wallet: publicKey.toBase58(),
            referral_code: referralCode,
            bonus_amount: bonusAmount,
            purchase_amount: tier.estimatedTRN,
          });

          // Update referrer stats
          await supabase
            .from("referral_codes")
            .update({
              total_referrals: referrer.total_referrals + 1,
              total_bonus_trn: referrer.total_bonus_trn + referrerBonus,
            })
            .eq("wallet_address", referrer.wallet_address);

          toast({
            title: "🎁 Referral Bonus!",
            description: `You got ${(bonusAmount / 1000000).toFixed(2)}M extra TRN!`,
          });
        }
      }

      // Update leaderboard via edge function
      await supabase.functions.invoke("upsert-leaderboard-stats", {
        body: {
          p_wallet_address: publicKey.toBase58(),
          p_trn_amount: tier.estimatedTRN,
        },
      });

      // Check for whale alert (5M+ TRN)
      if (tier.estimatedTRN >= 5000000) {
        await supabase.from("whale_alerts").insert({
          wallet_address: publicKey.toBase58(),
          amount_trn: tier.estimatedTRN,
          alert_type: "large_purchase",
          metadata: {
            transaction_signature: txSignature,
            tier: tier.id,
          },
        });
      }
    } catch (error) {
      console.error("Error tracking purchase:", error);
    }
  };

  const celebratePurchase = (tier: BuyTier) => {
    // Confetti explosion
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10B981", "#F59E0B", "#8B5CF6"],
    });

    // Success toast with achievement
    toast({
      title: `🎉 Welcome, ${tier.name}!`,
      description: `You just bought ${(tier.estimatedTRN / 1000000).toFixed(2)}M TRN! Achievement unlocked!`,
      duration: 5000,
    });

    // Unlock achievement
    unlockPurchaseAchievement(tier.id);
  };

  const unlockPurchaseAchievement = async (tierId: string) => {
    if (!publicKey) return;

    const achievementMap: Record<string, string> = {
      shrimp: "first_buy",
      crab: "crab_status",
      dolphin: "dolphin_status",
      shark: "shark_status",
      whale: "whale_status",
    };

    const achievementId = achievementMap[tierId];
    if (!achievementId) return;

    try {
      await supabase.from("market_achievements").insert({
        user_wallet: publicKey.toBase58(),
        achievement_id: achievementId,
        metadata: { tier: tierId },
      });
    } catch (error) {
      // Achievement might already exist
      console.log("Achievement already unlocked");
    }
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
          <Sparkles className="w-5 h-5 text-goblin-green animate-pulse" />
        </div>

        <p className="text-sm text-muted-foreground">
          One-click purchase. Best prices from Jupiter aggregator. Instant achievements.
        </p>

        {/* Buy Tier Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {BUY_TIERS.map((tier) => (
            <Button
              key={tier.id}
              onClick={() => handleQuickBuy(tier)}
              disabled={isLoading || !connected}
              className={`h-auto py-4 bg-gradient-to-r ${tier.color} hover:opacity-90 flex flex-col items-start gap-1 text-left`}
            >
              <div className="flex items-center gap-2 w-full">
                <span className="text-2xl">{tier.emoji}</span>
                <div className="flex-1">
                  <div className="font-bold">{tier.name}</div>
                  <div className="text-xs opacity-80">${tier.dollarAmount}</div>
                </div>
              </div>
              <div className="text-xs opacity-90">
                ~{(tier.estimatedTRN / 1000000).toFixed(2)}M TRN
              </div>
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

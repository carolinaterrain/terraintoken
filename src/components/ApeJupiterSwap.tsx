import { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import confetti from "canvas-confetti";
import { useFeatureAnalytics } from "@/hooks/useFeatureAnalytics";

const TRN_MINT = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";
const SOL_MINT = "So11111111111111111111111111111111111111112";

type SwapMode = 'buy' | 'sell' | null;

interface ApeJupiterSwapProps {
  mode: SwapMode;
  onClose: () => void;
}

export const ApeJupiterSwap = ({ mode, onClose }: ApeJupiterSwapProps) => {
  const { publicKey, connected } = useWallet();
  const { toast } = useToast();
  const { trackButtonClick } = useFeatureAnalytics();
  const jupiterRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load Jupiter Terminal script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Jupiter) {
      const script = document.createElement("script");
      script.src = "https://terminal.jup.ag/main-v2.js";
      script.async = true;
      script.onload = () => setIsInitialized(true);
      document.body.appendChild(script);

      return () => {
        try {
          document.body.removeChild(script);
        } catch (e) {
          // Script might already be removed
        }
      };
    } else if (window.Jupiter) {
      setIsInitialized(true);
    }
  }, []);

  // Initialize Jupiter when mode changes and wallet is connected
  useEffect(() => {
    if (!mode || !connected || !isInitialized || !window.Jupiter) return;

    const initJupiter = () => {
      const config = mode === 'buy' 
        ? {
            initialInputMint: SOL_MINT,
            initialOutputMint: TRN_MINT,
            initialAmount: "50000000000", // $50 worth in lamports (approximate)
          }
        : {
            initialInputMint: TRN_MINT,
            initialOutputMint: SOL_MINT,
            initialAmount: "", // Let user input amount
          };

      window.Jupiter.init({
        displayMode: "integrated",
        integratedTargetId: "ape-jupiter-terminal",
        endpoint: "https://api.mainnet-beta.solana.com",
        defaultExplorer: "Solscan",
        formProps: config,
        strictTokenList: false,
        onSuccess: async ({ txid }: { txid: string }) => {
          await trackTransaction(mode, txid);
          celebrate(mode);
          setTimeout(() => onClose(), 2000);
        },
      });
    };

    // Small delay to ensure DOM is ready
    setTimeout(initJupiter, 100);
  }, [mode, connected, isInitialized, onClose]);

  const trackTransaction = async (swapMode: 'buy' | 'sell', txSignature: string) => {
    if (!publicKey) return;

    try {
      trackButtonClick(`ape_mode_${swapMode}_complete`, 'jupiter-swap');

      // Track purchase in database
      const purchaseData = {
        wallet_address: publicKey.toBase58(),
        amount_trn: 0, // We don't know exact amount from Jupiter
        amount_sol: 0,
        purchase_tier: swapMode === 'buy' ? 'ape_buy' : 'ape_sell',
        transaction_signature: txSignature,
        metadata: {
          mode: swapMode,
          timestamp: new Date().toISOString(),
        },
      };

      await supabase.from("trn_purchases").insert(purchaseData);

      // Update leaderboard
      if (swapMode === 'buy') {
        await supabase.functions.invoke("upsert-leaderboard-stats", {
          body: {
            p_wallet_address: publicKey.toBase58(),
            p_trn_amount: 1000000, // Estimated
          },
        });
      }
    } catch (error) {
      console.error("Error tracking transaction:", error);
    }
  };

  const celebrate = (swapMode: 'buy' | 'sell') => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: swapMode === 'buy' ? ["#10B981", "#F59E0B", "#8B5CF6"] : ["#EF4444", "#F59E0B", "#3B82F6"],
    });

    toast({
      title: swapMode === 'buy' ? "🎉 Ape happy! 🦍" : "💰 Sold like a pro!",
      description: swapMode === 'buy' 
        ? "Welcome to the TRN family! You're officially an ape now."
        : "Profits secured! Come back anytime, king.",
      duration: 5000,
    });
  };

  return (
    <Dialog open={!!mode} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === 'buy' ? '🟢 Buy TRN' : '🔴 Sell TRN'}
          </DialogTitle>
        </DialogHeader>

        {!connected ? (
          <div className="py-12 text-center space-y-6">
            <p className="text-lg text-muted-foreground">
              Connect your wallet to {mode === 'buy' ? 'buy' : 'sell'} TRN
            </p>
            <div className="flex justify-center">
              <WalletMultiButton />
            </div>
          </div>
        ) : (
          <div className="py-4">
            <div
              id="ape-jupiter-terminal"
              ref={jupiterRef}
              className="rounded-lg overflow-hidden min-h-[400px]"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Extend window type for Jupiter
declare global {
  interface Window {
    Jupiter: any;
  }
}

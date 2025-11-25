import { useState } from "react";
import { ApeHero } from "@/components/ApeHero";
import { ApeJupiterSwap } from "@/components/ApeJupiterSwap";
import { ApeTrustSignals } from "@/components/ApeTrustSignals";
import { ApeLiveFooter } from "@/components/ApeLiveFooter";
import { SolanaWalletProvider } from "@/providers/WalletProvider";

type SwapMode = 'buy' | 'sell' | null;

export const ApeModeContent = () => {
  const [swapMode, setSwapMode] = useState<SwapMode>(null);

  return (
    <SolanaWalletProvider>
      <div className="pb-20">
        {/* Giant Buy/Sell Hero */}
        <ApeHero 
          onBuyClick={() => setSwapMode('buy')}
          onSellClick={() => setSwapMode('sell')}
        />

        {/* Single Trust Signals Accordion */}
        <ApeTrustSignals />

        {/* Minimal Footer */}
        <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border">
          <p>© 2025 Terrain Token. All rights reserved.</p>
        </footer>
      </div>

      {/* Live Price Footer - Fixed at Bottom */}
      <ApeLiveFooter />

      {/* Jupiter Swap Modal */}
      <ApeJupiterSwap 
        mode={swapMode}
        onClose={() => setSwapMode(null)}
      />
    </SolanaWalletProvider>
  );
};

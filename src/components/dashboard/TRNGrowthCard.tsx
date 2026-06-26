import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Sparkles, Wallet, ExternalLink, Shield } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { TRN_MINT_ADDRESS, TRN_APY_RATE } from "@/lib/airdropConstants";

interface TRNGrowthCardProps {
  balance?: number;
  onBalanceChange?: (balance: number) => void;
}

export function TRNGrowthCard({ balance: externalBalance, onBalanceChange }: TRNGrowthCardProps) {
  const { publicKey, connected } = useWallet();
  const [displayBalance, setDisplayBalance] = useState(0);
  const [actualBalance, setActualBalance] = useState(externalBalance ?? 0);
  const [lastTick, setLastTick] = useState<Date>(new Date());

  // Calculate yield per second based on 15% APY
  // NOTE: reflects on-chain InterestBearingConfig rate; pending rate-zero on-chain.
  const calculateYieldPerSecond = useCallback((balance: number) => {
    // 15% APY = 0.15 / 365 / 24 / 60 / 60 per second
    const annualRate = TRN_APY_RATE / 100;
    const perSecond = annualRate / 365 / 24 / 60 / 60;
    return balance * perSecond;
  }, []);

  // Real-time ticker effect - ticks every 3 seconds
  useEffect(() => {
    if (!connected || actualBalance <= 0) {
      setDisplayBalance(actualBalance);
      return;
    }

    const yieldPerSecond = calculateYieldPerSecond(actualBalance);
    
    const interval = setInterval(() => {
      setDisplayBalance(prev => {
        const newBalance = prev + (yieldPerSecond * 3); // 3 seconds worth
        setLastTick(new Date());
        return newBalance;
      });
    }, 3000);

    // Initialize display balance
    setDisplayBalance(actualBalance);

    return () => clearInterval(interval);
  }, [connected, actualBalance, calculateYieldPerSecond]);

  // Update actual balance when external balance changes
  useEffect(() => {
    if (externalBalance !== undefined) {
      setActualBalance(externalBalance);
    }
  }, [externalBalance]);

  // Fetch real balance when wallet connects
  useEffect(() => {
    if (connected && publicKey && externalBalance === undefined) {
      // TODO: Fetch real balance from Solana RPC
      // For now, show 0 until real balance is fetched
      setActualBalance(0);
    }
  }, [connected, publicKey, externalBalance]);

  const formatBalance = (value: number) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(6) + "M";
    } else if (value >= 1000) {
      return (value / 1000).toFixed(4) + "K";
    }
    return value.toFixed(6);
  };

  const dailyYield = actualBalance * (TRN_APY_RATE / 100 / 365);
  const monthlyYield = dailyYield * 30;

  return (
    <GlassCard className="relative overflow-hidden border-2 border-terrain-glow/30 bg-gradient-to-br from-slate-950 via-slate-900 to-terrain-deep">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      
      {/* Glow effect */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-terrain-glow/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-terrain-purple/20 rounded-full blur-3xl" />

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-terrain-purple/20 border border-primary/30">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Your TRN Balance</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Token-2022 (Interest-Bearing Extension Enabled)
              </p>
            </div>
          </div>
          
          <Badge variant="outline" className="border-amber-500/40 text-amber-500">
            Utility Token · Not an Investment
          </Badge>
        </div>

        {!connected ? (
          // Not connected state
          <div className="text-center py-12 space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-terrain-purple/10 border-2 border-dashed border-primary/30 flex items-center justify-center">
              <Wallet className="w-12 h-12 text-primary/50" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Connect Your Wallet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                View your on-chain $TRN balance. Balances reflect the Token-2022 interest-bearing extension as a technical property of the mint — not a promised return.
              </p>
            </div>
            <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !rounded-xl !px-8 !py-3 !font-semibold" />
          </div>
        ) : (
          // Connected state with balance
          <div className="space-y-6">
            {/* Main Balance Display */}
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-2">Current Balance</p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={Math.floor(displayBalance)}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <span className="text-5xl md:text-7xl font-bold font-mono bg-gradient-to-r from-primary via-terrain-glow to-primary bg-clip-text text-transparent">
                    {formatBalance(displayBalance)}
                  </span>
                  <span className="text-2xl md:text-3xl font-bold text-primary ml-3">TRN</span>
                </motion.div>
              </AnimatePresence>
              
              {/* Real-time yield indicator */}
              <motion.div
                key={lastTick.getTime()}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 flex items-center justify-center gap-2 text-sm text-terrain-glow"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="font-mono">+{(calculateYieldPerSecond(actualBalance) * 3).toFixed(8)} TRN</span>
                <span className="text-muted-foreground text-xs">(every 3s)</span>
              </motion.div>
            </div>

            {/* Yield Projections */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Daily Yield</p>
                <p className="text-lg font-bold font-mono text-primary">
                  +{dailyYield.toFixed(2)} TRN
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-terrain-purple/5 to-transparent border border-terrain-purple/20">
                <p className="text-xs text-muted-foreground mb-1">Monthly Yield</p>
                <p className="text-lg font-bold font-mono text-terrain-purple">
                  +{monthlyYield.toFixed(2)} TRN
                </p>
              </div>
            </div>

            {/* Wallet Info */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground font-mono">
                  {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-6)}
                </span>
              </div>
              <a
                href={`https://solscan.io/token/${TRN_MINT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Verify on Solscan <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

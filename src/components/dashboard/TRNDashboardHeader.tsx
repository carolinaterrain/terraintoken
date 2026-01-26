import { motion } from "framer-motion";
import { ExternalLink, Shield, Activity, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WalletConnect } from "@/components/market/WalletConnect";
import { LiveViewersCounter } from "@/components/market/LiveViewersCounter";
import { AdminAirdropButton } from "./AdminAirdropButton";
import { TRN_MINT_ADDRESS, TRN_APY_RATE } from "@/lib/airdropConstants";
import BackToHome from "@/components/BackToHome";

export function TRNDashboardHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        {/* Top bar with APY banner */}
        <div className="flex items-center justify-center py-2 border-b border-border/30">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/30">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">
                Yield Mode: {TRN_APY_RATE}% APY Active
              </span>
              <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                Token-2022
              </Badge>
            </div>
            <a
              href={`https://solscan.io/token/${TRN_MINT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              Verify <ExternalLink className="w-3 h-3" />
            </a>
          </motion.div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Left: Navigation */}
          <div className="flex items-center gap-4">
            <BackToHome />
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/50">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">TRN Dashboard</span>
            </div>
          </div>

          {/* Center: Title (mobile hidden) */}
          <div className="hidden lg:flex flex-col items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-terrain-glow to-terrain-purple bg-clip-text text-transparent">
              Terrain Token ($TRN)
            </h1>
            <p className="text-xs text-muted-foreground">
              The Financial Protocol of the Terrain Ecosystem
            </p>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <LiveViewersCounter />
            
            {/* Admin Button - Only shows for admin wallet */}
            <AdminAirdropButton />
            
            {/* Wallet Connect */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <WalletConnect />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

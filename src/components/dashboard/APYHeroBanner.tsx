import { motion } from "framer-motion";
import { Sparkles, Shield, ExternalLink, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TRN_MINT_ADDRESS } from "@/lib/airdropConstants";

export function APYHeroBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-terrain-glow/10 to-terrain-purple/10 border-2 border-primary/40"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--terrain-purple)/0.15),transparent_50%)]" />
      </div>

      <div className="relative z-10 p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Badge className="bg-primary/20 border-primary/50 text-primary text-sm px-4 py-1">
            <Shield className="w-4 h-4 mr-2" />
            Solana Token-2022 · Mint Revoked · LP Burned
          </Badge>

          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            $TRN — The Incentive Layer of the Terrain Ecosystem
          </h2>

          <p className="text-base md:text-lg text-muted-foreground">
            $TRN is deployed on Solana's <strong className="text-foreground">Token-2022 standard</strong> with the
            interest-bearing extension enabled (1500 BPS) as a technical property of the mint. This is a feature of the
            token standard — not a yield, not a promised return, and not a financial product.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-border/50 bg-background/40 p-4">
              <p className="text-muted-foreground">Standard</p>
              <p className="font-bold text-foreground">Token-2022</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-background/40 p-4">
              <p className="text-muted-foreground">Total Supply</p>
              <p className="font-bold text-foreground">1,250,000,000 (fixed)</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-background/40 p-4">
              <p className="text-muted-foreground">Mint Authority</p>
              <p className="font-bold text-foreground">Revoked</p>
            </div>
          </div>

          <div className="flex items-start gap-3 max-w-2xl mx-auto p-4 rounded-lg border border-amber-500/30 bg-amber-500/5 text-left">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm text-muted-foreground">
              <span className="text-amber-500 font-semibold">$TRN is a utility/incentive token, not an investment or security.</span>{" "}
              It carries no promise of profit, yield, or return. Nothing on this page is financial advice. Always verify the
              contract address before interacting.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Button size="lg" className="gap-2" asChild>
              <a
                href={`https://solscan.io/token/${TRN_MINT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Shield className="w-5 h-5" />
                Verify on Solscan
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <a href="/whitepaper">
                <Sparkles className="w-5 h-5" />
                Read the Whitepaper
              </a>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

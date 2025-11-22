import { MessageCircle, Users, Twitter, Shield, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import trnCoin from "@/assets/trn-coin.png";

const Footer = () => {
  const contractAddress = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";

  return (
    <footer className="border-t border-border/50 bg-terrain-dark">
      {/* Transparency Mini Cards */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <GlassCard className="p-4 text-center">
            <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Total Supply</p>
            <p className="font-display text-sm font-bold text-primary">10.43M TRN</p>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <Shield className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Circulating</p>
            <p className="font-display text-sm font-bold text-primary">~5.2M TRN</p>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <Shield className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Dev Holdings</p>
            <p className="font-display text-sm font-bold text-primary">~1%</p>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <Shield className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Liquidity</p>
            <p className="font-display text-sm font-bold text-primary">Community</p>
          </GlassCard>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 border-t border-border/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Logo + Copyright */}
          <div className="flex items-center gap-3">
            <img src={trnCoin} alt="TRN Terrain Token logo coin" className="h-10 w-10" />
            <div>
              <p className="font-display font-bold text-sm">Terrain Token</p>
              <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} • All rights reserved</p>
            </div>
          </div>

          {/* Center: Contract Address */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Contract Address</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(contractAddress);
              }}
              className="font-mono text-xs text-foreground/70 hover:text-primary transition-colors"
            >
              {contractAddress.slice(0, 8)}...{contractAddress.slice(-8)}
            </button>
          </div>

          {/* Right: Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://t.me/+s6385WFOp21lOGZh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <a
              href="https://discord.gg/terraintoken"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Users className="w-5 h-5" />
            </a>
            <a
              href="https://x.com/carolinaterrain"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Bottom: Disclaimer */}
        <div className="mt-4 pt-4 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground">
            Not financial advice. DYOR. Meme responsibly. 🌱
          </p>
          <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-3 mt-3">
            <a 
              href="/earn-trn" 
              className="text-xs text-primary hover:underline font-medium"
            >
              Earn TRN Dashboard
            </a>
            <a 
              href="/upload-project" 
              className="text-xs text-primary hover:underline font-medium"
            >
              Upload & Earn
            </a>
            <a 
              href="/whitepaper" 
              className="text-xs text-primary hover:underline font-medium"
            >
              Whitepaper
            </a>
            <a 
              href="/updates" 
              className="text-xs text-primary hover:underline font-medium"
            >
              Blog & Updates
            </a>
            <a 
              href="/team" 
              className="text-xs text-primary hover:underline font-medium"
            >
              Meet the Team
            </a>
            <a 
              href="/press" 
              className="text-xs text-primary hover:underline font-medium"
            >
              Press Kit
            </a>
            <a 
              href="/token-metadata" 
              className="text-xs text-primary hover:underline font-medium"
            >
              Token Metadata
            </a>
            <a 
              href="https://solscan.io/token/2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline font-medium"
            >
              View on Solscan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { MessageCircle, Users, Twitter, Shield, TrendingUp, ExternalLink, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/glass-card";
import { useTokenSupply, formatSupply } from "@/hooks/useTokenSupply";
import { Skeleton } from "@/components/ui/skeleton";
import trnCoin from "@/assets/trn-coin.png";

const Footer = () => {
  const contractAddress = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";
  const { data: supplyData, isLoading } = useTokenSupply();

  return (
    <footer className="border-t border-border/50 bg-terrain-dark">
      {/* Transparency Mini Cards */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <GlassCard className="p-4 text-center">
            <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Total Supply</p>
            {isLoading ? (
              <Skeleton className="h-5 w-20 mx-auto" />
            ) : (
              <>
                <p className="font-display text-sm font-bold text-primary">
                  {supplyData ? formatSupply(supplyData.totalSupply, supplyData.decimals) : '—'} TRN
                </p>
                <a
                  href={`https://solscan.io/token/${contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[9px] text-muted-foreground hover:text-primary mt-1"
                >
                  Verify <ExternalLink className="w-2 h-2" />
                </a>
              </>
            )}
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <Shield className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Circulating</p>
            {isLoading ? (
              <Skeleton className="h-5 w-20 mx-auto" />
            ) : (
              <>
                <p className="font-display text-sm font-bold text-primary">
                  {supplyData ? formatSupply(supplyData.circulatingSupply, supplyData.decimals) : '—'} TRN
                </p>
                <a
                  href={`https://solscan.io/token/${contractAddress}#holders`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[9px] text-muted-foreground hover:text-primary mt-1"
                >
                  Verify <ExternalLink className="w-2 h-2" />
                </a>
              </>
            )}
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
              href="https://discord.gg/nX5u8ZaH"
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
            <a
              href="https://terrainvision-ai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              title="Terrain Vision AI"
            >
              <Sparkles className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Bottom: Disclaimer */}
        <div className="mt-4 pt-4 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground max-w-3xl mx-auto mb-3">
            TRN is a utility token that powers platform access and sustainability within the Terrain ecosystem. 
            TRN is not an investment, does not represent equity or ownership, and makes no promises of profit, appreciation, or yield. 
            Cryptocurrency involves significant risk. DYOR.
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Not financial advice. 🌱
          </p>
          <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-3 mt-3">
            <Link 
              to="/risk-disclosure" 
              className="text-xs text-yellow-400 hover:underline font-medium"
            >
              ⚠️ Risk Disclosure
            </Link>
            <Link 
              to="/whitepaper" 
              className="text-xs text-primary hover:underline font-medium"
            >
              Whitepaper
            </Link>
            <Link 
              to="/team" 
              className="text-xs text-primary hover:underline font-medium"
            >
              Team
            </Link>
            <Link 
              to="/transparency" 
              className="text-xs text-primary hover:underline font-medium"
            >
              Transparency
            </Link>
            <Link 
              to="/press" 
              className="text-xs text-primary hover:underline font-medium"
            >
              Press Kit
            </Link>
            <Link 
              to="/token-metadata" 
              className="text-xs text-primary hover:underline font-medium"
            >
              Token Metadata
            </Link>
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
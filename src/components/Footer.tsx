import { MessageCircle, Users, Twitter } from "lucide-react";
import trnCoin from "@/assets/trn-coin.png";

const Footer = () => {
  const contractAddress = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";

  return (
    <footer className="border-t border-border/50 bg-terrain-dark">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Logo + Copyright */}
          <div className="flex items-center gap-3">
            <img src={trnCoin} alt="TRN" className="h-10 w-10" />
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
              href="https://t.me/terraintoken"
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
          <div className="flex items-center justify-center gap-6 mt-3">
            <a 
              href="/earn-trn" 
              className="text-xs text-primary hover:underline font-medium"
            >
              Earn TRN Dashboard
            </a>
            <a 
              href="https://terrainvision-ai.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline font-medium"
            >
              TerrainVision AI
            </a>
            <a 
              href="/upload-project" 
              className="text-xs text-primary hover:underline font-medium"
            >
              Upload & Earn
            </a>
            <a 
              href="https://terrainvision-ai.com/analyze" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline font-medium"
            >
              Analyze Your Yard
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

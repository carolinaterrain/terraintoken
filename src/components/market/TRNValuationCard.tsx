import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, AlertTriangle, ExternalLink, Copy, Check, Flame } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TRN_MINT_ADDRESS } from "@/lib/airdropConstants";

/**
 * NOTE (compliance, May 2026):
 * This card previously rendered an "Intrinsic Value Calculator" that derived a
 * dollar-per-token "fair value" from `annualRevenue * 0.15 + equipment + holders*$50 + waitlist*$10`
 * and compared it to market price as "Undervalued/Overvalued by N%". That model
 * implied a return and is incompatible with $TRN's positioning as a utility/incentive
 * token. The calculator has been removed in its entirety. This component is now a
 * neutral Token-2022 fact panel and is currently not imported anywhere.
 */
export function TRNValuationCard() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(TRN_MINT_ADDRESS);
    setCopied(true);
    toast.success("Contract address copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6 border-primary/30">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          $TRN — Token-2022 Facts
        </h3>
        <Badge variant="outline" className="border-amber-500/40 text-amber-500 text-xs">
          Utility Token · Not an Investment
        </Badge>
      </div>

      <div className="space-y-3 text-sm">
        <Row label="Standard" value="Solana Token-2022" />
        <Row label="Total Supply" value="1,250,000,000 (fixed)" />
        <Row label="Mint Authority" value="Revoked" />
        <Row label="Liquidity Pool" value={<span className="inline-flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500" />Burned</span>} />
        <Row label="Decimals" value="9" />
        <Separator className="my-2" />
        <div>
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Contract Address</div>
          <button
            onClick={handleCopy}
            className="font-mono text-xs text-foreground/80 hover:text-primary transition-colors flex items-center gap-2 break-all text-left w-full"
            aria-label="Copy contract address"
          >
            <span>{TRN_MINT_ADDRESS}</span>
            {copied ? <Check className="w-3 h-3 text-primary flex-shrink-0" /> : <Copy className="w-3 h-3 opacity-50 flex-shrink-0" />}
          </button>
          <a
            href={`https://solscan.io/token/${TRN_MINT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
          >
            Verify on Solscan <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-amber-500">$TRN is a utility/incentive token, not an investment or security.</span>{" "}
          It carries no promise of profit, yield, or return. Nothing on this page is financial advice. Always verify the
          contract address before interacting.
        </p>
      </div>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground text-right">{value}</span>
    </div>
  );
}

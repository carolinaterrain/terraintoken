import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const FinancialDisclosureCard = () => {
  return (
    <Card className="p-6 md:p-8 mb-8 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-2 border-orange-500/50">
      <div className="flex gap-4">
        <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1 animate-pulse" />
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-display text-xl md:text-2xl font-bold text-orange-500">
              ⚠️ CRITICAL DISCLOSURE
            </h3>
            <Badge variant="destructive" className="bg-orange-500/20 text-orange-500 border-orange-500/50">
              Required Reading
            </Badge>
          </div>
          
          <p className="text-base md:text-lg leading-relaxed text-foreground">
            <span className="font-bold text-orange-500">TRN is a speculative meme token.</span> The financial 
            data below pertains to <span className="font-semibold">Carolina Terrain LLC</span>, the real-world 
            drainage business backing the community.
          </p>
          
          <div className="p-4 rounded-lg bg-background/80 border border-orange-500/30">
            <p className="text-center font-bold text-lg text-orange-500">
              Token Performance ≠ Business Performance
            </p>
          </div>
          
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">TRN token ownership does NOT represent:</span> equity 
            in Carolina Terrain LLC, profit-sharing rights, or claims to business assets. The token is a 
            community-driven utility asset designed to incentivize AI training contributions.
          </p>
          
          <p className="text-base font-bold text-orange-500">
            Only invest what you can afford to lose. Not financial advice.
          </p>
        </div>
      </div>
    </Card>
  );
};

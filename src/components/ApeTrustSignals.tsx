import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useFeatureAnalytics } from "@/hooks/useFeatureAnalytics";
import { Badge } from "@/components/ui/badge";

export const ApeTrustSignals = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { trackButtonClick } = useFeatureAnalytics();

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      trackButtonClick('ape_mode_accordion_open', 'trust-signals');
    }
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <Collapsible open={isOpen} onOpenChange={handleToggle}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full max-w-2xl mx-auto h-auto py-6 text-lg font-semibold border-2 hover:border-primary"
          >
            <span className="flex items-center justify-between w-full">
              <span>🛡️ Why won't this rug me? (Tap if you care)</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </span>
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="max-w-2xl mx-auto mt-6 space-y-8">
          {/* Trust Signals */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">✅</div>
              <div className="font-bold mb-1">Fully Doxxed</div>
              <div className="text-sm text-muted-foreground">Real founders, licensed business</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🏢</div>
              <div className="font-bold mb-1">Real Business</div>
              <div className="text-sm text-muted-foreground">7+ years drainage expertise</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🔒</div>
              <div className="font-bold mb-1">No Rug Pull</div>
              <div className="text-sm text-muted-foreground">Backed by actual revenue</div>
            </div>
          </div>

          {/* About TRN */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">What is TRN?</h3>
            <p className="text-muted-foreground">
              <span className="text-primary font-bold">First meme coin backed by a real business.</span> Upload terrain photos, earn TRN tokens instantly. No speculation—just real work, real rewards.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary">Real Utility</Badge>
              <Badge variant="secondary">Earn by Contributing</Badge>
              <Badge variant="secondary">Business Backed</Badge>
            </div>
          </div>

          {/* FAQ - 3 Questions Only */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Quick FAQ</h3>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="font-bold mb-2">🤔 Is this legit?</div>
              <div className="text-sm text-muted-foreground">
                Yes. Run by Carolina Terrain Drainage (7+ years in business). Real company, real founders, real revenue backing the token.
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="font-bold mb-2">💰 How do I earn TRN?</div>
              <div className="text-sm text-muted-foreground">
                Upload photos of drainage projects, terrain issues, or construction sites. AI validates them. You get TRN tokens instantly.
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="font-bold mb-2">🦍 What can I do with TRN?</div>
              <div className="text-sm text-muted-foreground">
                Trade it on DEXs, redeem for real drainage services (up to $10K off), or hold for TerrainScape AI platform access.
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
};

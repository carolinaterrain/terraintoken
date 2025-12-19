import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const EarnHero = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{ 
          background: "radial-gradient(circle at center, hsl(var(--primary) / 0.1), transparent)",
        }}
      />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
            Contribute Data. <span className="text-primary">Earn Credits.</span>
          </h1>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Upload terrain photos to help train our AI. Receive TRN credits for your contribution. No purchase required.
          </p>
          
          {/* Explicit Disclaimer */}
          <div className="inline-flex items-center gap-2 bg-muted/30 border border-border/50 rounded-lg px-4 py-2 mb-8">
            <AlertCircle className="w-4 h-4 text-muted-foreground" />
            <p className="font-body text-xs text-muted-foreground">
              TRN credits have no guaranteed value and are not redeemable for cash.
            </p>
          </div>
          
          <div>
            <Button size="lg" className="font-display" asChild>
              <a href="/upload-project">Start Contributing</a>
            </Button>
            <p className="font-body text-sm text-muted-foreground mt-4">
              Earn credits based on data quality • No wallet required to start
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EarnHero;

import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Clock, Shield, Calculator, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TRN_APY_RATE, TRN_MINT_ADDRESS } from "@/lib/airdropConstants";

export function APYHeroBanner() {
  // Calculate compound growth examples
  const calculateCompoundGrowth = (principal: number, years: number) => {
    const rate = TRN_APY_RATE / 100;
    return principal * Math.pow(1 + rate, years);
  };

  const example10k = {
    initial: 10000,
    year1: calculateCompoundGrowth(10000, 1),
    year3: calculateCompoundGrowth(10000, 3),
    year5: calculateCompoundGrowth(10000, 5),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-terrain-glow/10 to-terrain-purple/10 border-2 border-primary/40"
    >
      {/* Animated background effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--terrain-purple)/0.15),transparent_50%)]" />
        <motion.div
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 p-8 md:p-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: Main APY Display */}
          <div className="text-center lg:text-left">
            <Badge className="mb-4 bg-primary/20 border-primary/50 text-primary text-sm px-4 py-1">
              <Shield className="w-4 h-4 mr-2" />
              Token-2022 Interest-Bearing Extension
            </Badge>
            
            <div className="mb-6">
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block"
              >
                <span className="text-7xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-primary via-terrain-glow to-primary bg-clip-text text-transparent">
                  {TRN_APY_RATE}%
                </span>
              </motion.div>
              <div className="flex items-center justify-center lg:justify-start gap-3 mt-2">
                <span className="text-3xl md:text-4xl font-bold text-foreground">APY</span>
                <Badge variant="outline" className="border-terrain-glow/50 text-terrain-glow animate-pulse">
                  <Sparkles className="w-3 h-3 mr-1" />
                  LIVE
                </Badge>
              </div>
            </div>

            <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto lg:mx-0">
              <strong className="text-foreground">Native yield hardcoded into the token.</strong>{" "}
              No staking. No locking. No complexity. Just hold and earn.
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
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
                  <Calculator className="w-5 h-5" />
                  Read Whitepaper
                </a>
              </Button>
            </div>
          </div>

          {/* Right: Growth Calculator */}
          <div className="bg-background/50 backdrop-blur-sm rounded-xl border border-border/50 p-6">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Long-Term Growth Calculator
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Starting with <span className="font-bold text-primary">10,000 TRN</span>:
            </p>

            <div className="space-y-3">
              {[
                { label: "1 Year", value: example10k.year1, icon: Clock },
                { label: "3 Years", value: example10k.year3, icon: TrendingUp },
                { label: "5 Years", value: example10k.year5, icon: Sparkles },
              ].map((period, idx) => (
                <motion.div
                  key={period.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/5 to-transparent border border-primary/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <period.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{period.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold font-mono text-primary">
                      {period.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} TRN
                    </p>
                    <p className="text-xs text-terrain-glow">
                      +{((period.value - example10k.initial) / example10k.initial * 100).toFixed(0)}% gain
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              * Compound growth projection. Actual results may vary based on market conditions.
            </p>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-8 pt-6 border-t border-border/30 grid grid-cols-3 gap-4 text-center">
          {[
            { label: "Daily Yield", value: `${(TRN_APY_RATE / 365).toFixed(3)}%` },
            { label: "Monthly Yield", value: `${(TRN_APY_RATE / 12).toFixed(2)}%` },
            { label: "Yearly Yield", value: `${TRN_APY_RATE}%` },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl md:text-3xl font-bold font-mono text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

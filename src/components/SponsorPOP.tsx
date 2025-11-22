import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { GlassCard } from "./ui/glass-card";
import { TrendingUp, Shield, Zap, ExternalLink } from "lucide-react";
import { spacing, typography } from "@/lib/spacing";
import popBanner from "@/assets/pop-banner.png";
import popLaptop from "@/assets/pop-laptop.png";

const SponsorPOP = () => {
  return (
    <section className={`${spacing.container.default} ${spacing.section.standard}`}>
      <div className="max-w-6xl mx-auto">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <Badge 
            variant="outline" 
            className="bg-primary/10 border-primary/30 text-primary px-4 py-2 text-sm font-semibold"
          >
            Official Sponsor
          </Badge>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <img 
            src={popBanner} 
            alt="Portfolio Optimizer Pro Logo"
            className="h-12 md:h-16 mx-auto mb-4"
            loading="lazy"
          />
          <h2 className={`${typography.h2} font-display font-bold text-foreground mb-4`}>
            Portfolio Optimizer Pro
          </h2>
          <p className={`${typography.body} text-muted-foreground max-w-3xl mx-auto`}>
            Portfolio Optimizer Pro is an AI-powered portfolio analysis platform built for everyday investors. 
            Unlike traditional finance tools that ignore digital assets, Portfolio Optimizer Pro supports stocks, 
            ETFs, and crypto — making it one of the few optimization engines that can analyze modern portfolios 
            including TRN holdings.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <GlassCard hover className="p-6 md:p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground">
                Crypto-Compatible Portfolio Analysis
              </h3>
              <p className="text-sm text-muted-foreground">
                One of the only portfolio tools that can analyze mixed portfolios with stocks, bonds, AND crypto assets. 
                Check your TRN allocation risk alongside traditional holdings.
              </p>
            </div>
          </GlassCard>

          <GlassCard hover className="p-6 md:p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground">
                60-Second Risk Assessment
              </h3>
              <p className="text-sm text-muted-foreground">
                Get your portfolio's risk score (A–F grade) in under a minute. No signup required. 
                Fully encrypted. Privacy-first by design.
              </p>
            </div>
          </GlassCard>

          <GlassCard hover className="p-6 md:p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground">
                Coming Soon: Pay with TRN
              </h3>
              <p className="text-sm text-muted-foreground">
                TRN holders will soon be able to unlock Deep Portfolio Analysis by paying with tokens. 
                Real utility, real integration.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Visual Showcase */}
        <div className="mb-12 hidden md:block">
          <img 
            src={popLaptop} 
            alt="Portfolio Optimizer Pro Dashboard"
            className="w-full max-w-4xl mx-auto rounded-lg shadow-[0_8px_32px_hsl(var(--primary)/0.2)]"
            loading="lazy"
          />
        </div>

        {/* TRN Integration Callout */}
        <GlassCard className="p-6 md:p-8 mb-8 border-primary/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm font-semibold text-primary mb-1">
                Real Utility, Real Integration
              </p>
              <p className="text-muted-foreground text-sm">
                Even the goblin treasury team uses Portfolio Optimizer Pro to balance drainage equipment 
                investments with crypto holdings. Smart goblins hedge! 💚⛏️
              </p>
            </div>
          </div>
        </GlassCard>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4">
          <Button 
            size="lg"
            variant="default"
            className="font-display font-semibold w-full md:w-auto"
            asChild
          >
            <a 
              href="https://portfoliooptimizerpro.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              Try Portfolio Optimizer Pro
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">
              ✨ No Login Required
            </Badge>
            <span>•</span>
            <span>No credit card</span>
            <span>•</span>
            <span>Instant results</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorPOP;

import { Coins, Gift, ArrowRight, Sparkles } from "lucide-react";
import { GlassCard } from "./ui/glass-card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const RealUtility = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Coins className="w-8 h-8 text-primary" />,
      title: "Redeem for Discounts",
      description: "Hold TRN and get real discounts on Carolina Terrain services",
      tiers: ["Bronze: $50 off", "Silver: $200 off", "Gold: $750 off"],
      cta: "Redeem Now",
      link: "/redeem-trn",
      badge: "Real Savings",
    },
    {
      icon: <Gift className="w-8 h-8 text-primary" />,
      title: "Invoice Rewards",
      description: "Paid a Carolina Terrain invoice? Claim 10,000 TRN instantly",
      benefits: ["Free TRN tokens", "90 days to claim", "One per invoice"],
      cta: "Claim Reward",
      link: "/claim-reward",
      badge: "Free TRN",
    },
  ];

  return (
    <section id="real-utility" className="py-20 px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            Real Utility, Not Just Hype
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            TRN Has <span className="text-primary">Real Value</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlike most meme coins, TRN is backed by actual business utility. Redeem for discounts or claim free tokens.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <GlassCard
              key={index}
              hover
              className="p-8 space-y-6 relative group"
            >
              {/* Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold">
                {feature.badge}
              </div>

              {/* Icon */}
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>

              {/* Details */}
              {feature.tiers && (
                <div className="space-y-2">
                  {feature.tiers.map((tier, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{tier}</span>
                    </div>
                  ))}
                </div>
              )}

              {feature.benefits && (
                <div className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA */}
              <Button
                onClick={() => navigate(feature.link)}
                className="w-full gap-2 group-hover:gap-3 transition-all"
                size="lg"
              >
                {feature.cta}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </GlassCard>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 space-y-4">
          <p className="text-muted-foreground">
            Join the first meme coin with real-world drainage utility
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              variant="outline"
              onClick={() => navigate("/whitepaper")}
              className="gap-2"
            >
              Read Whitepaper
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              onClick={() =>
                window.open(
                  "https://raydium.io/swap/?inputMint=sol&outputMint=2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump",
                  "_blank"
                )
              }
              className="gap-2"
            >
              Get TRN Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealUtility;

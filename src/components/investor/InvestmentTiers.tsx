import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import { motion } from "framer-motion";

export const InvestmentTiers = () => {
  const scrollToForm = () => {
    document.getElementById('investor-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const tiers = [
    {
      name: "Early Supporter",
      tier: "supporter",
      range: "$1K - $10K",
      icon: Zap,
      description: "For crypto traders and community members",
      benefits: [
        "Priority access to Goblin Market upgrades",
        "Holder quest & reward multipliers",
        "Early announcement access",
        "Whitelisting for Marketplace 2026 perks",
        "Community Discord role",
        "Monthly ecosystem updates"
      ],
      color: "from-chart-1 to-chart-2",
      popular: false
    },
    {
      name: "Ecosystem Partner",
      tier: "partner",
      range: "$10K - $100K",
      icon: Star,
      description: "For builders, contractors, and Web3 projects",
      benefits: [
        "All Early Supporter benefits",
        "API priority access",
        "Governance impact on utility expansion",
        "Early access to new tools (FlowCalc, Estimator, FieldVision)",
        "Marketplace rebates in TRN",
        "Quarterly partner calls",
        "Co-marketing opportunities",
        "Custom integration support"
      ],
      color: "from-chart-2 to-chart-3",
      popular: true
    },
    {
      name: "Strategic Allocation",
      tier: "strategic",
      range: "$100K - $1M",
      icon: Crown,
      description: "For structured capital and long-term ecosystem expansion",
      benefits: [
        "All Ecosystem Partner benefits",
        "Quarterly founder briefings",
        "Private utility roadmap access",
        "Long-term vesting allocations",
        "Integration rights across Marketplace 2026",
        "Access to anonymized terrain model datasets",
        "Potential co-branding in future tools",
        "Advisory board consideration",
        "Priority OEM partnership introductions"
      ],
      color: "from-chart-3 to-chart-4",
      popular: false
    }
  ];

  return (
    <section id="investment-tiers" className="py-20 px-4 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
            Investment Tiers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Structured allocation packages designed for different investor profiles and engagement levels
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-chart-2 to-chart-3">
                    Most Popular
                  </Badge>
                )}
                
                <GlassCard 
                  className={`p-8 h-full flex flex-col ${tier.popular ? 'border-primary/40 shadow-xl' : ''}`}
                  hover
                >
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className={`inline-flex p-4 rounded-full bg-gradient-to-br ${tier.color} mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent mb-2">
                      {tier.range}
                    </div>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </div>

                  {/* Benefits */}
                  <div className="flex-1 space-y-3 mb-8">
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-chart-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button 
                    className="w-full"
                    variant={tier.popular ? "default" : "outline"}
                    size="lg"
                    onClick={scrollToForm}
                  >
                    Express Interest
                  </Button>

                  {tier.tier === 'strategic' && (
                    <p className="text-xs text-center text-muted-foreground mt-4">
                      Requires NDA and KYC verification
                    </p>
                  )}
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground max-w-3xl mx-auto">
            All allocations support the growth of the TRN ecosystem including TerrainVision AI development, 
            Marketplace 2026 infrastructure, reward pool expansion, and strategic partnerships. 
            Vesting schedules and specific terms available upon qualification.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
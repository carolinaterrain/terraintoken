import { motion } from "framer-motion";
import { DollarSign, Brain, Sparkles, ExternalLink, CheckCircle, Shield, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { TRN_APY_RATE } from "@/lib/airdropConstants";

const utilityCards = [
  {
    id: "operations",
    icon: DollarSign,
    title: "Licensed NC Contractor",
    subtitle: "Tied to Real Operations",
    description: "$TRN is tied to Carolina Terrain LLC — a licensed North Carolina drainage and stormwater contractor (NC #CL.1872). Business performance does not guarantee token value.",
    features: [
      "Licensed drainage contractor",
      "Active operations since 2019",
      "Public transparency reporting"
    ],
    accentColor: "from-green-500/20 to-emerald-500/10",
    borderColor: "border-green-500/30",
    iconColor: "text-green-500",
    link: "/transparency",
    linkText: "View Transparency Reports"
  },
  {
    id: "ai",
    icon: Brain,
    title: "Terrain Vision AI",
    subtitle: "Intelligent Infrastructure",
    description: "Proprietary AI system analyzing stormwater patterns and optimizing terrain management for precision drainage.",
    features: [
      "Computer vision analysis",
      "Predictive drainage planning",
      "Real-time terrain intelligence"
    ],
    accentColor: "from-terrain-purple/20 to-violet-500/10",
    borderColor: "border-terrain-purple/30",
    iconColor: "text-terrain-purple",
    link: "/ecosystem",
    linkText: "Explore AI Features"
  },
  {
    id: "token2022",
    icon: Sparkles,
    title: "Token-2022 Standard",
    subtitle: "Interest-Bearing Extension Enabled",
    description: "$TRN is deployed under Solana's Token-2022 standard with the interest-bearing extension enabled as a technical property of the mint. This is a feature of the token standard — not a yield, not a promised return.",
    features: [
      "Mint authority revoked",
      "Fixed 1.25B supply",
      "Verifiable on Solscan"
    ],
    accentColor: "from-primary/20 to-cyan-500/10",
    borderColor: "border-primary/30",
    iconColor: "text-primary",
    link: "https://solscan.io/token/Dm7FAcF4kzVgsrn6VPEp2C5bN3tGPkydpWaR26wtDR8m",
    linkText: "Verify on Solscan",
    external: true
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export function UtilityTrustCards() {
  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
          <Shield className="w-3 h-3 mr-1" />
          Trust & Utility
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          What Makes <span className="text-primary">$TRN</span> Different
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A utility/incentive token tied to a licensed NC drainage contractor.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid md:grid-cols-3 gap-6"
      >
        {utilityCards.map((card) => (
          <motion.div key={card.id} variants={cardVariants}>
            <GlassCard className={`h-full relative overflow-hidden ${card.borderColor} hover:border-opacity-60 transition-all duration-300 group`}>
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.accentColor} opacity-50 group-hover:opacity-70 transition-opacity`} />
              
              {/* Content */}
              <div className="relative z-10 p-6 flex flex-col h-full">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.accentColor} border ${card.borderColor} flex items-center justify-center mb-5`}>
                  <card.icon className={`w-7 h-7 ${card.iconColor}`} />
                </div>

                {/* Title */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {card.subtitle}
                  </p>
                  <h3 className="text-xl font-bold text-foreground">
                    {card.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-5 flex-grow">
                  {card.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-5">
                  {card.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`w-4 h-4 ${card.iconColor}`} />
                      <span className="text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Link */}
                <a
                  href={card.link}
                  target={card.external ? "_blank" : undefined}
                  rel={card.external ? "noopener noreferrer" : undefined}
                  className={`inline-flex items-center gap-2 text-sm font-medium ${card.iconColor} hover:underline mt-auto group-hover:gap-3 transition-all`}
                >
                  {card.linkText}
                  {card.external ? (
                    <ExternalLink className="w-4 h-4" />
                  ) : (
                    <TrendingUp className="w-4 h-4" />
                  )}
                </a>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

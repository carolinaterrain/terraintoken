import { GlassCard } from "@/components/ui/glass-card";
import { ArrowUpRight, Eye, ShieldCheck, Hammer } from "lucide-react";

interface EcosystemCard {
  stage: string;
  product: string;
  body: string;
  url: string;
  icon: typeof Eye;
}

const cards: EcosystemCard[] = [
  {
    stage: "Plan",
    product: "Terrain Vision AI",
    body: "AI-powered site analysis that produces evidence-ready scope packages from photos and drone passes.",
    url: "https://terrainvision-ai.com",
    icon: Eye,
  },
  {
    stage: "Comply",
    product: "Stormwater SCM",
    body: "Licensed SCM inspections and compliance documentation. NC License #CL.1872.",
    url: "https://stormwaterscm.com",
    icon: ShieldCheck,
  },
  {
    stage: "Build",
    product: "Carolina Terrain",
    body: "Licensed drainage contractor moving real dirt and water in North Carolina.",
    url: "https://carolinaterrain.com",
    icon: Hammer,
  },
];

export default function EcosystemFlywheel() {
  return (
    <section id="ecosystem" className="py-16 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Part of the <span className="text-primary">Terrain Ecosystem</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            $TRN is the incentive layer of a six-stage flywheel:{" "}
            <span className="text-foreground font-semibold">
              Plan → Build → Monitor → Comply → Train → Incentivize
            </span>
            . Real drainage work feeds real on-chain proof. Real proof earns real rewards.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <a
                key={card.product}
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
                aria-label={`${card.stage} — ${card.product}`}
              >
                <GlassCard
                  hover
                  className="p-6 h-full transition-all group-hover:border-primary/60"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-xs uppercase tracking-widest text-primary font-mono mb-1">
                    {card.stage}
                  </p>
                  <h3 className="font-display text-xl font-bold mb-2">{card.product}</h3>
                  <p className="text-sm text-muted-foreground">{card.body}</p>
                </GlassCard>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

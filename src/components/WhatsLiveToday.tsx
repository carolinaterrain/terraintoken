import { GlassCard } from "@/components/ui/glass-card";
import { CheckCircle2, Hammer } from "lucide-react";

interface StatusItem {
  status: "live" | "building";
  text: string;
}

const items: StatusItem[] = [
  { status: "live", text: "Token deployed on Solana Token-2022. Contract verified, mint revoked, LP burned." },
  { status: "live", text: "15% annual interest-bearing yield active." },
  { status: "live", text: "Carolina Terrain LLC operating as licensed contractor (NC #CL.1872)." },
  { status: "live", text: "Terrain Vision AI live for site analysis." },
  { status: "live", text: "Stormwater SCM live for compliance documentation." },
  { status: "building", text: "Terrain Guard (ICP-based asset registry) — in development." },
  { status: "building", text: "Drainage Academy — content production phase." },
  { status: "building", text: "Terrain Nexus API — unifying backend layer, scaffolded." },
];

const LAST_UPDATED = "May 6, 2026";

export default function WhatsLiveToday() {
  return (
    <section id="status" className="py-16 px-4 relative">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            What's <span className="text-primary">Live Today</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Operational current-state. No future promises — just what's shipped and what's being shipped.
          </p>
        </div>

        <GlassCard className="p-6 md:p-8">
          <ul className="space-y-3">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                {item.status === "live" ? (
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-label="Live" />
                ) : (
                  <Hammer className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" aria-label="In development" />
                )}
                <span className="text-sm md:text-base text-foreground/90">{item.text}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground mt-6 pt-4 border-t border-border font-mono">
            Last updated: {LAST_UPDATED}.
          </p>
        </GlassCard>
      </div>
    </section>
  );
}

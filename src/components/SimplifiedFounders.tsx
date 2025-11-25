import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";
import alexHeadshot from "@/assets/alex-purdy.jpg";
import zachHeadshot from "@/assets/zac-hyman.jpg";

export const SimplifiedFounders = () => {
  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Meet the <span className="text-primary">Founders</span>
          </h2>
          <Badge className="bg-primary/20 border-primary text-primary font-semibold text-sm px-4 py-2">
            <ShieldCheck className="w-4 h-4 mr-2" />
            Fully Doxxed & Licensed
          </Badge>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <GlassCard className="p-6 text-center">
            <img
              src={alexHeadshot}
              alt="Alex Purdy - CEO"
              className="w-32 h-32 rounded-full object-cover border-4 border-primary/40 shadow-[0_0_30px_hsl(var(--primary)/0.3)] mx-auto mb-4"
            />
            <h3 className="font-display text-2xl font-bold mb-1">Alex Purdy</h3>
            <p className="text-muted-foreground mb-2">CEO & Creator</p>
            <Badge className="bg-primary/10 border-primary text-primary font-mono text-xs">
              NC License CL.1872
            </Badge>
            <p className="text-sm text-muted-foreground mt-3">
              Built TerrainVision AI & the entire TRN ecosystem
            </p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <img
              src={zachHeadshot}
              alt="Zac Hyman - COO"
              className="w-32 h-32 rounded-full object-cover border-4 border-primary/40 shadow-[0_0_30px_hsl(var(--primary)/0.3)] mx-auto mb-4"
            />
            <h3 className="font-display text-2xl font-bold mb-1">Zac Hyman</h3>
            <p className="text-muted-foreground mb-2">COO - Operations</p>
            <Badge className="bg-primary/10 border-primary text-primary text-xs">
              Field Operations Lead
            </Badge>
            <p className="text-sm text-muted-foreground mt-3">
              Runs daily operations & coordinates all field work
            </p>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

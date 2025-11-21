import { GlassCard } from "@/components/ui/glass-card";
import { Sparkles } from "lucide-react";

interface GoblinWisdomBoxProps {
  children: React.ReactNode;
}

export const GoblinWisdomBox = ({ children }: GoblinWisdomBoxProps) => {
  return (
    <GlassCard className="p-6 my-8 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/40">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg font-bold text-primary mb-2">
            🧙‍♂️ Goblin Wisdom
          </h4>
          <div className="text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

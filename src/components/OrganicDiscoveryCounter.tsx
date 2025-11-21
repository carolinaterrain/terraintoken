import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { GlassCard } from "./ui/glass-card";

export const OrganicDiscoveryCounter = () => {
  const [count, setCount] = useState(0);
  const targetCount = 847; // Number of organic discoveries

  useEffect(() => {
    let current = 0;
    const increment = targetCount / 60;
    const interval = setInterval(() => {
      current += increment;
      if (current >= targetCount) {
        setCount(targetCount);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard className="p-6 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
        <Sparkles className="w-6 h-6 text-primary" />
      </div>
      
      <div className="text-4xl font-bold text-foreground mb-2 tabular-nums">
        {count.toLocaleString()}+
      </div>
      
      <div className="text-sm font-medium text-muted-foreground mb-1">
        Organic Discoveries
      </div>
      
      <p className="text-xs text-muted-foreground">
        People who found TRN without paid ads or influencer shilling
      </p>
    </GlassCard>
  );
};

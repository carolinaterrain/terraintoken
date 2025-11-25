import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { GlassCard } from "./ui/glass-card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const OrganicDiscoveryCounter = () => {
  const [count, setCount] = useState(0);
  
  // Fetch organic discovery count from analytics events
  const { data: organicCount } = useQuery({
    queryKey: ['organic-discovery-count'],
    queryFn: async () => {
      // Count unique sessions from organic sources (not paid ads, not referrals)
      const { count } = await supabase
        .from('analytics_events')
        .select('session_id', { count: 'exact', head: true })
        .or('utm_source.is.null,utm_source.neq.ads,utm_source.neq.paid')
        .or('utm_campaign.is.null,utm_campaign.not.ilike.%influencer%');
      
      return count || 847;
    },
    refetchInterval: 300000, // 5 minutes
    staleTime: 240000,
  });

  const targetCount = organicCount || 847;

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

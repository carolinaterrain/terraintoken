import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import { Camera, Coins, Users, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export const EcosystemProof = () => {
  const navigate = useNavigate();

  // Fetch contribution stats from edge function (bypasses RLS for accurate counts)
  const { data: stats, isLoading } = useQuery({
    queryKey: ['contribution-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-contribution-stats');
      if (error) throw error;
      return data as {
        photos: number;
        trn_distributed: number;
        contributors: number;
        last_updated: string;
      };
    },
    staleTime: 60000, // Cache for 60 seconds
  });

  return (
    <section className="py-12 bg-gradient-to-b from-primary/5 to-background border-y border-primary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Live Ecosystem Activity</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold">
            Real People. Real Contributions. Real Rewards.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          {/* Photos Contributed */}
          <div className="bg-card/50 backdrop-blur border border-border/50 rounded-xl p-6 text-center hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
              {isLoading ? (
                <Skeleton className="h-10 w-20 mx-auto" />
              ) : (
                <CountUp end={stats?.photos || 0} duration={2} />
              )}
            </div>
            <p className="text-muted-foreground text-sm">Photos Contributed</p>
          </div>

          {/* TRN Distributed */}
          <div className="bg-card/50 backdrop-blur border border-border/50 rounded-xl p-6 text-center hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Coins className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
              {isLoading ? (
                <Skeleton className="h-10 w-24 mx-auto" />
              ) : (
                <><CountUp end={stats?.trn_distributed || 0} duration={2} separator="," /> <span className="text-xl">TRN</span></>
              )}
            </div>
            <p className="text-muted-foreground text-sm">TRN Distributed</p>
          </div>

          {/* Active Contributors */}
          <div className="bg-card/50 backdrop-blur border border-border/50 rounded-xl p-6 text-center hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
              {isLoading ? (
                <Skeleton className="h-10 w-16 mx-auto" />
              ) : (
                <CountUp end={stats?.contributors || 0} duration={2} />
              )}
            </div>
            <p className="text-muted-foreground text-sm">Active Contributors</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/upload')}
            className="group"
          >
            Join Them & Earn TRN
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Contribute terrain photos • Train AI • Earn crypto
          </p>
        </div>
      </div>
    </section>
  );
};

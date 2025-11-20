import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Zap, Brain, Coins, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AnalyzeToEarnHero = () => {
  // Fetch live stats
  const { data: totalUploads } = useQuery({
    queryKey: ['total-uploads'],
    queryFn: async () => {
      const { count } = await supabase
        .from('project_media')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: totalTRN } = useQuery({
    queryKey: ['total-trn'],
    queryFn: async () => {
      const { data } = await supabase
        .from('trn_rewards')
        .select('trn_amount');
      return data?.reduce((sum, r) => sum + Number(r.trn_amount), 0) || 0;
    }
  });

  const { data: activeContributors } = useQuery({
    queryKey: ['active-contributors'],
    queryFn: async () => {
      const { count } = await supabase
        .from('user_stats')
        .select('*', { count: 'exact', head: true })
        .gt('total_uploads', 0);
      return count || 0;
    }
  });

  const valueProp = [
    {
      icon: Zap,
      title: "For Homeowners",
      description: "Get free AI-powered yard analysis + earn crypto rewards for every upload"
    },
    {
      icon: Brain,
      title: "For AI Research",
      description: "Contribute to the world's largest terrain dataset and help train intelligent systems"
    },
    {
      icon: Coins,
      title: "For Crypto",
      description: "Real utility. Real data. Real value. No speculation needed."
    }
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-b from-background to-primary/5">
      <div 
        className="absolute inset-0 opacity-10"
        style={{ background: "radial-gradient(circle at 50% 50%, hsl(142 84% 47% / 0.2), transparent 70%)" }}
      />
      
      <div className="container mx-auto max-w-6xl relative">
        {/* Main Headline */}
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4 leading-tight">
            The First Meme Coin Where Your{" "}
            <span className="text-primary">Yard Problems</span>{" "}
            = Your <span className="text-primary">Rewards</span>
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload photos on TerrainVision AI. Get instant AI analysis. Earn TRN tokens. It's that simple.
          </p>
        </div>

        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {valueProp.map((prop, index) => {
            const Icon = prop.icon;
            return (
              <GlassCard key={index} hover className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{prop.title}</h3>
                <p className="font-body text-sm text-muted-foreground">{prop.description}</p>
              </GlassCard>
            );
          })}
        </div>

        {/* Live Stats */}
        <GlassCard className="p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">Photos Analyzed</p>
              </div>
              <p className="font-display text-4xl font-bold text-primary">
                {totalUploads?.toLocaleString() || '0'}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coins className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">TRN Earned</p>
              </div>
              <p className="font-display text-4xl font-bold text-primary">
                {totalTRN?.toLocaleString() || '0'}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">Active Contributors</p>
              </div>
              <p className="font-display text-4xl font-bold text-primary">
                {activeContributors?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="font-display font-semibold text-lg"
            asChild
          >
            <a
              href="https://terrainvision-ai.com/analyze"
              target="_blank"
              rel="noopener noreferrer"
            >
              🚀 Analyze Your Yard & Earn TRN
            </a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="font-display font-semibold text-lg"
            asChild
          >
            <a href="/earn-trn">
              📊 View Earning Dashboard
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AnalyzeToEarnHero;

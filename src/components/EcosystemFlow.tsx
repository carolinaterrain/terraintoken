import { GlassCard } from "@/components/ui/glass-card";
import { ArrowRight, Upload, Brain, Coins, ShoppingBag, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

const EcosystemFlow = () => {
  // Fetch top contributor
  const { data: topContributor } = useQuery({
    queryKey: ['top-contributor'],
    queryFn: async () => {
      const { data } = await supabase
        .from('terrain_contributors_leaderboard')
        .select('*')
        .order('rank', { ascending: true })
        .limit(1)
        .single();
      return data;
    }
  });

  const steps = [
    {
      icon: Upload,
      title: "Upload Photo",
      description: "Take a pic of your yard on TerrainVision AI",
      color: "from-blue-500/20 to-blue-600/20"
    },
    {
      icon: Brain,
      title: "AI Analyzes",
      description: "Instant drainage/erosion/grading insights",
      color: "from-purple-500/20 to-purple-600/20"
    },
    {
      icon: Coins,
      title: "Earn TRN",
      description: "10-75+ TRN per upload",
      color: "from-green-500/20 to-green-600/20"
    },
    {
      icon: ShoppingBag,
      title: "Spend TRN",
      description: "Premium AI tools, marketplace access",
      color: "from-orange-500/20 to-orange-600/20"
    },
    {
      icon: TrendingUp,
      title: "Ecosystem Grows",
      description: "More data = Better AI = More value",
      color: "from-pink-500/20 to-pink-600/20"
    }
  ];

  const truncateWallet = (wallet: string) => {
    return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-5"
        style={{ background: "var(--terrain-grid)" }}
      />
      
      <div className="container mx-auto max-w-6xl relative">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            The TerrainVision AI × <span className="text-primary">Terrain Token</span> Ecosystem
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            A revolutionary closed-loop system where contribution = value
          </p>
        </div>

        {/* Interactive Visual Flow Diagram */}
        <Card className="p-6 md:p-8 mb-12 bg-card/50 backdrop-blur-sm border-primary/20">
          <h3 className="font-display text-2xl font-bold text-center mb-6">
            Ecosystem Value Loop
          </h3>
          <div className="flex flex-col items-center gap-4 max-w-4xl mx-auto">
            {/* Main Flow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <GlassCard className="p-6 text-center bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/40">
                <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="font-bold mb-1">1. Upload Photo</div>
                <div className="text-xs text-muted-foreground">Yard drainage/erosion pic</div>
              </GlassCard>
              
              <GlassCard className="p-6 text-center bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/40">
                <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="font-bold mb-1">2. AI Analyzes</div>
                <div className="text-xs text-muted-foreground">TerrainVision AI insights</div>
              </GlassCard>
              
              <GlassCard className="p-6 text-center bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/40">
                <Coins className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="font-bold mb-1">3. Earn TRN</div>
                <div className="text-xs text-muted-foreground">10-75+ tokens instantly</div>
              </GlassCard>
            </div>

            {/* Arrows */}
            <div className="flex justify-center items-center gap-2 text-primary">
              <ArrowRight className="w-6 h-6" />
              <div className="text-sm font-semibold">Tokens to Wallet</div>
              <ArrowRight className="w-6 h-6" />
            </div>

            {/* Value Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <GlassCard className="p-6 bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/40">
                <div className="flex items-center gap-3 mb-3">
                  <ShoppingBag className="w-6 h-6 text-orange-400" />
                  <div className="font-bold">Spend TRN</div>
                </div>
                <div className="text-sm text-muted-foreground mb-2">Premium AI features, priority analysis, marketplace access</div>
                <div className="text-xs text-orange-400 font-semibold">→ Generates more training data</div>
              </GlassCard>
              
              <GlassCard className="p-6 bg-gradient-to-br from-pink-500/20 to-pink-600/20 border-pink-500/40">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-6 h-6 text-pink-400" />
                  <div className="font-bold">Hold & Grow</div>
                </div>
                <div className="text-sm text-muted-foreground mb-2">Community member status, better AI = more utility</div>
                <div className="text-xs text-pink-400 font-semibold">→ Ecosystem value increases</div>
              </GlassCard>
            </div>

            {/* Loop Back */}
            <div className="flex items-center justify-center gap-2 text-primary mt-2">
              <div className="text-sm font-semibold">More uploads improve AI quality</div>
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-6 border-t border-border/50 pt-6">
            <span className="font-bold text-primary">Closed-Loop System:</span> Each contribution strengthens the network → Better AI = Higher TRN utility
          </p>
        </Card>

        {/* Flow Diagram Cards */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex items-center gap-4">
                <GlassCard hover className={`p-6 text-center bg-gradient-to-br ${step.color} min-w-[180px]`}>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-sm font-bold mb-1">{step.title}</h3>
                  <p className="font-body text-xs text-muted-foreground">{step.description}</p>
                </GlassCard>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-primary hidden md:block" />
                )}
              </div>
            );
          })}
        </div>

        {/* Live Leaderboard Snippet */}
        {topContributor && (
          <GlassCard className="p-6 max-w-2xl mx-auto mb-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">🏆 Top Contributor This Week</p>
              <p className="font-display text-2xl font-bold text-primary mb-1">
                {truncateWallet(topContributor.user_wallet_address)}
              </p>
              <p className="font-body text-lg text-muted-foreground">
                {topContributor.total_trn_earned?.toLocaleString() || 0} TRN earned
              </p>
            </div>
          </GlassCard>
        )}

        {/* Goblin Testimonial */}
        <GlassCard className="p-8 max-w-3xl mx-auto bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
          <div className="text-center">
            <p className="font-display text-xl md:text-2xl font-bold mb-4 text-primary">
              "Other tokens make you wait for pumps. TRN makes you EARN by uploading pics of yer soggy yard! ⛏️💚"
            </p>
            <p className="text-sm text-muted-foreground">— The Terrain Goblin</p>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

export default EcosystemFlow;

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

        {/* Interactive Mermaid Flow Diagram */}
        <Card className="p-6 md:p-8 mb-12 bg-card/50 backdrop-blur-sm border-primary/20">
          <h3 className="font-display text-2xl font-bold text-center mb-6">
            Interactive Ecosystem Flow
          </h3>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <pre className="text-xs">
{`graph TD
    A[👤 User Uploads Photo] -->|TerrainVision AI| B(🧠 AI Analyzes Image)
    B -->|Drainage/Erosion/Grading| C{✅ Quality Check}
    C -->|✓ Pass| D[💰 Earn 10-75+ TRN]
    C -->|✗ Fail| E[🔄 Resubmit Better Photo]
    D -->|Tokens Sent| F[👛 User Wallet]
    F -->|💎 Spend TRN| G[🛒 Premium AI Features]
    F -->|🤝 Hold| H[📊 Community Member]
    G -->|📈 Usage Data| B
    H -->|🔁 More Uploads| A
    E -->|📸 New Upload| A`}
              </pre>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Each upload trains the AI → Better AI = More value for TRN holders
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

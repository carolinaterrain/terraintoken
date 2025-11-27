import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Shield, Users, Rocket, Activity } from "lucide-react";
import { useTokenStats } from "@/hooks/useTokenStats";
import { useLiveHolderCount } from "@/hooks/useLiveHolderCount";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CountUp from "react-countup";
import { motion } from "framer-motion";

export const InvestorHero = () => {
  const { data: tokenStats } = useTokenStats();
  const { data: holderData } = useLiveHolderCount();

  // Get actual TRN rewards count from database
  const { data: rewardsCount } = useQuery({
    queryKey: ['trn-rewards-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('trn_rewards')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    {
      label: "Token Holders",
      value: holderData?.holderCount || 0,
      prefix: "",
      icon: Users,
      color: "text-chart-1"
    },
    {
      label: "Market Cap",
      value: tokenStats?.marketCap || 0,
      prefix: "$",
      icon: TrendingUp,
      color: "text-chart-2",
      decimals: 0
    },
    {
      label: "TRN Rewards Issued",
      value: rewardsCount || 0,
      prefix: "",
      icon: Rocket,
      color: "text-chart-3",
      suffix: ""
    },
    {
      label: "License",
      value: "CL.1872",
      icon: Shield,
      color: "text-chart-4",
      isText: true
    }
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-5xl mx-auto space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge variant="secondary" className="mb-4 text-sm px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              First-Mover in Terrain Intelligence
            </Badge>
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent leading-tight">
            Invest in the First Terrain-Intelligence Token Ecosystem
          </h1>

          {/* Subline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            TRN powers the tools, rewards, and data layers behind <span className="text-primary font-semibold">TerrainVision AI</span>, <span className="text-chart-2 font-semibold">Goblin Market</span>, and the emerging <span className="text-chart-3 font-semibold">Terrain Data Marketplace</span>. A real-product ecosystem backed by contractor-validated workflows, AI tools, and expanding user activity.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center pt-6">
            <Button 
              size="lg" 
              className="text-lg px-8"
              onClick={() => scrollToSection('investment-tiers')}
            >
              Discover TRN Utility
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8"
              onClick={() => scrollToSection('tokenomics')}
            >
              View Tokenomics
            </Button>
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8"
              onClick={() => scrollToSection('investor-form')}
            >
              Request Investor Brief
            </Button>
          </div>

          {/* Live Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <GlassCard key={index} className="p-6 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                    <div className="space-y-1">
                      <div className="text-2xl md:text-3xl font-bold">
                        {stat.isText ? (
                          stat.value
                        ) : (
                          <>
                            {stat.prefix}
                            <CountUp
                              end={stat.value as number}
                              duration={2.5}
                              separator=","
                              decimals={stat.decimals || 0}
                            />
                            {stat.suffix}
                          </>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </motion.div>

          {/* Credibility badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3 justify-center pt-8 text-sm text-muted-foreground"
          >
            <Badge variant="outline" className="gap-2">
              <Shield className="w-4 h-4 text-chart-1" />
              Carolina Terrain — NC Licensed
            </Badge>
            <Badge variant="outline" className="gap-2">
              <Activity className="w-4 h-4 text-chart-2" />
              NDS Certified
            </Badge>
            <Badge variant="outline" className="gap-2">
              <TrendingUp className="w-4 h-4 text-chart-3" />
              Smart Contract Verified
            </Badge>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
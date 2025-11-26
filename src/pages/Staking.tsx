import { Helmet } from "react-helmet-async";
import { TrendingUp, Flame, Trophy } from "lucide-react";
import ScrollProgress from "@/components/ScrollProgress";
import BackToHome from "@/components/BackToHome";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";
import { StakingPools } from "@/components/staking/StakingPools";
import { StakingStats } from "@/components/staking/StakingStats";
import { Card } from "@/components/ui/card";

const Staking = () => {
  return (
    <>
      <Helmet>
        <title>Stake TRN - Earn Rewards & Burn Tokens | Terrain Token</title>
        <meta 
          name="description" 
          content="Stake TRN in prediction markets, contests, and governance. Earn rewards while burning tokens to reduce supply!" 
        />
      </Helmet>

      <ScrollProgress />
      <DesktopNav />
      
      <main className="min-h-screen bg-gradient-to-b from-background to-background/50 pt-16">
        <BackToHome />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-gradient-to-r from-primary/20 to-accent/20">
                <TrendingUp className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Stake TRN & Earn
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              Put your TRN to work in prediction markets, contests, and governance
            </p>
          </div>

          {/* Stats Overview */}
          <StakingStats />

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Win big by staking on price predictions, contests, and community challenges
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <Flame className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Token Burns</h3>
              <p className="text-sm text-muted-foreground">
                30% of all stakes are burned, reducing supply and increasing scarcity
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Treasury Growth</h3>
              <p className="text-sm text-muted-foreground">
                20% goes to treasury to fund development and community rewards
              </p>
            </Card>
          </div>

          {/* Staking Pools */}
          <StakingPools />
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Staking;

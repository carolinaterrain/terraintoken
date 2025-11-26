import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ShoppingBag, Zap, TrendingUp, Gift, Sparkles } from "lucide-react";
import ScrollProgress from "@/components/ScrollProgress";
import BackToHome from "@/components/BackToHome";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";
import { ShopItemCard } from "@/components/shop/ShopItemCard";
import { MysteryBoxSection } from "@/components/shop/MysteryBoxSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnergyPurchaseModal } from "@/components/energy/EnergyPurchaseModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useWallet } from "@solana/wallet-adapter-react";

const GoblinShop = () => {
  const [showEnergyModal, setShowEnergyModal] = useState(false);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const walletAddress = publicKey?.toString();

  const SHOP_ITEMS = {
    boosts: [
      {
        id: 'xp_boost_2x',
        name: '2x XP Boost',
        description: 'Double XP for 24 hours',
        trnCost: 100,
        duration: '24h',
        icon: TrendingUp,
      },
      {
        id: 'xp_boost_5x',
        name: '5x XP Boost',
        description: 'Quintu XP for 24 hours',
        trnCost: 400,
        duration: '24h',
        icon: Sparkles,
      },
    ],
    mysteryBoxes: [
      {
        id: 'bronze_box',
        name: 'Bronze Mystery Box',
        description: 'Common rewards: 50-200 TRN',
        trnCost: 50,
        icon: Gift,
      },
      {
        id: 'silver_box',
        name: 'Silver Mystery Box',
        description: 'Uncommon rewards: 200-1000 TRN',
        trnCost: 200,
        icon: Gift,
      },
      {
        id: 'gold_box',
        name: 'Gold Mystery Box',
        description: 'Rare rewards: 1000-5000 TRN',
        trnCost: 1000,
        icon: Gift,
      },
    ],
    passes: [
      {
        id: 'season_pass_q1',
        name: 'Q1 Season Pass',
        description: 'Exclusive rewards, badges, and bonuses for 3 months',
        trnCost: 5000,
        duration: '90 days',
        icon: Sparkles,
      },
    ],
  };

  const handlePurchase = async (itemId: string, itemType: string, trnCost: number) => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to make purchases.",
        variant: "destructive",
      });
      return;
    }

    setPurchasing(itemId);

    try {
      const { data, error } = await supabase
        .from('gamification_purchases')
        .insert({
          user_wallet: walletAddress,
          item_type: itemType,
          item_name: itemId,
          trn_cost: trnCost,
          trn_burned: trnCost * 0.3, // 30% burn
        })
        .select()
        .single();

      if (error) throw error;

      // Record burn
      await supabase.from('token_burns').insert({
        burn_source: 'gamification',
        burn_amount: trnCost * 0.3,
        user_wallet: walletAddress,
        related_transaction_id: data.id,
      });

      toast({
        title: "Purchase Successful! 🎉",
        description: `You received your ${itemId}! ${trnCost * 0.3} TRN burned! 🔥`,
      });
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to complete purchase",
        variant: "destructive",
      });
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Goblin Shop - Buy Energy, Boosts & More | Terrain Token</title>
        <meta 
          name="description" 
          content="Purchase energy, XP boosts, mystery boxes, and season passes with TRN tokens. Power up your terrain analysis journey!" 
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
                <ShoppingBag className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Goblin Shop 🛒
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Power up your terrain analysis with energy packs, boosts, and exclusive items!
            </p>
          </div>

          <Tabs defaultValue="energy" className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-8">
              <TabsTrigger value="energy">Energy</TabsTrigger>
              <TabsTrigger value="boosts">Boosts</TabsTrigger>
              <TabsTrigger value="boxes">Mystery Boxes</TabsTrigger>
              <TabsTrigger value="passes">Season Pass</TabsTrigger>
            </TabsList>

            <TabsContent value="energy" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Energy Packs ⚡</h2>
                <p className="text-muted-foreground">
                  Keep analyzing terrain with instant energy refills. 50% of TRN spent is burned!
                </p>
              </div>
              <div className="flex justify-center">
                <Button size="lg" onClick={() => setShowEnergyModal(true)}>
                  <Zap className="h-5 w-5 mr-2" />
                  Buy Energy Packs
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="boosts">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">XP Boosts 🚀</h2>
                <p className="text-muted-foreground">
                  Level up faster with temporary XP multipliers
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {SHOP_ITEMS.boosts.map((item) => (
                  <Card key={item.id} className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-full bg-primary/20">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        <p className="text-sm text-muted-foreground">Duration: {item.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{item.trnCost} TRN</span>
                      <Button 
                        onClick={() => handlePurchase(item.id, 'xp_boost', item.trnCost)}
                        disabled={purchasing === item.id}
                      >
                        {purchasing === item.id ? 'Processing...' : 'Purchase'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="boxes">
              <MysteryBoxSection />
            </TabsContent>

            <TabsContent value="passes">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Season Pass ✨</h2>
                <p className="text-muted-foreground">
                  Unlock exclusive rewards and benefits for the entire season
                </p>
              </div>
              <div className="max-w-2xl mx-auto">
                {SHOP_ITEMS.passes.map((item) => (
                  <Card key={item.id} className="p-8 bg-gradient-to-br from-primary/10 to-accent/10">
                    <div className="text-center mb-6">
                      <div className="flex justify-center mb-4">
                        <div className="p-4 rounded-full bg-gradient-to-r from-primary/30 to-accent/30">
                          <item.icon className="h-12 w-12 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                      <p className="text-4xl font-bold mb-2">{item.trnCost} TRN</p>
                      <p className="text-sm text-muted-foreground mb-6">Valid for {item.duration}</p>
                      <Button 
                        size="lg"
                        onClick={() => handlePurchase(item.id, 'season_pass', item.trnCost)}
                        disabled={purchasing === item.id}
                      >
                        {purchasing === item.id ? 'Processing...' : 'Purchase Season Pass'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />

      <EnergyPurchaseModal 
        open={showEnergyModal}
        onClose={() => setShowEnergyModal(false)}
        walletAddress={walletAddress}
      />
    </>
  );
};

export default GoblinShop;

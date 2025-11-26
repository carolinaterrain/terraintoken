import { useState, useEffect } from "react";
import { Gift, Sparkles, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MysteryBox {
  id: string;
  box_tier: string;
  trn_cost: number;
  possible_rewards: any;
  rarity_weights: any;
  available_count: number;
}

export const MysteryBoxSection = () => {
  const [boxes, setBoxes] = useState<MysteryBox[]>([]);
  const [opening, setOpening] = useState(false);
  const [rewardModal, setRewardModal] = useState<any>(null);
  const { toast } = useToast();
  const { publicKey } = useWallet();

  useEffect(() => {
    fetchBoxes();
  }, []);

  const fetchBoxes = async () => {
    const { data } = await supabase
      .from('mystery_boxes')
      .select('*')
      .eq('is_active', true);
    
    if (data) setBoxes(data);
  };

  const openBox = async (box: MysteryBox) => {
    if (!publicKey) {
      toast({
        title: "Wallet Required",
        description: "Connect your wallet to open mystery boxes.",
        variant: "destructive",
      });
      return;
    }

    setOpening(true);
    try {
      // Simulate reward generation (in production, this would be done server-side)
      const rewards = box.possible_rewards as any[];
      const randomReward = rewards[Math.floor(Math.random() * rewards.length)];

      const { data, error } = await supabase.from('mystery_box_opens').insert({
        user_wallet: publicKey.toString(),
        box_id: box.id,
        reward_type: randomReward.type,
        reward_value: randomReward.value,
        trn_paid: box.trn_cost,
        reward_data: randomReward,
      }).select().single();

      if (error) throw error;

      setRewardModal(randomReward);
      
      toast({
        title: "Mystery Box Opened! 🎉",
        description: `You received: ${randomReward.name}!`,
      });
    } catch (error: any) {
      console.error('Box opening error:', error);
      toast({
        title: "Failed to Open Box",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setOpening(false);
    }
  };

  return (
    <>
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Gift className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-3xl font-bold">Mystery Boxes</h2>
            <p className="text-muted-foreground">Open for random rewards!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {boxes.map((box) => (
            <Card key={box.id} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                  <Gift className="h-12 w-12 text-primary" />
                </div>
              </div>

              <Badge className="mb-2">{box.box_tier.toUpperCase()}</Badge>
              <h3 className="font-bold text-xl mb-2">{box.box_tier} Box</h3>
              
              <div className="mb-4">
                <p className="text-3xl font-bold text-primary">{box.trn_cost} TRN</p>
                {box.available_count > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {box.available_count} remaining
                  </p>
                )}
              </div>

              <div className="mb-4 text-sm text-muted-foreground space-y-1">
                <p>🎁 Random rewards</p>
                <p>✨ Rare items possible</p>
                <p>🔥 Instant reveal</p>
              </div>

              <Button 
                onClick={() => openBox(box)}
                disabled={opening || (box.available_count === 0)}
                className="w-full"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {opening ? 'Opening...' : 'Open Box'}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!rewardModal} onOpenChange={() => setRewardModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              🎉 You Won!
            </DialogTitle>
          </DialogHeader>
          
          {rewardModal && (
            <div className="text-center py-6">
              <div className="flex justify-center mb-4">
                <div className="p-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                  <Zap className="h-16 w-16 text-primary" />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold mb-2">{rewardModal.name}</h3>
              <p className="text-xl text-primary mb-4">
                {rewardModal.value} {rewardModal.type}
              </p>
              <p className="text-sm text-muted-foreground">
                {rewardModal.description}
              </p>
              
              <Button onClick={() => setRewardModal(null)} className="mt-6">
                Awesome!
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

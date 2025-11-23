import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Share2, Copy, Gift, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReferralSystemProps {
  walletAddress?: string;
}

export const ReferralSystem = ({ walletAddress }: ReferralSystemProps) => {
  const [referralCode, setReferralCode] = useState<string>("");
  const [stats, setStats] = useState({ totalReferrals: 0, totalBonus: 0 });
  const { toast } = useToast();

  useEffect(() => {
    if (walletAddress) {
      loadReferralData();
    }
  }, [walletAddress]);

  const loadReferralData = async () => {
    if (!walletAddress) return;

    const { data } = await supabase
      .from("referral_codes")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single();

    if (data) {
      setReferralCode(data.referral_code);
      setStats({
        totalReferrals: data.total_referrals,
        totalBonus: data.total_bonus_trn,
      });
    }
  };

  const generateReferralCode = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Connect your wallet to generate a referral code",
        variant: "destructive",
      });
      return;
    }

    const code = `GOBLIN-${walletAddress.slice(0, 6).toUpperCase()}`;

    const { error } = await supabase.from("referral_codes").insert({
      wallet_address: walletAddress,
      referral_code: code,
    });

    if (error) {
      if (error.code === "23505") {
        // Already exists
        loadReferralData();
      } else {
        toast({
          title: "Error",
          description: "Failed to generate referral code",
          variant: "destructive",
        });
      }
    } else {
      setReferralCode(code);
      toast({
        title: "Referral Code Generated!",
        description: "Share it to earn 1% of every purchase",
      });
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/goblin-market?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied!",
      description: "Share with your goblin friends",
    });
  };

  const shareReferral = async () => {
    const link = `${window.location.origin}/goblin-market?ref=${referralCode}`;
    
    if (navigator.share) {
      await navigator.share({
        title: "Join the Goblin Market!",
        text: `Use my referral code and get 2% bonus TRN on your first purchase! 🟢`,
        url: link,
      });
    } else {
      copyReferralLink();
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-green/40">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-goblin-green flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Referral Rewards
          </h3>
          <Badge variant="outline" className="bg-goblin-green/20 text-goblin-green border-goblin-green">
            Earn 1% + Friend gets 2%
          </Badge>
        </div>

        {!walletAddress ? (
          <div className="text-center py-6 text-muted-foreground">
            Connect your wallet to access referral system
          </div>
        ) : !referralCode ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate your unique referral code and earn TRN for every friend who buys!
            </p>
            <Button
              onClick={generateReferralCode}
              className="bg-gradient-to-r from-goblin-green to-terrain-purple"
            >
              <Gift className="w-4 h-4 mr-2" />
              Generate Referral Code
            </Button>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-terrain-shadow/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <Users className="w-3 h-3" />
                  Referrals
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {stats.totalReferrals}
                </div>
              </div>
              <div className="bg-terrain-shadow/50 p-3 rounded-lg">
                <div className="text-muted-foreground text-xs mb-1">
                  Total Earned
                </div>
                <div className="text-2xl font-bold text-goblin-green">
                  {(stats.totalBonus / 1000000).toFixed(2)}M
                </div>
              </div>
            </div>

            {/* Referral Code */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Your Referral Code
              </label>
              <div className="flex gap-2">
                <Input
                  value={referralCode}
                  readOnly
                  className="font-mono font-bold bg-terrain-shadow"
                />
                <Button
                  onClick={copyReferralLink}
                  variant="outline"
                  size="icon"
                  className="border-goblin-green/40"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Share Button */}
            <Button
              onClick={shareReferral}
              className="w-full bg-gradient-to-r from-goblin-green to-terrain-purple"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Referral Link
            </Button>

            {/* How It Works */}
            <div className="bg-terrain-shadow/30 p-3 rounded-lg text-xs space-y-2">
              <div className="font-bold text-goblin-gold">How It Works:</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Your friend gets 2% bonus TRN on their purchase</li>
                <li>• You earn 1% of their purchase amount</li>
                <li>• No limits on referrals!</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

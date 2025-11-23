import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Copy, Share2, Trophy, Gift, Users, DollarSign } from "lucide-react";
import BackToHome from "@/components/BackToHome";

interface ReferralStats {
  totalEarned: number;
  pendingTRN: number;
  waitlistSignups: number;
  trnPurchases: number;
  serviceBookings: number;
}

interface LeaderboardEntry {
  referrer_code: string;
  total_earned: number;
  rank: number;
}

export default function ReferralDashboard() {
  const [userEmail, setUserEmail] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [stats, setStats] = useState<ReferralStats>({
    totalEarned: 0,
    pendingTRN: 0,
    waitlistSignups: 0,
    trnPurchases: 0,
    serviceBookings: 0,
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    loadUserData();
    loadLeaderboard();
  }, []);

  const loadUserData = async () => {
    // Get user's waitlist entry to find their referral code
    const email = prompt("Enter your email to view your referral dashboard:");
    if (!email) return;

    setUserEmail(email);

    const { data: waitlistEntry } = await supabase
      .from("terrainscape_waitlist")
      .select("referral_code")
      .eq("email", email)
      .single();

    if (waitlistEntry) {
      setReferralCode(waitlistEntry.referral_code);
      loadReferralStats(waitlistEntry.referral_code);
    } else {
      toast.error("Email not found in waitlist");
    }
  };

  const loadReferralStats = async (code: string) => {
    const { data: rewards } = await supabase
      .from("referral_rewards")
      .select("*")
      .eq("referrer_code", code);

    if (rewards) {
      const approved = rewards.filter(r => r.status === "paid");
      const pending = rewards.filter(r => r.status === "pending" || r.status === "approved");

      setStats({
        totalEarned: approved.reduce((sum, r) => sum + r.trn_amount, 0),
        pendingTRN: pending.reduce((sum, r) => sum + r.trn_amount, 0),
        waitlistSignups: rewards.filter(r => r.reward_type === "waitlist_signup").length,
        trnPurchases: rewards.filter(r => r.reward_type === "trn_purchase").length,
        serviceBookings: rewards.filter(r => r.reward_type === "service_booking").length,
      });
    }
  };

  const loadLeaderboard = async () => {
    // Mock leaderboard - in production, create a SQL view for this
    const { data: rewards } = await supabase
      .from("referral_rewards")
      .select("referrer_code, trn_amount")
      .eq("status", "paid");

    if (rewards) {
      const grouped = rewards.reduce((acc, r) => {
        acc[r.referrer_code] = (acc[r.referrer_code] || 0) + r.trn_amount;
        return acc;
      }, {} as Record<string, number>);

      const sorted = Object.entries(grouped)
        .map(([code, total], idx) => ({
          referrer_code: code,
          total_earned: total,
          rank: idx + 1,
        }))
        .sort((a, b) => b.total_earned - a.total_earned)
        .slice(0, 10);

      setLeaderboard(sorted);

      // Find user's rank
      const userEntry = sorted.find(e => e.referrer_code === referralCode);
      if (userEntry) setUserRank(userEntry.rank);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success("Referral link copied!");
  };

  const shareOnX = () => {
    const link = `${window.location.origin}/?ref=${referralCode}`;
    const text = `Join the TRN community and get rewarded! 🚀 Sign up with my referral link:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`, "_blank");
  };

  return (
    <>
      <Helmet>
        <title>Referral Dashboard - Earn TRN | Terrain Token</title>
        <meta name="description" content="Refer friends to TRN and earn rewards. Track your earnings and climb the leaderboard." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <BackToHome />
        </div>

        <main className="container mx-auto px-4 pb-20 space-y-8">
          {/* Hero */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-6xl font-bold font-display bg-gradient-to-r from-goblin-green via-goblin-gold to-terrain-purple bg-clip-text text-transparent">
              🎁 Refer & Earn TRN
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Share your unique referral link and earn TRN tokens when friends join the waitlist, buy TRN, or book services.
            </p>
          </div>

          {/* Referral Link */}
          {referralCode && (
            <Card className="p-6 border-goblin-gold/30">
              <h3 className="text-lg font-bold mb-4">Your Referral Link</h3>
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}/?ref=${referralCode}`}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button onClick={copyReferralLink} variant="outline">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button onClick={shareOnX} variant="default" className="bg-goblin-green text-black hover:bg-goblin-green/80">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share on X
                </Button>
              </div>
            </Card>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-goblin-green/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-goblin-green" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total TRN Earned</div>
                  <div className="text-3xl font-bold text-goblin-green">{stats.totalEarned.toLocaleString()}</div>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-goblin-gold/20 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-goblin-gold" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Pending TRN</div>
                  <div className="text-3xl font-bold text-goblin-gold">{stats.pendingTRN.toLocaleString()}</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Referral Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Referral Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Waitlist Signups (5,000 TRN each)</span>
                <Badge variant="outline">{stats.waitlistSignups} referrals = {stats.waitlistSignups * 5000} TRN</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">TRN Purchases (10,000 TRN each)</span>
                <Badge variant="outline">{stats.trnPurchases} referrals = {stats.trnPurchases * 10000} TRN</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Service Bookings (25,000 TRN each)</span>
                <Badge variant="outline">{stats.serviceBookings} referrals = {stats.serviceBookings * 25000} TRN</Badge>
              </div>
            </div>
          </Card>

          {/* Reward Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 border-goblin-green/30">
              <div className="text-center space-y-3">
                <div className="text-4xl">🥉</div>
                <div className="text-sm text-muted-foreground">Level 1</div>
                <div className="text-2xl font-bold text-goblin-green">5,000 TRN</div>
                <div className="text-sm">Friend joins waitlist</div>
              </div>
            </Card>
            <Card className="p-6 border-goblin-gold/30">
              <div className="text-center space-y-3">
                <div className="text-4xl">🥈</div>
                <div className="text-sm text-muted-foreground">Level 2</div>
                <div className="text-2xl font-bold text-goblin-gold">10,000 TRN</div>
                <div className="text-sm">Friend buys TRN</div>
              </div>
            </Card>
            <Card className="p-6 border-terrain-purple/30">
              <div className="text-center space-y-3">
                <div className="text-4xl">🥇</div>
                <div className="text-sm text-muted-foreground">Level 3</div>
                <div className="text-2xl font-bold text-terrain-purple">25,000 TRN</div>
                <div className="text-sm">Friend books service</div>
              </div>
            </Card>
          </div>

          {/* Leaderboard */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-goblin-gold" />
              Top Referrers
            </h3>
            <div className="space-y-2">
              {leaderboard.map((entry, idx) => (
                <div
                  key={entry.referrer_code}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    entry.referrer_code === referralCode ? "bg-goblin-gold/10 border border-goblin-gold/30" : "bg-muted/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}</div>
                    <div className="font-mono text-sm">
                      {entry.referrer_code === referralCode ? "You" : `User #${entry.referrer_code.slice(0, 8)}`}
                    </div>
                  </div>
                  <div className="font-bold text-goblin-gold">{entry.total_earned.toLocaleString()} TRN</div>
                </div>
              ))}
            </div>
            {userRank && userRank > 10 && (
              <div className="mt-4 p-3 bg-muted/20 rounded-lg text-center">
                <span className="text-sm text-muted-foreground">Your rank: #{userRank}</span>
              </div>
            )}
          </Card>
        </main>
      </div>
    </>
  );
}

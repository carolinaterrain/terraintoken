import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, Share2, Trophy, Mail, DollarSign, Gift } from "lucide-react";
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
  const [email, setEmail] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [isEmailSet, setIsEmailSet] = useState(false);
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
    const storedEmail = localStorage.getItem("referral_email");
    if (storedEmail) {
      setEmail(storedEmail);
      setIsEmailSet(true);
      loadUserData(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (isEmailSet && referralCode) {
      loadLeaderboard();
    }
  }, [isEmailSet, referralCode]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    localStorage.setItem("referral_email", emailInput);
    setEmail(emailInput);
    setIsEmailSet(true);
    loadUserData(emailInput);
  };

  const handleChangeEmail = () => {
    setIsEmailSet(false);
    setEmailInput("");
    setReferralCode("");
    setStats({
      totalEarned: 0,
      pendingTRN: 0,
      waitlistSignups: 0,
      trnPurchases: 0,
      serviceBookings: 0,
    });
    localStorage.removeItem("referral_email");
  };

  async function loadUserData(userEmail: string) {
    try {
      const { data, error } = await supabase
        .from("terrainscape_waitlist")
        .select("referral_code")
        .eq("email", userEmail)
        .single();

      if (error) throw error;

      if (data) {
        setReferralCode(data.referral_code);
        await loadReferralStats(data.referral_code);
      } else {
        toast.error("Email not found in waitlist");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Failed to load your referral data");
    }
  }

  async function loadReferralStats(code: string) {
    try {
      const { data, error } = await supabase
        .from("referral_rewards")
        .select("*")
        .eq("referrer_code", code);

      if (error) throw error;

      if (data) {
        const approved = data.filter((r) => r.status === "paid");
        const pending = data.filter((r) => r.status === "pending" || r.status === "approved");

        setStats({
          totalEarned: approved.reduce((sum, r) => sum + r.trn_amount, 0),
          pendingTRN: pending.reduce((sum, r) => sum + r.trn_amount, 0),
          waitlistSignups: data.filter((r) => r.reward_type === "waitlist_signup").length,
          trnPurchases: data.filter((r) => r.reward_type === "trn_purchase").length,
          serviceBookings: data.filter((r) => r.reward_type === "service_booking").length,
        });
      }
    } catch (error) {
      console.error("Error loading referral stats:", error);
      toast.error("Failed to load referral statistics");
    }
  }

  async function loadLeaderboard() {
    try {
      const { data, error } = await supabase
        .from("referral_rewards")
        .select("referrer_code, trn_amount")
        .eq("status", "paid");

      if (error) throw error;

      if (data) {
        const grouped = data.reduce((acc, r) => {
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

        const userEntry = sorted.find((e) => e.referrer_code === referralCode);
        if (userEntry) setUserRank(userEntry.rank);
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    }
  }

  function copyReferralLink() {
    const link = `${window.location.origin}/?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success("Referral link copied to clipboard!");
  }

  function shareOnX() {
    const link = `${window.location.origin}/?ref=${referralCode}`;
    const text = encodeURIComponent(
      `Join me on TerrainScape and earn TRN tokens! Use my referral link:`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${link}`, "_blank");
  }

  if (!isEmailSet) {
    return (
      <>
        <Helmet>
          <title>Referral Dashboard - Earn TRN | Terrain Token</title>
          <meta name="description" content="Refer friends to TRN and earn rewards. Track your earnings and climb the leaderboard." />
        </Helmet>
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <BackToHome />
            
            <div className="text-center mb-8 mt-12">
              <Mail className="w-16 h-16 mx-auto mb-4 text-goblin-gold" />
              <h1 className="text-4xl font-bold mb-2">Access Your Referral Dashboard</h1>
              <p className="text-muted-foreground">
                Enter your email to view your referral stats and earnings
              </p>
            </div>

            <Card className="border-goblin-gold/30">
              <CardHeader>
                <CardTitle>Enter Your Email</CardTitle>
                <CardDescription>
                  This is the email you used to join the TerrainScape waitlist
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Access Dashboard
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Referral Dashboard - Earn TRN | Terrain Token</title>
        <meta name="description" content="Refer friends to TRN and earn rewards. Track your earnings and climb the leaderboard." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <BackToHome />
            <Button variant="outline" size="sm" onClick={handleChangeEmail}>
              Change Email
            </Button>
          </div>
        </div>

        <main className="container mx-auto px-4 pb-20 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-6xl font-bold font-display bg-gradient-to-r from-goblin-green via-goblin-gold to-terrain-purple bg-clip-text text-transparent">
              🎁 Refer & Earn TRN
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Logged in as: {email}
            </p>
          </div>

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

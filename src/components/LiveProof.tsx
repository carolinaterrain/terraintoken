import { GlassCard } from "@/components/ui/glass-card";
import { Clock, Mail, Wallet, CheckCircle2, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const LiveProof = () => {
  // Waitlist form state
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  // Recent activity feed
  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const { data } = await supabase
        .from('project_media')
        .select('user_wallet_address, trn_earned, category, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    }
  });

  // TRN distribution over last 7 days
  const { data: weeklyData } = useQuery({
    queryKey: ['weekly-trn-distribution'],
    queryFn: async () => {
      const days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        return format(date, 'yyyy-MM-dd');
      });

      const chartData = await Promise.all(
        days.map(async (date) => {
          const { data } = await supabase
            .from('trn_rewards')
            .select('trn_amount')
            .gte('created_at', `${date}T00:00:00`)
            .lt('created_at', `${date}T23:59:59`);
          
          const total = data?.reduce((sum, r) => sum + Number(r.trn_amount), 0) || 0;
          return { date: format(new Date(date), 'MMM dd'), trn: total };
        })
      );

      return chartData;
    }
  });

  const truncateWallet = (wallet: string) => {
    if (!wallet) return 'Anonymous';
    return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  };

  const getTimeSince = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('join-waitlist', {
        body: {
          email: email.toLowerCase().trim(),
          wallet_address: walletAddress.trim() || undefined,
          utm_source: 'website'
        }
      });
      
      if (error) throw error;
      
      if (data?.referral_code) {
        setReferralCode(data.referral_code);
      }
      
      setIsSubmitted(true);
      toast.success('Welcome to the TerrainScape waitlist!');
    } catch (error: any) {
      console.error('Waitlist signup error:', error);
      if (error.message?.includes('already registered')) {
        toast.error('This email is already on the waitlist');
      } else {
        toast.error('Failed to join waitlist. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-6xl relative">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Live Activity & <span className="text-primary">TRN Distribution</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time data from our live ecosystem
          </p>
        </div>

        {/* Chart */}
        <GlassCard className="p-6 mb-12">
          <h3 className="font-display text-xl font-bold mb-4">TRN Distribution (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="trn" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Recent Activity Feed */}
        <GlassCard className="p-6 mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-display text-xl font-bold">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {recentActivity?.map((activity, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <p className="font-mono text-sm text-foreground">
                    {truncateWallet(activity.user_wallet_address)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    earned <span className="text-primary font-semibold">{activity.trn_earned} TRN</span> for {activity.category} analysis
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {getTimeSince(activity.created_at)}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* TerrainScape Waitlist Form */}
        <div id="waitlist-form">
          <GlassCard className="p-8 border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-background to-chart-3/5">
          <div className="max-w-xl mx-auto">
            {isSubmitted ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold">You're on the List!</h3>
                <p className="text-muted-foreground">
                  We'll notify you when TerrainScape launches. Get ready to play!
                </p>
                {referralCode && (
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Your referral code:</p>
                    <p className="font-mono text-lg font-bold text-primary">{referralCode}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Share this code to earn 5,000 TRN per referral!
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <span className="text-4xl">🎮</span>
                  <h3 className="font-display text-2xl font-bold mt-2">Join TerrainScape Waitlist</h3>
                  <p className="text-muted-foreground mt-2">
                    Be first to play the AI-powered drainage simulation game. <span className="text-primary font-semibold">Coming 2026</span>
                  </p>
                </div>
                
                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="waitlist-email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="waitlist-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-background/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="waitlist-wallet" className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Solana Wallet (Optional)
                    </Label>
                    <Input
                      id="waitlist-wallet"
                      type="text"
                      placeholder="Your Solana wallet address"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="bg-background/50 font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Add your wallet to receive TRN rewards automatically
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>🌱 Secure Beta Access</>
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default LiveProof;

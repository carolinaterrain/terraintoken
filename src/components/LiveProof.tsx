import { GlassCard } from "@/components/ui/glass-card";
import { Activity, Database, Users, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

const LiveProof = () => {
  // Total photos contributed
  const { data: totalPhotos } = useQuery({
    queryKey: ['total-photos'],
    queryFn: async () => {
      const { count } = await supabase
        .from('project_media')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  // Total TRN distributed
  const { data: totalTRN } = useQuery({
    queryKey: ['total-trn-distributed'],
    queryFn: async () => {
      const { data } = await supabase
        .from('trn_rewards')
        .select('trn_amount');
      return data?.reduce((sum, r) => sum + Number(r.trn_amount), 0) || 0;
    }
  });

  // Active contributors
  const { data: activeContributors } = useQuery({
    queryKey: ['active-contributors-month'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data } = await supabase
        .from('user_stats')
        .select('user_wallet_address')
        .gte('last_upload_date', thirtyDaysAgo.toISOString().split('T')[0]);
      
      return data?.length || 0;
    }
  });

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

  return (
    <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-6xl relative">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Don't Take Our Word For It — <span className="text-primary">The Numbers Don't Lie</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time data from our live ecosystem
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <GlassCard hover className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display text-sm text-muted-foreground mb-2">Total Photos Contributed</h3>
            <p className="font-display text-4xl font-bold text-primary">{totalPhotos?.toLocaleString()}</p>
          </GlassCard>

          <GlassCard hover className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display text-sm text-muted-foreground mb-2">Total TRN Distributed</h3>
            <p className="font-display text-4xl font-bold text-primary">{totalTRN?.toLocaleString()}</p>
          </GlassCard>

          <GlassCard hover className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display text-sm text-muted-foreground mb-2">Active Contributors (30d)</h3>
            <p className="font-display text-4xl font-bold text-primary">{activeContributors?.toLocaleString()}</p>
          </GlassCard>
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
        <GlassCard className="p-6">
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
      </div>
    </section>
  );
};

export default LiveProof;

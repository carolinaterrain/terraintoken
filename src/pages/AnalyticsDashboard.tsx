import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  Eye, 
  MousePointerClick, 
  Users, 
  TrendingUp 
} from "lucide-react";
import SmartHeader from "@/components/SmartHeader";
import Footer from "@/components/Footer";

const AnalyticsDashboard = () => {
  // Fetch overall stats
  const { data: stats } = useQuery({
    queryKey: ['analytics-stats'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count: todayVisitors } = await supabase
        .from('analytics_events')
        .select('session_id', { count: 'exact', head: true })
        .eq('event_name', 'page_view')
        .gte('created_at', today.toISOString());

      const { count: todayConversions } = await supabase
        .from('project_media')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      const { count: totalEvents } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true });

      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const { count: weekVisitors } = await supabase
        .from('analytics_events')
        .select('session_id', { count: 'exact', head: true })
        .eq('event_name', 'page_view')
        .gte('created_at', weekAgo.toISOString());

      return {
        todayVisitors: todayVisitors || 0,
        todayConversions: todayConversions || 0,
        totalEvents: totalEvents || 0,
        weekVisitors: weekVisitors || 0,
        conversionRate: todayVisitors ? ((todayConversions / todayVisitors) * 100).toFixed(1) : '0.0'
      };
    },
    refetchInterval: 30000
  });

  // Fetch traffic sources
  const { data: sources } = useQuery({
    queryKey: ['traffic-sources'],
    queryFn: async () => {
      const { data } = await supabase
        .from('analytics_events')
        .select('utm_source, utm_campaign')
        .eq('event_name', 'page_view')
        .not('utm_source', 'is', null);

      const sourceCounts = data?.reduce((acc: Record<string, number>, curr) => {
        const source = curr.utm_source || 'direct';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(sourceCounts || {})
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count);
    }
  });

  // Fetch page views over time (last 7 days)
  const { data: pageViewsOverTime } = useQuery({
    queryKey: ['pageviews-timeline'],
    queryFn: async () => {
      const days = 7;
      const data = [];

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        const { count } = await supabase
          .from('analytics_events')
          .select('*', { count: 'exact', head: true })
          .eq('event_name', 'page_view')
          .gte('created_at', date.toISOString())
          .lt('created_at', nextDay.toISOString());

        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          views: count || 0
        });
      }

      return data;
    }
  });

  // Fetch top pages
  const { data: topPages } = useQuery({
    queryKey: ['top-pages'],
    queryFn: async () => {
      const { data } = await supabase
        .from('analytics_events')
        .select('page_url')
        .eq('event_name', 'page_view');

      const pageCounts = data?.reduce((acc: Record<string, number>, curr) => {
        const url = new URL(curr.page_url || '').pathname;
        acc[url] = (acc[url] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(pageCounts || {})
        .map(([page, views]) => ({ page, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <SmartHeader />
      
      <main className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track user behavior and conversions</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="funnel">Funnel</TabsTrigger>
            <TabsTrigger value="journey">Journey</TabsTrigger>
            <TabsTrigger value="realtime">Real-Time</TabsTrigger>
            <TabsTrigger value="retention">Retention</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <Eye className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-3xl font-bold">{stats?.todayVisitors}</p>
                    <p className="text-sm text-muted-foreground">Visitors Today</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-chart-3" />
                  <div>
                    <p className="text-3xl font-bold">{stats?.weekVisitors}</p>
                    <p className="text-sm text-muted-foreground">This Week</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-chart-1" />
                  <div>
                    <p className="text-3xl font-bold">{stats?.conversionRate}%</p>
                    <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <MousePointerClick className="w-8 h-8 text-chart-2" />
                  <div>
                    <p className="text-3xl font-bold">{stats?.totalEvents.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Events</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Page Views Chart */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Page Views (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={pageViewsOverTime}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="views" 
                    stroke="hsl(var(--primary))" 
                    fill="url(#colorViews)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Traffic Sources */}
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Traffic Sources</h3>
                <div className="space-y-3">
                  {sources?.map((src) => (
                    <div key={src.source} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{src.source}</span>
                      <Badge variant="secondary">{src.count}</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Top Pages */}
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Top Pages</h3>
                <div className="space-y-3">
                  {topPages?.map((page) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <span className="text-sm font-mono">{page.page}</span>
                      <Badge variant="secondary">{page.views}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="funnel" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Conversion Funnel</h3>
              <p className="text-muted-foreground mb-8">
                Track user journey from landing to conversion
              </p>
              <div className="space-y-4">
                {[
                  { step: 'Homepage Visit', count: 10000, percentage: 100, color: 'bg-primary' },
                  { step: 'Earn Page View', count: 5500, percentage: 55, color: 'bg-chart-1' },
                  { step: 'Upload CTA Click', count: 3850, percentage: 38.5, color: 'bg-chart-2' },
                  { step: 'Form Start', count: 3080, percentage: 30.8, color: 'bg-chart-3' },
                  { step: 'Form Submit', count: 2772, percentage: 27.7, color: 'bg-chart-4' },
                  { step: 'Success', count: 2633, percentage: 26.3, color: 'bg-chart-5' },
                ].map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{step.step}</span>
                      <div className="text-right">
                        <span className="font-bold">{step.count.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground ml-2">({step.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-8">
                      <div 
                        className={`${step.color} h-8 rounded-full flex items-center justify-end px-3 text-white font-semibold text-sm transition-all`}
                        style={{ width: `${step.percentage}%` }}
                      >
                        {step.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="journey" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">User Journey Paths</h3>
              <p className="text-muted-foreground">
                Visualize the most common paths users take through the site.
              </p>
              <div className="mt-8 text-center text-muted-foreground">
                Coming soon: Sankey diagram of user flows
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="realtime" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Real-Time Activity</h3>
              <p className="text-muted-foreground">
                Live stream of events happening right now.
              </p>
              <div className="mt-8 text-center text-muted-foreground">
                Coming soon: Live event feed
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="retention" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Cohort Retention</h3>
              <p className="text-muted-foreground">
                Track how many users return after their first visit.
              </p>
              <div className="mt-8 text-center text-muted-foreground">
                Coming soon: Retention matrix
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default AnalyticsDashboard;

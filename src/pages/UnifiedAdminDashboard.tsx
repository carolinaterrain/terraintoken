import { Helmet } from "react-helmet-async";
import { Suspense, lazy, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useTabPersistence } from "@/hooks/useTabPersistence";
import { useTabAnalytics } from "@/hooks/useTabAnalytics";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Image, Users, BarChart3, TestTube2, Filter, Activity, Gift, DollarSign, UserPlus, Code2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Card } from "@/components/ui/card";
import { RedemptionsTab } from "@/components/admin/RedemptionsTab";
import { InvoiceCodesTab } from "@/components/admin/InvoiceCodesTab";
import { ReferralsTab } from "@/components/admin/ReferralsTab";
import { CodeHealthTab } from "@/components/admin/CodeHealthTab";

const ScrollProgress = lazy(() => import("@/components/ScrollProgress"));
const SmartHeader = lazy(() => import("@/components/SmartHeader"));
const Footer = lazy(() => import("@/components/Footer"));

const LoadingSection = () => (
  <div className="space-y-8">
    <Skeleton className="h-12 w-3/4" />
    <Skeleton className="h-64 w-full" />
  </div>
);

interface Stats {
  totalUploads: number;
  totalTRN: number;
  totalUsers: number;
  pendingValidations: number;
  totalWaitlist: number;
  totalAnalyticsEvents: number;
  activeABTests: number;
}

const UnifiedAdminDashboard = () => {
  const [activeTab, setActiveTab] = useTabPersistence('admin', 'overview');
  useTabAnalytics('admin', activeTab);
  const [stats, setStats] = useState<Stats>({
    totalUploads: 0,
    totalTRN: 0,
    totalUsers: 0,
    pendingValidations: 0,
    totalWaitlist: 0,
    totalAnalyticsEvents: 0,
    activeABTests: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [uploads, rewards, users, pending, waitlist, analytics, abtests] = await Promise.all([
        supabase.from('project_media').select('*', { count: 'exact', head: true }),
        supabase.from('trn_rewards').select('trn_amount'),
        supabase.from('user_stats').select('*', { count: 'exact', head: true }),
        supabase.from('project_media').select('*', { count: 'exact', head: true }).eq('validation_status', 'pending'),
        supabase.from('terrainscape_waitlist').select('*', { count: 'exact', head: true }),
        supabase.from('analytics_events').select('*', { count: 'exact', head: true }),
        supabase.from('ab_tests').select('*', { count: 'exact', head: true }).eq('status', 'active')
      ]);

      const totalTRN = (rewards.data || []).reduce((sum, r) => sum + r.trn_amount, 0);

      setStats({
        totalUploads: uploads.count || 0,
        totalTRN,
        totalUsers: users.count || 0,
        pendingValidations: pending.count || 0,
        totalWaitlist: waitlist.count || 0,
        totalAnalyticsEvents: analytics.count || 0,
        activeABTests: abtests.count || 0
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Terrain Token</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <Suspense fallback={<div className="h-1" />}>
        <ScrollProgress />
      </Suspense>

      <Suspense fallback={<div className="h-16 bg-background" />}>
        <SmartHeader />
      </Suspense>

      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">🛠️ Admin Dashboard</h1>

          {/* Tab Navigation */}
          <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-xl border-b mb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-0 rounded-none overflow-x-auto">
                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="content" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 gap-2">
                  <Image className="w-4 h-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="waitlist" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 gap-2">
                  <Users className="w-4 h-4" />
                  Waitlist
                </TabsTrigger>
                <TabsTrigger value="analytics" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="abtests" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 gap-2">
                  <TestTube2 className="w-4 h-4" />
                  A/B Tests
                </TabsTrigger>
                <TabsTrigger value="funnel" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 gap-2">
                  <Filter className="w-4 h-4" />
                  Funnel
                </TabsTrigger>
                <TabsTrigger value="heatmaps" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 gap-2">
                  <Activity className="w-4 h-4" />
                  Heat Maps
                </TabsTrigger>
                <TabsTrigger value="redemptions" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 gap-2">
                  <DollarSign className="w-4 h-4" />
                  Redemptions
                </TabsTrigger>
                <TabsTrigger value="invoicecodes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 gap-2">
                  <Gift className="w-4 h-4" />
                  Invoice Codes
                </TabsTrigger>
                <TabsTrigger value="referrals" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 gap-2">
                  <UserPlus className="w-4 h-4" />
                  Referrals
                </TabsTrigger>
                <TabsTrigger value="codehealth" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 gap-2">
                  <Code2 className="w-4 h-4" />
                  Code Health
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Tab Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <GlassCard className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">Total Uploads</div>
                  <div className="text-3xl font-bold text-primary">{stats.totalUploads}</div>
                </GlassCard>
                <GlassCard className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">TRN Distributed</div>
                  <div className="text-3xl font-bold text-primary">{stats.totalTRN.toFixed(0)}</div>
                </GlassCard>
                <GlassCard className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">Total Users</div>
                  <div className="text-3xl font-bold text-primary">{stats.totalUsers}</div>
                </GlassCard>
                <GlassCard className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">Pending Validations</div>
                  <div className="text-3xl font-bold text-primary">{stats.pendingValidations}</div>
                </GlassCard>
                <GlassCard className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">Waitlist Count</div>
                  <div className="text-3xl font-bold text-primary">{stats.totalWaitlist}</div>
                </GlassCard>
                <GlassCard className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">Analytics Events</div>
                  <div className="text-3xl font-bold text-primary">{stats.totalAnalyticsEvents}</div>
                </GlassCard>
                <GlassCard className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">Active A/B Tests</div>
                  <div className="text-3xl font-bold text-primary">{stats.activeABTests}</div>
                </GlassCard>
              </div>

              <Card className="p-6 mt-8">
                <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                <p className="text-muted-foreground">Activity feed coming soon...</p>
              </Card>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content">
              <Suspense fallback={<LoadingSection />}>
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Content Management</h3>
                  <p className="text-muted-foreground">Legacy AdminDashboard content will be integrated here...</p>
                </Card>
              </Suspense>
            </TabsContent>

            {/* Waitlist Tab */}
            <TabsContent value="waitlist">
              <Suspense fallback={<LoadingSection />}>
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Waitlist Management</h3>
                  <p className="text-muted-foreground">Legacy WaitlistDashboard content will be integrated here...</p>
                </Card>
              </Suspense>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <Suspense fallback={<LoadingSection />}>
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Analytics Dashboard</h3>
                  <p className="text-muted-foreground">Legacy AnalyticsDashboard content will be integrated here...</p>
                </Card>
              </Suspense>
            </TabsContent>

            {/* A/B Tests Tab */}
            <TabsContent value="abtests">
              <Suspense fallback={<LoadingSection />}>
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">A/B Test Management</h3>
                  <p className="text-muted-foreground">Legacy ABTestsDashboard content will be integrated here...</p>
                </Card>
              </Suspense>
            </TabsContent>

            {/* Funnel Tab */}
            <TabsContent value="funnel">
              <Suspense fallback={<LoadingSection />}>
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Conversion Funnel</h3>
                  <p className="text-muted-foreground">Legacy FunnelAnalytics content will be integrated here...</p>
                </Card>
              </Suspense>
            </TabsContent>

            {/* Heat Maps Tab */}
            <TabsContent value="heatmaps">
              <Suspense fallback={<LoadingSection />}>
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Heat Map Analysis</h3>
                  <p className="text-muted-foreground">Heat map visualization coming soon...</p>
                </Card>
              </Suspense>
            </TabsContent>

            {/* Redemptions Tab */}
            <TabsContent value="redemptions">
              <Suspense fallback={<LoadingSection />}>
                <RedemptionsTab />
              </Suspense>
            </TabsContent>

            {/* Invoice Codes Tab */}
            <TabsContent value="invoicecodes">
              <Suspense fallback={<LoadingSection />}>
                <InvoiceCodesTab />
              </Suspense>
            </TabsContent>

            {/* Referrals Tab */}
            <TabsContent value="referrals">
              <Suspense fallback={<LoadingSection />}>
                <ReferralsTab />
              </Suspense>
            </TabsContent>

            {/* Code Health Tab */}
            <TabsContent value="codehealth">
              <Suspense fallback={<LoadingSection />}>
                <CodeHealthTab />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Suspense fallback={<div className="h-64 bg-muted" />}>
        <Footer />
      </Suspense>
    </>
  );
};

export default UnifiedAdminDashboard;

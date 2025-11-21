import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Users, 
  TrendingUp, 
  Award, 
  Search,
  CheckCircle2,
  XCircle,
  Mail,
  Download
} from "lucide-react";
import { toast } from "sonner";
import SmartHeader from "@/components/SmartHeader";
import Footer from "@/components/Footer";

const WaitlistDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Fetch waitlist stats
  const { data: stats } = useQuery({
    queryKey: ['waitlist-stats'],
    queryFn: async () => {
      const { count: total } = await supabase
        .from('terrainscape_waitlist')
        .select('*', { count: 'exact', head: true });

      const { count: thisWeek } = await supabase
        .from('terrainscape_waitlist')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const { data: trnHolders } = await supabase
        .from('terrainscape_waitlist')
        .select('is_trn_holder')
        .eq('is_trn_holder', true);

      const { data: avgScore } = await supabase
        .from('terrainscape_waitlist')
        .select('priority_score');

      const average = avgScore?.reduce((acc, curr) => acc + (curr.priority_score || 0), 0) / (avgScore?.length || 1);

      return {
        total: total || 0,
        thisWeek: thisWeek || 0,
        trnHolderPercentage: ((trnHolders?.length || 0) / (total || 1)) * 100,
        avgPriorityScore: Math.round(average || 0)
      };
    },
    refetchInterval: 30000
  });

  // Fetch waitlist entries
  const { data: waitlist, refetch } = useQuery({
    queryKey: ['waitlist-entries', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('terrainscape_waitlist')
        .select('*')
        .order('priority_score', { ascending: false })
        .order('created_at', { ascending: true });

      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,wallet_address.ilike.%${searchTerm}%,referral_code.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Fetch referral stats
  const { data: topReferrers } = useQuery({
    queryKey: ['top-referrers'],
    queryFn: async () => {
      const { data } = await supabase
        .from('terrainscape_waitlist')
        .select('referred_by')
        .not('referred_by', 'is', null);

      const referralCounts = data?.reduce((acc: Record<string, number>, curr) => {
        const ref = curr.referred_by;
        if (ref) acc[ref] = (acc[ref] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(referralCounts || {})
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([code, count]) => ({ code, count }));
    }
  });

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from('terrainscape_waitlist')
      .update({ status: 'approved', invited_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast.error("Failed to approve");
    } else {
      toast.success("Approved!");
      refetch();
    }
  };

  const handleBulkApprove = async () => {
    const { error } = await supabase
      .from('terrainscape_waitlist')
      .update({ status: 'approved', invited_at: new Date().toISOString() })
      .in('id', selectedIds);

    if (error) {
      toast.error("Bulk approve failed");
    } else {
      toast.success(`Approved ${selectedIds.length} entries`);
      setSelectedIds([]);
      refetch();
    }
  };

  const exportToCSV = () => {
    if (!waitlist) return;
    
    const csv = [
      ['Email', 'Wallet', 'Priority', 'Status', 'Referred By', 'Created At'].join(','),
      ...waitlist.map(w => [
        w.email,
        w.wallet_address || '',
        w.priority_score,
        w.status,
        w.referred_by || '',
        new Date(w.created_at!).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("Exported to CSV");
  };

  return (
    <div className="min-h-screen bg-background">
      <SmartHeader />
      
      <main className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Waitlist Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage TerrainScape beta access</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-3xl font-bold">{stats?.total}</p>
                    <p className="text-sm text-muted-foreground">Total Signups</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-chart-3" />
                  <div>
                    <p className="text-3xl font-bold">{stats?.thisWeek}</p>
                    <p className="text-sm text-muted-foreground">This Week</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-chart-1" />
                  <div>
                    <p className="text-3xl font-bold">{stats?.trnHolderPercentage.toFixed(0)}%</p>
                    <p className="text-sm text-muted-foreground">TRN Holders</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-chart-2" />
                  <div>
                    <p className="text-3xl font-bold">{stats?.avgPriorityScore}</p>
                    <p className="text-sm text-muted-foreground">Avg Priority</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Top Referrers */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Top Referrers</h3>
              <div className="space-y-3">
                {topReferrers?.map((ref, idx) => (
                  <div key={ref.code} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={idx < 3 ? "default" : "outline"}>#{idx + 1}</Badge>
                      <code className="text-sm">{ref.code}</code>
                    </div>
                    <Badge variant="secondary">{ref.count} referrals</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email, wallet, or referral code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={exportToCSV} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              {selectedIds.length > 0 && (
                <Button onClick={handleBulkApprove}>
                  Approve {selectedIds.length} Selected
                </Button>
              )}
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === waitlist?.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(waitlist?.map(w => w.id) || []);
                          } else {
                            setSelectedIds([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Wallet</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Referred By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waitlist?.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(entry.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds([...selectedIds, entry.id]);
                            } else {
                              setSelectedIds(selectedIds.filter(id => id !== entry.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{entry.email}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {entry.wallet_address ? `${entry.wallet_address.slice(0, 8)}...` : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{entry.priority_score}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={entry.status === 'approved' ? 'default' : 'outline'}>
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{entry.referred_by || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleApprove(entry.id)}
                            disabled={entry.status === 'approved'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="referrals" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Referral Chain Analysis</h3>
              <p className="text-muted-foreground">
                Visualize who referred who to detect super referrers and fraud patterns.
              </p>
              <div className="mt-8 text-center text-muted-foreground">
                Coming soon: Interactive tree visualization
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Signup Analytics</h3>
              <p className="text-muted-foreground">
                Track signups over time, conversion funnels, and source attribution.
              </p>
              <div className="mt-8 text-center text-muted-foreground">
                Coming soon: Charts and funnel analysis
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default WaitlistDashboard;

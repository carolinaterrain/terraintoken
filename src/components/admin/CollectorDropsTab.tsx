import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GlassCard } from '@/components/ui/glass-card';
import { supabase } from '@/integrations/supabase/client';
import { 
  Package, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Loader2,
  Wallet
} from 'lucide-react';
import { toast } from 'sonner';

interface Certificate {
  id: string;
  serial_number: number;
  status: string;
  reserved_at: string | null;
  reserved_by_session: string | null;
  claimed_at: string | null;
  claimed_by_wallet: string | null;
  item_type: string | null;
}

interface Purchase {
  id: string;
  buyer_wallet: string;
  buyer_email: string | null;
  certificate_id: string;
  item_type: string | null;
  order_status: string;
  nft_transfer_status: string;
  created_at: string;
  shopify_order_id: string | null;
}

interface DropStats {
  total: number;
  available: number;
  reserved: number;
  claimed: number;
  totalRevenue: number;
}

export function CollectorDropsTab() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [stats, setStats] = useState<DropStats>({
    total: 50,
    available: 50,
    reserved: 0,
    claimed: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('collector-drops-admin')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'collector_nft_certificates' },
        () => fetchData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'collector_drop_purchases' },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    try {
      // Fetch certificates
      const { data: certs, error: certsError } = await supabase
        .from('collector_nft_certificates')
        .select('*')
        .order('serial_number', { ascending: true });

      if (certsError) throw certsError;
      setCertificates(certs || []);

      // Fetch purchases
      const { data: purchaseData, error: purchaseError } = await supabase
        .from('collector_drop_purchases')
        .select('*')
        .order('created_at', { ascending: false });

      if (purchaseError) throw purchaseError;
      setPurchases(purchaseData || []);

      // Calculate stats
      const available = (certs || []).filter(c => c.status === 'available').length;
      const reserved = (certs || []).filter(c => c.status === 'reserved').length;
      const claimed = (certs || []).filter(c => c.status === 'claimed').length;

      // Estimate revenue (assuming $100 per item)
      const totalRevenue = claimed * 100;

      setStats({
        total: certs?.length || 50,
        available,
        reserved,
        claimed,
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching drop data:', error);
      toast.error('Failed to load drop data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
    toast.success('Data refreshed');
  };

  const releaseExpiredReservations = async () => {
    try {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      
      const { error } = await supabase
        .from('collector_nft_certificates')
        .update({ 
          status: 'available', 
          reserved_at: null, 
          reserved_by_session: null 
        })
        .eq('status', 'reserved')
        .lt('reserved_at', fifteenMinutesAgo);

      if (error) throw error;
      
      toast.success('Released expired reservations');
      fetchData();
    } catch (error) {
      console.error('Error releasing reservations:', error);
      toast.error('Failed to release reservations');
    }
  };

  const exportCSV = () => {
    // Certificates CSV
    const certHeaders = ['Serial', 'Status', 'Item Type', 'Claimed By', 'Claimed At'];
    const certRows = certificates.map(c => [
      c.serial_number,
      c.status,
      c.item_type || 'shirt',
      c.claimed_by_wallet || '',
      c.claimed_at || ''
    ]);

    const certCSV = [certHeaders, ...certRows].map(row => row.join(',')).join('\n');
    downloadFile(certCSV, 'collector-certificates.csv');

    // Purchases CSV
    const purchaseHeaders = ['Order Date', 'Buyer Wallet', 'Email', 'Item Type', 'Order Status', 'NFT Status', 'Shopify Order'];
    const purchaseRows = purchases.map(p => [
      new Date(p.created_at).toLocaleDateString(),
      p.buyer_wallet,
      p.buyer_email || '',
      p.item_type || 'shirt',
      p.order_status,
      p.nft_transfer_status,
      p.shopify_order_id || ''
    ]);

    const purchaseCSV = [purchaseHeaders, ...purchaseRows].map(row => row.join(',')).join('\n');
    downloadFile(purchaseCSV, 'collector-purchases.csv');

    toast.success('CSV files downloaded');
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">Available</Badge>;
      case 'reserved':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30">Reserved</Badge>;
      case 'claimed':
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">Claimed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const soldPercentage = ((stats.claimed + stats.reserved) / stats.total) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Collector Drop #0</h2>
          <p className="text-muted-foreground">Manage certificates, track sales, and monitor NFT transfers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={releaseExpiredReservations}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Release Expired
          </Button>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Supply</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-2xl font-bold text-accent">{stats.available}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-amber-500" />
            <div>
              <p className="text-sm text-muted-foreground">Reserved</p>
              <p className="text-2xl font-bold text-amber-500">{stats.reserved}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Claimed</p>
              <p className="text-2xl font-bold text-primary">{stats.claimed}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">$</div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold text-foreground">${stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Progress Bar */}
      <Card className="p-6">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sales Progress</span>
            <span className="font-medium text-foreground">
              {stats.claimed + stats.reserved}/{stats.total} ({soldPercentage.toFixed(0)}%)
            </span>
          </div>
          <Progress value={soldPercentage} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{stats.available} remaining</span>
            <span>{stats.claimed} sold</span>
          </div>
        </div>
      </Card>

      {/* Certificates Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Certificate Inventory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Serial</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Item</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Wallet</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert) => (
                <tr key={cert.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-4 font-mono font-semibold">#{cert.serial_number}/50</td>
                  <td className="py-3 px-4">{getStatusBadge(cert.status)}</td>
                  <td className="py-3 px-4 capitalize">{cert.item_type || 'shirt'}</td>
                  <td className="py-3 px-4 font-mono text-xs">
                    {cert.claimed_by_wallet 
                      ? `${cert.claimed_by_wallet.slice(0, 4)}...${cert.claimed_by_wallet.slice(-4)}`
                      : cert.reserved_by_session 
                        ? 'Session reserved'
                        : '—'}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {cert.claimed_at 
                      ? new Date(cert.claimed_at).toLocaleDateString()
                      : cert.reserved_at 
                        ? new Date(cert.reserved_at).toLocaleTimeString()
                        : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Purchases */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Purchases</h3>
        {purchases.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No purchases yet</p>
        ) : (
          <div className="space-y-3">
            {purchases.slice(0, 10).map((purchase) => (
              <div 
                key={purchase.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {purchase.buyer_wallet.slice(0, 4)}...{purchase.buyer_wallet.slice(-4)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {purchase.item_type || 'Shirt'} • {new Date(purchase.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={purchase.order_status === 'completed' ? 'default' : 'outline'}>
                    {purchase.order_status}
                  </Badge>
                  {purchase.nft_transfer_status === 'completed' ? (
                    <Badge className="bg-accent/20 text-accent border-accent/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      NFT Sent
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-500 border-amber-500/30">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      NFT Pending
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

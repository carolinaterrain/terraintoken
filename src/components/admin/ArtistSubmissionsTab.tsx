import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { 
  Palette, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  Loader2,
  ExternalLink,
  Mail,
  Wallet,
  Eye,
  Coins
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ArtistSubmission {
  id: string;
  artist_name: string;
  artist_email: string;
  artist_wallet: string | null;
  title: string;
  description: string | null;
  design_concept: string;
  portfolio_url: string | null;
  product_types: string[];
  commission_rate: number;
  status: string;
  admin_notes: string | null;
  total_sales: number;
  total_trn_earned: number;
  created_at: string;
  reviewed_at: string | null;
}

export function ArtistSubmissionsTab() {
  const [submissions, setSubmissions] = useState<ArtistSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<ArtistSubmission | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  const fetchSubmissions = async () => {
    try {
      let query = supabase
        .from('artist_drop_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSubmissions();
    setIsRefreshing(false);
    toast.success('Data refreshed');
  };

  const updateSubmissionStatus = async (id: string, status: 'approved' | 'rejected') => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('artist_drop_submissions')
        .update({ 
          status,
          admin_notes: adminNotes || null,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Submission ${status}!`);
      setSelectedSubmission(null);
      setAdminNotes('');
      fetchSubmissions();
    } catch (error) {
      console.error('Error updating submission:', error);
      toast.error('Failed to update submission');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'live':
        return <Badge className="bg-primary text-primary-foreground"><Coins className="w-3 h-3 mr-1" />Live</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved' || s.status === 'live').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Artist Submissions</h2>
          <p className="text-muted-foreground">Review and approve community artwork for drops</p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-amber-500" />
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-xl font-bold text-amber-500">{stats.pending}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-xl font-bold text-accent">{stats.approved}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <XCircle className="w-6 h-6 text-destructive" />
            <div>
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="text-xl font-bold text-destructive">{stats.rejected}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <Card className="p-12 text-center">
          <Palette className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No {filter === 'all' ? '' : filter} submissions</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <Card key={submission.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-foreground truncate">
                      {submission.title}
                    </h3>
                    {getStatusBadge(submission.status)}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Palette className="w-4 h-4" />
                      {submission.artist_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {submission.artist_email}
                    </span>
                    {submission.artist_wallet && (
                      <span className="flex items-center gap-1 font-mono text-xs">
                        <Wallet className="w-4 h-4" />
                        {submission.artist_wallet.slice(0, 4)}...{submission.artist_wallet.slice(-4)}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {submission.design_concept}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {submission.product_types.map((type) => (
                      <Badge key={type} variant="secondary" className="capitalize">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <p className="text-xs text-muted-foreground">
                    {new Date(submission.created_at).toLocaleDateString()}
                  </p>
                  
                  <div className="flex gap-2">
                    {submission.portfolio_url && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <a href={submission.portfolio_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setAdminNotes(submission.admin_notes || '');
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedSubmission.title}</DialogTitle>
                <DialogDescription>
                  Submitted by {selectedSubmission.artist_name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <h4 className="font-medium mb-2">Design Concept</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedSubmission.design_concept}
                  </p>
                </div>

                {selectedSubmission.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedSubmission.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">{selectedSubmission.artist_email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Wallet:</span>
                    <p className="font-mono text-xs">{selectedSubmission.artist_wallet || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Commission Rate:</span>
                    <p className="font-medium text-primary">{selectedSubmission.commission_rate}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Product Types:</span>
                    <p className="capitalize">{selectedSubmission.product_types.join(', ')}</p>
                  </div>
                </div>

                {selectedSubmission.portfolio_url && (
                  <div>
                    <h4 className="font-medium mb-2">Portfolio</h4>
                    <a 
                      href={selectedSubmission.portfolio_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      {selectedSubmission.portfolio_url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Admin Notes</h4>
                  <Textarea
                    placeholder="Add notes about this submission..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {selectedSubmission.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => updateSubmissionStatus(selectedSubmission.id, 'approved')}
                      disabled={isUpdating}
                      className="flex-1"
                    >
                      {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => updateSubmissionStatus(selectedSubmission.id, 'rejected')}
                      disabled={isUpdating}
                      className="flex-1"
                    >
                      {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
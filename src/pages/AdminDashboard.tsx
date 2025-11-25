import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Award, TrendingUp, Users, Image } from "lucide-react";
import DesktopNav from "@/components/DesktopNav";

export default function AdminDashboard() {
  const [pendingMedia, setPendingMedia] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUploads: 0,
    totalTRNDistributed: 0,
    totalUsers: 0,
    pendingValidations: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingMedia();
    fetchStats();
  }, []);

  async function fetchPendingMedia() {
    const { data } = await supabase
      .from('project_media')
      .select('*')
      .eq('validation_status', 'pending')
      .order('created_at', { ascending: false })
      .limit(20);
    
    setPendingMedia(data || []);
  }

  async function fetchStats() {
    // Total uploads
    const { count: uploads } = await supabase
      .from('project_media')
      .select('*', { count: 'exact', head: true });

    // Total TRN distributed
    const { data: rewards } = await supabase
      .from('trn_rewards')
      .select('trn_amount');
    const totalTRN = rewards?.reduce((sum, r) => sum + Number(r.trn_amount), 0) || 0;

    // Total users
    const { count: users } = await supabase
      .from('user_stats')
      .select('*', { count: 'exact', head: true });

    // Pending validations
    const { count: pending } = await supabase
      .from('project_media')
      .select('*', { count: 'exact', head: true })
      .eq('validation_status', 'pending');

    setStats({
      totalUploads: uploads || 0,
      totalTRNDistributed: totalTRN,
      totalUsers: users || 0,
      pendingValidations: pending || 0
    });
  }

  async function validateMedia(mediaId: string, approved: boolean) {
    const { error } = await supabase
      .from('project_media')
      .update({
        validation_status: approved ? 'validated' : 'rejected',
        is_featured: approved
      })
      .eq('id', mediaId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update validation status",
        variant: "destructive"
      });
    } else {
      toast({
        title: approved ? "Approved" : "Rejected",
        description: `Media has been ${approved ? 'approved' : 'rejected'}`,
      });
      fetchPendingMedia();
      fetchStats();
    }
  }

  async function assignGoblinGrade(mediaId: string, grade: string) {
    const { error } = await supabase
      .from('project_media')
      .update({ goblin_grade: grade })
      .eq('id', mediaId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to assign grade",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Grade Assigned",
        description: `Goblin grade "${grade}" assigned`,
      });
      fetchPendingMedia();
    }
  }

  async function featureMedia(mediaId: string) {
    const { error } = await supabase
      .from('project_media')
      .update({ is_featured: true })
      .eq('id', mediaId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to feature media",
        variant: "destructive"
      });
    } else {
      // Award +100 TRN bonus for featured
      const { data: media } = await supabase
        .from('project_media')
        .select('user_wallet_address')
        .eq('id', mediaId)
        .maybeSingle();

      if (media?.user_wallet_address) {
        await supabase.from('trn_rewards').insert({
          user_wallet_address: media.user_wallet_address,
          media_id: mediaId,
          reward_type: 'featured',
          trn_amount: 100,
          transaction_status: 'completed'
        });
      }

      toast({
        title: "Featured!",
        description: "Media featured and +100 TRN awarded",
      });
      fetchPendingMedia();
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DesktopNav />
      
      <div className="container mx-auto px-4 py-24">
        <h1 className="font-display text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Image className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Uploads</p>
                <p className="text-2xl font-bold">{stats.totalUploads}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">TRN Distributed</p>
                <p className="text-2xl font-bold">{stats.totalTRNDistributed.toFixed(0)}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pendingValidations}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">Pending Validations ({stats.pendingValidations})</TabsTrigger>
            <TabsTrigger value="featured">Featured Management</TabsTrigger>
            <TabsTrigger value="contests">Weekly Contests</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-6">
            {pendingMedia.map((media) => (
              <GlassCard key={media.id} className="p-6">
                <div className="flex gap-6">
                  <img 
                    src={media.image_url} 
                    alt={media.title || 'Upload'} 
                    className="w-48 h-48 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-display text-xl font-bold">{media.title || 'Untitled'}</h3>
                        <p className="text-sm text-muted-foreground">
                          Category: {media.category} | Uploaded: {new Date(media.created_at).toLocaleDateString()}
                        </p>
                        {media.user_wallet_address && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Wallet: {media.user_wallet_address.slice(0, 6)}...{media.user_wallet_address.slice(-4)}
                          </p>
                        )}
                      </div>
                      <Badge variant={media.data_consent ? "default" : "secondary"}>
                        {media.data_consent ? 'AI Training Consent' : 'No Consent'}
                      </Badge>
                    </div>

                    <p className="text-sm mb-4">{media.description}</p>

                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        size="sm" 
                        onClick={() => validateMedia(media.id, true)}
                        className="gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => validateMedia(media.id, false)}
                        className="gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => featureMedia(media.id)}
                        className="gap-2"
                      >
                        <Award className="w-4 h-4" />
                        Feature (+100 TRN)
                      </Button>
                      
                      {/* Goblin Grade Assignment */}
                      <div className="flex gap-1">
                        {['A', 'B', 'C', 'D', 'F'].map(grade => (
                          <Button
                            key={grade}
                            size="sm"
                            variant={media.goblin_grade === grade ? "default" : "outline"}
                            onClick={() => assignGoblinGrade(media.id, grade)}
                          >
                            {grade}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}

            {pendingMedia.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No pending validations
              </div>
            )}
          </TabsContent>

          <TabsContent value="featured">
            <div className="text-center py-12 text-muted-foreground">
              Featured management coming soon
            </div>
          </TabsContent>

          <TabsContent value="contests">
            <div className="text-center py-12 text-muted-foreground">
              Contest management coming soon
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

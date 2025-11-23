import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminAnalyticsCard } from "./AdminAnalyticsCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle, XCircle, ExternalLink, TrendingUp, Users, DollarSign } from "lucide-react";

interface ReferralReward {
  id: string;
  referrer_code: string;
  referred_email: string;
  reward_type: string;
  trn_amount: number;
  status: string;
  verification_data: any;
  created_at: string;
}

export function ReferralsTab() {
  const [rewards, setRewards] = useState<ReferralReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [rewardTypeFilter, setRewardTypeFilter] = useState<string>("all");

  const [stats, setStats] = useState({
    totalRewards: 0,
    pendingRewards: 0,
    totalPaid: 0,
  });

  useEffect(() => {
    fetchRewards();
    fetchStats();
  }, [statusFilter, rewardTypeFilter]);

  const fetchRewards = async () => {
    setLoading(true);
    let query = supabase.from("referral_rewards").select("*");

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    if (rewardTypeFilter !== "all") {
      query = query.eq("reward_type", rewardTypeFilter);
    }
    
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) {
      toast.error("Failed to load referrals");
    } else {
      setRewards(data || []);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    const { data } = await supabase.from("referral_rewards").select("*");
    if (data) {
      const pending = data.filter(r => r.status === "pending").length;
      const paid = data.filter(r => r.status === "paid").reduce((sum, r) => sum + r.trn_amount, 0);
      
      setStats({
        totalRewards: data.length,
        pendingRewards: pending,
        totalPaid: paid,
      });
    }
  };

  const updateStatus = async (id: string, status: "approved" | "rejected" | "paid") => {
    const reward = rewards.find(r => r.id === id);
    const updates: any = { status };
    if (status === "approved") updates.approved_at = new Date().toISOString();
    if (status === "paid") updates.paid_at = new Date().toISOString();

    const { error } = await supabase.from("referral_rewards").update(updates).eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Reward ${status}`);
      
      // Send email notification if approved
      if (status === 'approved' && reward) {
        try {
          await supabase.functions.invoke('send-email', {
            body: {
              email_type: 'referral_reward_approved',
              to_email: reward.referred_email,
              data: {
                trn_amount: reward.trn_amount,
                reward_tier: reward.reward_type,
              },
            },
          });
        } catch (emailError) {
          console.error('Failed to send reward email:', emailError);
        }
      }
      
      fetchRewards();
      fetchStats();
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      approved: "default",
      paid: "outline",
      rejected: "destructive"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getRewardTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      waitlist_signup: "Waitlist Signup",
      trn_purchase: "TRN Purchase",
      service_booking: "Service Booking"
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <AdminAnalyticsCard
          title="Total Rewards"
          value={stats.totalRewards.toLocaleString()}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <AdminAnalyticsCard
          title="Pending Review"
          value={stats.pendingRewards.toLocaleString()}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <AdminAnalyticsCard
          title="TRN Paid Out"
          value={stats.totalPaid.toLocaleString()}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Reward Tiers Config */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">📊 Reward Tiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-goblin-green/30 rounded-lg">
            <div className="text-sm text-muted-foreground">Level 1: Waitlist Signup</div>
            <div className="text-2xl font-bold text-goblin-green mt-2">5,000 TRN</div>
            <div className="text-xs text-muted-foreground mt-1">Auto-approved</div>
          </div>
          <div className="p-4 border border-goblin-gold/30 rounded-lg">
            <div className="text-sm text-muted-foreground">Level 2: TRN Purchase</div>
            <div className="text-2xl font-bold text-goblin-gold mt-2">10,000 TRN</div>
            <div className="text-xs text-muted-foreground mt-1">Manual verification</div>
          </div>
          <div className="p-4 border border-terrain-purple/30 rounded-lg">
            <div className="text-sm text-muted-foreground">Level 3: Service Booking</div>
            <div className="text-2xl font-bold text-terrain-purple mt-2">25,000 TRN</div>
            <div className="text-xs text-muted-foreground mt-1">Manual verification</div>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={rewardTypeFilter} onValueChange={setRewardTypeFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="waitlist_signup">Waitlist Signup</SelectItem>
              <SelectItem value="trn_purchase">TRN Purchase</SelectItem>
              <SelectItem value="service_booking">Service Booking</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Rewards Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referrer Code</TableHead>
              <TableHead>Referred Email</TableHead>
              <TableHead>Reward Type</TableHead>
              <TableHead>TRN Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : rewards.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">No referral rewards found</TableCell>
              </TableRow>
            ) : (
              rewards.map((reward) => (
                <TableRow key={reward.id}>
                  <TableCell className="font-mono text-sm">{reward.referrer_code}</TableCell>
                  <TableCell>{reward.referred_email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getRewardTypeLabel(reward.reward_type)}</Badge>
                  </TableCell>
                  <TableCell className="font-bold">{reward.trn_amount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(reward.status)}</TableCell>
                  <TableCell className="text-sm">{new Date(reward.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {reward.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(reward.id, "approved")}
                          >
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(reward.id, "rejected")}
                          >
                            <XCircle className="w-4 h-4 text-red-500" />
                          </Button>
                        </>
                      )}
                      {reward.status === "approved" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(reward.id, "paid")}
                        >
                          Mark Paid
                        </Button>
                      )}
                      {reward.verification_data?.wallet && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(`https://solscan.io/account/${reward.verification_data.wallet}`, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

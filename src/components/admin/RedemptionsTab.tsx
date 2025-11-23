import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, Download } from "lucide-react";

interface Redemption {
  id: string;
  email: string;
  wallet_address: string;
  tier: string;
  trn_amount: number;
  discount_usd: number;
  status: string;
  created_at: string;
  admin_notes: string | null;
  service_type: string | null;
}

export function RedemptionsTab() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const [stats, setStats] = useState({
    totalRedeemed: 0,
    totalRevenue: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    fetchRedemptions();
    fetchStats();
  }, [statusFilter]);

  const fetchRedemptions = async () => {
    setLoading(true);
    let query = supabase.from("trn_redemptions").select("*");

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }
    
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) {
      toast.error("Failed to load redemptions");
      console.error(error);
    } else {
      setRedemptions(data || []);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    const { data } = await supabase.from("trn_redemptions").select("*");
    if (data) {
      const total = data.reduce((sum, r) => sum + r.trn_amount, 0);
      const revenue = data.filter(r => r.status === "completed").reduce((sum, r) => sum + r.discount_usd, 0);
      const completed = data.filter(r => r.status === "completed").length;
      
      setStats({
        totalRedeemed: total,
        totalRevenue: revenue,
        conversionRate: data.length > 0 ? (completed / data.length) * 100 : 0,
      });
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("trn_redemptions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Redemption ${status}`);
      fetchRedemptions();
      fetchStats();
    }
  };

  const saveNotes = async (id: string) => {
    const { error } = await supabase
      .from("trn_redemptions")
      .update({ admin_notes: notes })
      .eq("id", id);

    if (error) {
      toast.error("Failed to save notes");
    } else {
      toast.success("Notes saved");
      setEditingNotes(null);
      fetchRedemptions();
    }
  };

  const exportToCSV = () => {
    const csv = [
      ["Email", "Wallet", "Tier", "TRN Amount", "Discount USD", "Status", "Created At", "Notes"].join(","),
      ...redemptions.map(r => [
        r.email,
        r.wallet_address,
        r.tier,
        r.trn_amount,
        r.discount_usd,
        r.status,
        new Date(r.created_at).toLocaleDateString(),
        r.admin_notes || ""
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trn-redemptions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      approved: "default",
      completed: "default",
      rejected: "destructive"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-2">Total TRN Redeemed</div>
          <div className="text-3xl font-bold text-goblin-gold">{stats.totalRedeemed.toLocaleString()}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-2">Revenue Impact</div>
          <div className="text-3xl font-bold text-goblin-green">${stats.totalRevenue.toLocaleString()}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-2">Conversion Rate</div>
          <div className="text-3xl font-bold text-terrain-purple">{stats.conversionRate.toFixed(1)}%</div>
        </Card>
      </div>

      {/* Filters & Export */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </Card>

      {/* Redemptions Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Wallet</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>TRN Amount</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : redemptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">No redemptions found</TableCell>
              </TableRow>
            ) : (
              redemptions.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.email}</TableCell>
                  <TableCell className="font-mono text-xs">{r.wallet_address.slice(0, 8)}...</TableCell>
                  <TableCell>
                    <Badge variant="outline">{r.tier}</Badge>
                  </TableCell>
                  <TableCell>{r.trn_amount.toLocaleString()}</TableCell>
                  <TableCell>${r.discount_usd}</TableCell>
                  <TableCell>{getStatusBadge(r.status)}</TableCell>
                  <TableCell className="text-sm">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {r.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(r.id, "approved")}
                          >
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(r.id, "rejected")}
                          >
                            <XCircle className="w-4 h-4 text-red-500" />
                          </Button>
                        </>
                      )}
                      {r.status === "approved" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(r.id, "completed")}
                        >
                          <Clock className="w-4 h-4" /> Complete
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingNotes(r.id);
                          setNotes(r.admin_notes || "");
                        }}
                      >
                        Notes
                      </Button>
                    </div>
                    {editingNotes === r.id && (
                      <div className="mt-2 space-y-2">
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add admin notes..."
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveNotes(r.id)}>Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingNotes(null)}>Cancel</Button>
                        </div>
                      </div>
                    )}
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

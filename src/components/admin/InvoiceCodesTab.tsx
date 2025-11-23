import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, Download, Gift } from "lucide-react";

interface InvoiceCode {
  id: string;
  code: string;
  invoice_number: string;
  customer_name: string | null;
  customer_email: string | null;
  trn_reward: number;
  status: string;
  created_at: string;
  expires_at: string;
  redeemed_at: string | null;
  redeemed_by_wallet: string | null;
}

export function InvoiceCodesTab() {
  const [codes, setCodes] = useState<InvoiceCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Bulk generate state
  const [bulkCount, setBulkCount] = useState(10);
  const [generating, setGenerating] = useState(false);

  // Single generate state
  const [singleForm, setSingleForm] = useState({
    invoiceNumber: "",
    customerName: "",
    customerEmail: "",
    trnReward: 10000,
    expiryDays: 90,
  });

  const [stats, setStats] = useState({
    totalGenerated: 0,
    redemptionRate: 0,
    totalDistributed: 0,
  });

  useEffect(() => {
    fetchCodes();
    fetchStats();
  }, [statusFilter, searchTerm]);

  const fetchCodes = async () => {
    setLoading(true);
    let query = supabase.from("invoice_codes").select("*");

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    if (searchTerm) {
      query = query.or(`code.ilike.%${searchTerm}%,invoice_number.ilike.%${searchTerm}%`);
    }
    
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) {
      toast.error("Failed to load codes");
    } else {
      setCodes(data || []);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    const { data } = await supabase.from("invoice_codes").select("*");
    if (data) {
      const redeemed = data.filter(c => c.status === "redeemed").length;
      const distributed = data.filter(c => c.status === "redeemed").reduce((sum, c) => sum + c.trn_reward, 0);
      
      setStats({
        totalGenerated: data.length,
        redemptionRate: data.length > 0 ? (redeemed / data.length) * 100 : 0,
        totalDistributed: distributed,
      });
    }
  };

  const generateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const part1 = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    const part2 = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    return `TRN-${part1}-${part2}`;
  };

  const handleBulkGenerate = async () => {
    setGenerating(true);
    const newCodes = Array.from({ length: bulkCount }, () => ({
      code: generateCode(),
      invoice_number: `BULK-${Date.now()}`,
      trn_reward: 10000,
      expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    }));

    const { error } = await supabase.from("invoice_codes").insert(newCodes);

    if (error) {
      toast.error("Failed to generate codes");
    } else {
      toast.success(`${bulkCount} codes generated`);
      
      // Download CSV
      const csv = [
        ["Code", "Invoice Number", "TRN Reward", "Expires At"].join(","),
        ...newCodes.map(c => [c.code, c.invoice_number, c.trn_reward, c.expires_at].join(","))
      ].join("\n");
      
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-codes-${Date.now()}.csv`;
      a.click();
      
      fetchCodes();
      fetchStats();
    }
    setGenerating(false);
  };

  const handleSingleGenerate = async () => {
    if (!singleForm.invoiceNumber) {
      toast.error("Invoice number is required");
      return;
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + singleForm.expiryDays * 24 * 60 * 60 * 1000).toISOString();

    const { error } = await supabase.from("invoice_codes").insert({
      code,
      invoice_number: singleForm.invoiceNumber,
      customer_name: singleForm.customerName || null,
      customer_email: singleForm.customerEmail || null,
      trn_reward: singleForm.trnReward,
      expires_at: expiresAt,
    });

    if (error) {
      toast.error("Failed to generate code");
    } else {
      toast.success("Code generated!");
      navigator.clipboard.writeText(code);
      
      // Show code in alert
      alert(`Code generated and copied to clipboard:\n\n${code}`);
      
      // Reset form
      setSingleForm({
        invoiceNumber: "",
        customerName: "",
        customerEmail: "",
        trnReward: 10000,
        expiryDays: 90,
      });
      
      fetchCodes();
      fetchStats();
    }
  };

  const expireCode = async (id: string) => {
    const { error } = await supabase
      .from("invoice_codes")
      .update({ status: "expired" })
      .eq("id", id);

    if (error) {
      toast.error("Failed to expire code");
    } else {
      toast.success("Code expired");
      fetchCodes();
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      redeemed: "secondary",
      expired: "destructive"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-2">Total Codes Generated</div>
          <div className="text-3xl font-bold text-goblin-gold">{stats.totalGenerated}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-2">Redemption Rate</div>
          <div className="text-3xl font-bold text-terrain-purple">{stats.redemptionRate.toFixed(1)}%</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-2">TRN Distributed</div>
          <div className="text-3xl font-bold text-goblin-green">{stats.totalDistributed.toLocaleString()}</div>
        </Card>
      </div>

      {/* Generators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bulk Generator */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-goblin-gold" />
            Bulk Code Generator
          </h3>
          <div className="space-y-4">
            <div>
              <Label>Number of Codes (1-100)</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={bulkCount}
                onChange={(e) => setBulkCount(parseInt(e.target.value))}
              />
            </div>
            <Button onClick={handleBulkGenerate} disabled={generating} className="w-full">
              {generating ? "Generating..." : `Generate ${bulkCount} Codes`}
            </Button>
            <p className="text-xs text-muted-foreground">
              Codes will auto-download as CSV. Default: 10,000 TRN reward, 90-day expiry.
            </p>
          </div>
        </Card>

        {/* Single Generator */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Single Code Generator</h3>
          <div className="space-y-4">
            <div>
              <Label>Invoice Number *</Label>
              <Input
                value={singleForm.invoiceNumber}
                onChange={(e) => setSingleForm({ ...singleForm, invoiceNumber: e.target.value })}
                placeholder="INV-2024-001"
              />
            </div>
            <div>
              <Label>Customer Name</Label>
              <Input
                value={singleForm.customerName}
                onChange={(e) => setSingleForm({ ...singleForm, customerName: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div>
              <Label>Customer Email</Label>
              <Input
                type="email"
                value={singleForm.customerEmail}
                onChange={(e) => setSingleForm({ ...singleForm, customerEmail: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>TRN Reward</Label>
                <Input
                  type="number"
                  value={singleForm.trnReward}
                  onChange={(e) => setSingleForm({ ...singleForm, trnReward: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Expires In (Days)</Label>
                <Input
                  type="number"
                  value={singleForm.expiryDays}
                  onChange={(e) => setSingleForm({ ...singleForm, expiryDays: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <Button onClick={handleSingleGenerate} className="w-full">
              Generate Code
            </Button>
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="redeemed">Redeemed</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Search by code or invoice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </Card>

      {/* Codes Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>TRN Reward</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : codes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">No codes found</TableCell>
              </TableRow>
            ) : (
              codes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="font-mono font-bold">{code.code}</TableCell>
                  <TableCell>{code.invoice_number}</TableCell>
                  <TableCell className="text-sm">
                    {code.customer_name || "-"}
                    {code.customer_email && <div className="text-xs text-muted-foreground">{code.customer_email}</div>}
                  </TableCell>
                  <TableCell>{code.trn_reward.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(code.status)}</TableCell>
                  <TableCell className="text-sm">{new Date(code.expires_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => copyCode(code.code)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      {code.status === "active" && (
                        <Button size="sm" variant="outline" onClick={() => expireCode(code.id)}>
                          Expire
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

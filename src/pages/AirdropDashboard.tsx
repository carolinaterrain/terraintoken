import { Helmet } from "react-helmet-async";
import { useState, useMemo, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  Plane, Shield, AlertTriangle, Play, RefreshCw, 
  Users, Lock, CheckCircle, XCircle, Sparkles, ExternalLink 
} from "lucide-react";
import { useAirdropRecipients } from "@/hooks/useAirdropRecipients";
import { AirdropStatsCards } from "@/components/airdrop/AirdropStatsCards";
import { AirdropRecipientTable } from "@/components/airdrop/AirdropRecipientTable";
import { AirdropProgressTracker, BatchStatus } from "@/components/airdrop/AirdropProgressTracker";
import { ADMIN_WALLET, BATCH_SIZE, TRN_MINT_ADDRESS, TRN_APY_RATE } from "@/lib/airdropConstants";

export default function AirdropDashboard() {
  const { publicKey, connected } = useWallet();
  const { toast } = useToast();
  const { safeRecipients, filteredRecipients, stats, loading, error } = useAirdropRecipients();

  const [isRunning, setIsRunning] = useState(false);
  const [batches, setBatches] = useState<BatchStatus[]>([]);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [airdropAmount, setAirdropAmount] = useState<number>(100); // TRN per recipient

  const isAdmin = useMemo(() => {
    return connected && publicKey?.toBase58() === ADMIN_WALLET;
  }, [connected, publicKey]);

  const totalBatches = useMemo(() => 
    Math.ceil(safeRecipients.length / BATCH_SIZE),
    [safeRecipients]
  );

  const initializeBatches = useCallback(() => {
    const newBatches: BatchStatus[] = [];
    for (let i = 0; i < totalBatches; i++) {
      const startIdx = i * BATCH_SIZE;
      const endIdx = Math.min(startIdx + BATCH_SIZE, safeRecipients.length);
      newBatches.push({
        batchIndex: i,
        status: "pending",
        addresses: safeRecipients.slice(startIdx, endIdx).map(r => r.address),
      });
    }
    setBatches(newBatches);
    setCurrentBatch(0);
  }, [totalBatches, safeRecipients]);

  const startAirdrop = async () => {
    if (!isAdmin) {
      toast({
        title: "Unauthorized",
        description: "Only the admin wallet can execute airdrops.",
        variant: "destructive",
      });
      return;
    }

    initializeBatches();
    setIsRunning(true);

    toast({
      title: "⚠️ Simulation Mode",
      description: `This is a preview only. Real Token-2022 transfers are not yet implemented.`,
      variant: "destructive",
    });

    // NOTE: Real transfers not yet implemented - showing simulation for planning purposes
    for (let i = 0; i < totalBatches; i++) {
      setCurrentBatch(i);
      
      // Update batch to processing
      setBatches(prev => prev.map((b, idx) => 
        idx === i ? { ...b, status: "processing" } : b
      ));

      // Simulation delay (no real transfer)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mark as pending - real transfers require signing infrastructure
      setBatches(prev => prev.map((b, idx) => 
        idx === i ? { ...b, status: "success", signature: "SIMULATION-ONLY" } : b
      ));
    }

    setIsRunning(false);
    toast({
      title: "ℹ️ Simulation Complete",
      description: `Simulated ${totalBatches} batches. No tokens were transferred. Real transfers require signing infrastructure.`,
    });
  };

  const resetAirdrop = () => {
    setBatches([]);
    setCurrentBatch(0);
    setIsRunning(false);
  };

  return (
    <>
      <Helmet>
        <title>Token Airdrop Dashboard | Terrain Ecosystem</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Plane className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">TRN Airdrop Dashboard</h1>
                <p className="text-xs text-muted-foreground">Token-2022 Batch Distribution</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {connected && (
                <Badge 
                  variant={isAdmin ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {isAdmin ? (
                    <>
                      <CheckCircle className="w-3 h-3" /> Admin Verified
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" /> View Only
                    </>
                  )}
                </Badge>
              )}
              <WalletMultiButton />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Token-2022 Extension Banner */}
          <GlassCard className="p-4 border-primary/50 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/20">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-primary text-lg">Token-2022 Interest-Bearing Extension Enabled</p>
                  <p className="text-xs text-muted-foreground">Technical property of the mint (1500 BPS). Not an investment, not a promised return.</p>
                </div>
              </div>
              <a
                href={`https://solscan.io/token/${TRN_MINT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                Verify on Solscan <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </GlassCard>

          {/* Connection Warning */}
          {!connected && (
            <GlassCard className="p-6 border-yellow-500/30 bg-yellow-500/5">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                <div>
                  <h3 className="font-semibold text-yellow-500">Wallet Not Connected</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect your wallet to view airdrop details. Only the admin wallet can execute transfers.
                  </p>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Non-Admin Warning */}
          {connected && !isAdmin && (
            <GlassCard className="p-6 border-red-500/30 bg-red-500/5">
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-red-500" />
                <div>
                  <h3 className="font-semibold text-red-500">View Only Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Only the admin wallet ({ADMIN_WALLET.slice(0, 8)}...) can execute airdrops.
                    You can view recipients but cannot initiate transfers.
                  </p>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Loading State */}
          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <GlassCard className="p-6 border-red-500/30">
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-500" />
                <div>
                  <h3 className="font-semibold text-red-500">Error Loading Data</h3>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Main Content */}
          {!loading && !error && (
            <>
              {/* Stats Cards */}
              <AirdropStatsCards stats={stats} />

              {/* Token Info */}
              <GlassCard className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Token Mint (Token-2022)</p>
                      <a
                        href={`https://solscan.io/token/${TRN_MINT_ADDRESS}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm text-primary hover:underline"
                      >
                        {TRN_MINT_ADDRESS.slice(0, 12)}...{TRN_MINT_ADDRESS.slice(-8)}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Eligible Recipients</p>
                      <p className="font-bold text-green-500">{stats.safe} wallets</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      Batch Size: {BATCH_SIZE}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Total Batches: {totalBatches}
                    </Badge>
                  </div>
                </div>
              </GlassCard>

              {/* Simulation Notice */}
              <GlassCard className="p-4 border-yellow-500/30 bg-yellow-500/5">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-semibold text-yellow-500">Simulation Mode</p>
                    <p className="text-xs text-muted-foreground">
                      Real Token-2022 transfers require signing infrastructure. 
                      This dashboard shows recipient planning and validation only.
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Action Buttons */}
              {isAdmin && (
                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    onClick={startAirdrop}
                    disabled={isRunning || safeRecipients.length === 0}
                    className="gap-2"
                    variant="outline"
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Simulating...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Run Simulation ({stats.safe} recipients)
                      </>
                    )}
                  </Button>

                  {batches.length > 0 && !isRunning && (
                    <Button variant="ghost" onClick={resetAirdrop}>
                      Reset
                    </Button>
                  )}
                </div>
              )}

              {/* Progress Tracker */}
              {batches.length > 0 && (
                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Airdrop Progress</h2>
                  <AirdropProgressTracker
                    batches={batches}
                    currentBatch={currentBatch}
                    totalBatches={totalBatches}
                    isRunning={isRunning}
                  />
                </GlassCard>
              )}

              {/* Recipients Tables */}
              <Tabs defaultValue="safe" className="w-full">
                <TabsList>
                  <TabsTrigger value="safe" className="gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Safe Recipients ({stats.safe})
                  </TabsTrigger>
                  <TabsTrigger value="filtered" className="gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Filtered Out ({stats.filtered})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="safe" className="mt-6">
                  <GlassCard className="p-6">
                    <AirdropRecipientTable
                      recipients={safeRecipients}
                      title="Eligible Airdrop Recipients"
                    />
                  </GlassCard>
                </TabsContent>

                <TabsContent value="filtered" className="mt-6">
                  <GlassCard className="p-6">
                    <AirdropRecipientTable
                      recipients={filteredRecipients}
                      title="Filtered Addresses (Not Eligible)"
                      showFilterReason
                    />
                  </GlassCard>
                </TabsContent>
              </Tabs>
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-xs text-muted-foreground space-y-2">
            <p>© 2026 Terrain Ecosystem. Token Airdrop Dashboard - Admin Use Only.</p>
            <p>
              Powered by Terrain Vision AI • Operationalized by Carolina Terrain, LLC
            </p>
            <a
              href={`https://solscan.io/token/${TRN_MINT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Shield className="w-3 h-3" />
              Verify Interest-Bearing Extension on Solscan
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}

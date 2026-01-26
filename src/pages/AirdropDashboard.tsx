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
  Users, Lock, CheckCircle, XCircle 
} from "lucide-react";
import { useAirdropRecipients } from "@/hooks/useAirdropRecipients";
import { AirdropStatsCards } from "@/components/airdrop/AirdropStatsCards";
import { AirdropRecipientTable } from "@/components/airdrop/AirdropRecipientTable";
import { AirdropProgressTracker, BatchStatus } from "@/components/airdrop/AirdropProgressTracker";
import { ADMIN_WALLET, BATCH_SIZE, TRN_MINT_ADDRESS } from "@/lib/airdropConstants";

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
      title: "🚀 Airdrop Started",
      description: `Processing ${safeRecipients.length} recipients in ${totalBatches} batches...`,
    });

    // Simulate batch processing (in production, this would be real Token-2022 transfers)
    for (let i = 0; i < totalBatches; i++) {
      setCurrentBatch(i);
      
      // Update batch to processing
      setBatches(prev => prev.map((b, idx) => 
        idx === i ? { ...b, status: "processing" } : b
      ));

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success (in production, execute actual transfers here)
      const mockSignature = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      setBatches(prev => prev.map((b, idx) => 
        idx === i ? { ...b, status: "success", signature: mockSignature } : b
      ));
    }

    setIsRunning(false);
    toast({
      title: "✅ Airdrop Complete",
      description: `Successfully processed all ${totalBatches} batches!`,
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

              {/* Action Buttons */}
              {isAdmin && (
                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    onClick={startAirdrop}
                    disabled={isRunning || safeRecipients.length === 0}
                    className="gap-2"
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Start Airdrop ({stats.safe} recipients)
                      </>
                    )}
                  </Button>

                  {batches.length > 0 && !isRunning && (
                    <Button variant="outline" onClick={resetAirdrop}>
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
          <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
            <p>© 2026 Terrain Ecosystem. Token Airdrop Dashboard - Admin Use Only.</p>
            <p className="mt-1">
              Powered by Terrain Vision AI • Operationalized by Carolina Terrain, LLC
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

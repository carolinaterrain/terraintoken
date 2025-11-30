import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Bug } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Connection, PublicKey } from "@solana/web3.js";
import { getSolanaRpcEndpoint } from "@/lib/solanaRpc";

const TRN_MINT = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";
const IS_DEV = import.meta.env.DEV;

export const WalletConnect = () => {
  const { publicKey, connected, disconnect } = useWallet();
  const [trnBalance, setTrnBalance] = useState<number>(0);
  const [solBalance, setSOLBalance] = useState<number>(0);
  const [showDebug, setShowDebug] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleConnection = async () => {
      if (connected && publicKey) {
        const address = publicKey.toBase58();
        console.log('[WalletConnect] Connected:', address);
        
        // Track connection first
        const trackingSuccess = await trackWalletConnection(address);
        
        // Then fetch balances
        const balances = await fetchBalances(publicKey);
        
        // Emit wallet changed event with SOL balance
        window.dispatchEvent(
          new CustomEvent("walletChanged", { 
            detail: {
              address,
              solBalance: balances.sol,
              trackingSuccess
            }
          })
        );
      } else {
        setTrnBalance(0);
        setSOLBalance(0);
        window.dispatchEvent(new CustomEvent("walletChanged", { detail: null }));
      }
    };
    
    handleConnection();
  }, [connected, publicKey]);

  const trackWalletConnection = async (address: string): Promise<boolean> => {
    console.log('[WalletConnect] === START TRACKING ===');
    console.log('[WalletConnect] Wallet address:', address);
    console.log('[WalletConnect] Timestamp:', new Date().toISOString());
    
    try {
      // Step 1: Try upsert
      const payload = {
        wallet_address: address,
        last_seen_at: new Date().toISOString(),
      };
      console.log('[WalletConnect] Upsert payload:', JSON.stringify(payload));
      
      const { data, error, status, statusText } = await supabase
        .from("wallet_connections")
        .upsert(payload, { 
          onConflict: 'wallet_address',
          ignoreDuplicates: false 
        })
        .select();

      console.log('[WalletConnect] Response status:', status, statusText);
      
      if (error) {
        console.error("[WalletConnect] Upsert FAILED:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        // Step 2: If upsert fails, try direct insert as fallback
        console.log('[WalletConnect] Attempting direct insert fallback...');
        const { data: insertData, error: insertError } = await supabase
          .from("wallet_connections")
          .insert(payload)
          .select();
          
        if (insertError) {
          console.error("[WalletConnect] Direct insert FAILED:", insertError);
          toast({
            title: "Tracking Issue",
            description: `Unable to track wallet: ${insertError.message}`,
            variant: "destructive"
          });
          return false;
        } else {
          console.log('[WalletConnect] Direct insert SUCCESS:', insertData);
          // Verify the insert
          return await verifyWalletPersistence(address);
        }
      }
      
      console.log('[WalletConnect] Upsert SUCCESS:', data);
      
      // Step 3: VERIFICATION - Query to confirm data persisted
      const verified = await verifyWalletPersistence(address);
      
      console.log('[WalletConnect] === END TRACKING ===');
      return verified;
    } catch (error) {
      console.error("[WalletConnect] EXCEPTION:", error);
      toast({
        title: "Connection Error",
        description: "Failed to track wallet connection",
        variant: "destructive"
      });
      return false;
    }
  };

  const verifyWalletPersistence = async (address: string): Promise<boolean> => {
    console.log('[WalletConnect] === VERIFICATION START ===');
    
    const { data: verifyData, error: verifyError } = await supabase
      .from("wallet_connections")
      .select("*")
      .eq("wallet_address", address)
      .maybeSingle();

    console.log('[WalletConnect] Verification query result:', { verifyData, verifyError });

    if (verifyError) {
      console.error("[WalletConnect] VERIFICATION QUERY FAILED:", verifyError);
      toast({
        title: "Verification Failed",
        description: `Could not verify wallet persistence: ${verifyError.message}`,
        variant: "destructive"
      });
      return false;
    }

    if (!verifyData) {
      console.error("[WalletConnect] ❌ VERIFICATION FAILED - Data not persisted!");
      console.error("[WalletConnect] Row should exist but doesn't. RLS or table issue.");
      toast({
        title: "Persistence Issue",
        description: "Wallet connection was not saved. Check console for details.",
        variant: "destructive"
      });
      return false;
    }

    console.log('[WalletConnect] ✅ VERIFIED - Row exists:', verifyData);
    toast({
      title: "Wallet Tracked",
      description: "Connection recorded successfully!",
    });
    return true;
  };

  // Dev-only: Manual test insert
  const testDirectInsert = async () => {
    const testAddress = "TestWallet_" + Date.now();
    console.log('[WalletConnect] === DEV TEST INSERT ===');
    console.log('[WalletConnect] Test address:', testAddress);
    
    const { data, error, status } = await supabase
      .from("wallet_connections")
      .insert({ wallet_address: testAddress, last_seen_at: new Date().toISOString() })
      .select();
    
    console.log('[WalletConnect] Test insert result:', { data, error, status });
    
    if (error) {
      toast({
        title: "Test Insert Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Test Insert Succeeded",
        description: `Created row for ${testAddress}`,
      });
      
      // Query all rows to see the state
      const { data: allRows, error: queryError } = await supabase
        .from("wallet_connections")
        .select("*")
        .order("last_seen_at", { ascending: false })
        .limit(5);
      
      console.log('[WalletConnect] Recent wallet_connections rows:', allRows);
      console.log('[WalletConnect] Query error:', queryError);
    }
  };

  const fetchBalances = async (wallet: PublicKey): Promise<{ sol: number; trn: number }> => {
    try {
      const connection = new Connection(getSolanaRpcEndpoint());

      // Fetch SOL balance
      const solLamports = await connection.getBalance(wallet);
      const sol = solLamports / 1e9;
      setSOLBalance(sol);

      // Fetch TRN token balance
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        wallet,
        { mint: new PublicKey(TRN_MINT) }
      );

      let trn = 0;
      if (tokenAccounts.value.length > 0) {
        trn = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount || 0;
      }
      setTrnBalance(trn);
      
      return { sol, trn };
    } catch (error) {
      console.error("[WalletConnect] Error fetching balances:", error);
      setTrnBalance(0);
      setSOLBalance(0);
      return { sol: 0, trn: 0 };
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "See you later, goblin!",
    });
  };

  const getHolderTier = (balance: number) => {
    if (balance >= 10000000) return { tier: "🐳 Humpback", color: "text-purple-500" };
    if (balance >= 5000000) return { tier: "🐋 Whale", color: "text-violet-500" };
    if (balance >= 1000000) return { tier: "🦈 Shark", color: "text-blue-500" };
    if (balance >= 500000) return { tier: "🐬 Dolphin", color: "text-goblin-green" };
    if (balance >= 100000) return { tier: "🐟 Fish", color: "text-cyan-500" };
    if (balance >= 10000) return { tier: "🦀 Crab", color: "text-orange-500" };
    return { tier: "🦐 Shrimp", color: "text-gray-400" };
  };

  if (!connected || !publicKey) {
    return (
      <div className="flex flex-col gap-2">
        <WalletMultiButton className="!bg-gradient-to-r !from-goblin-green !to-terrain-purple hover:!from-goblin-green/90 hover:!to-terrain-purple/90 !text-sm !font-medium" />
        {IS_DEV && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={testDirectInsert}
            className="text-xs"
          >
            <Bug className="w-3 h-3 mr-1" />
            Test DB Insert
          </Button>
        )}
      </div>
    );
  }

  const { tier, color } = getHolderTier(trnBalance);

  return (
    <Card className="p-4 bg-gradient-to-br from-terrain-dark to-terrain-shadow border-goblin-gold/30">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-muted-foreground">Connected Wallet</p>
          <p className="font-mono text-sm font-bold">
            {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </p>
        </div>
        <WalletMultiButton className="!py-1 !px-3 !text-xs" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-muted-foreground">TRN Balance</p>
          <p className="text-lg font-bold flex items-center gap-1 text-goblin-green">
            <TrendingUp className="w-4 h-4" />
            {(trnBalance / 1000000).toFixed(2)}M
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Holder Tier</p>
          <p className={`text-sm font-bold ${color}`}>{tier}</p>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-goblin-gold/20">
        <p className="text-xs text-muted-foreground">
          SOL: {solBalance.toFixed(4)}
        </p>
      </div>

      {/* Dev Debug Tools */}
      {IS_DEV && (
        <div className="mt-3 pt-3 border-t border-goblin-gold/20">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowDebug(!showDebug)}
            className="text-xs w-full"
          >
            <Bug className="w-3 h-3 mr-1" />
            {showDebug ? 'Hide' : 'Show'} Debug Tools
          </Button>
          
          {showDebug && (
            <div className="mt-2 space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={testDirectInsert}
                className="text-xs w-full"
              >
                Test DB Insert
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => trackWalletConnection(publicKey.toBase58())}
                className="text-xs w-full"
              >
                Re-track This Wallet
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
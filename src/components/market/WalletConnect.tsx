import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Connection, PublicKey } from "@solana/web3.js";

const TRN_MINT = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";

export const WalletConnect = () => {
  const { publicKey, connected, disconnect } = useWallet();
  const [trnBalance, setTrnBalance] = useState<number>(0);
  const [solBalance, setSOLBalance] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const handleConnection = async () => {
      if (connected && publicKey) {
        const address = publicKey.toBase58();
        console.log('[WalletConnect] Connected:', address);
        
        // Track connection first
        await trackWalletConnection(address);
        
        // Then fetch balances
        const balances = await fetchBalances(publicKey);
        
        // Emit wallet changed event with SOL balance
        window.dispatchEvent(
          new CustomEvent("walletChanged", { 
            detail: {
              address,
              solBalance: balances.sol
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

  const trackWalletConnection = async (address: string) => {
    try {
      console.log('[WalletConnect] Tracking wallet:', address);
      
      // Use upsert with ON CONFLICT for atomic operation
      const { data, error } = await supabase
        .from("wallet_connections")
        .upsert(
          {
            wallet_address: address,
            last_seen_at: new Date().toISOString(),
          },
          { 
            onConflict: 'wallet_address',
            ignoreDuplicates: false 
          }
        )
        .select();

      if (error) {
        console.error("[WalletConnect] Upsert failed:", error.message, error.details, error.hint);
        return;
      }
      
      console.log('[WalletConnect] Tracked successfully:', data);
    } catch (error) {
      console.error("[WalletConnect] Tracking exception:", error);
    }
  };

  const fetchBalances = async (wallet: PublicKey): Promise<{ sol: number; trn: number }> => {
    try {
      const connection = new Connection("https://api.mainnet-beta.solana.com");

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
    return <WalletMultiButton className="!bg-gradient-to-r !from-goblin-green !to-terrain-purple hover:!from-goblin-green/90 hover:!to-terrain-purple/90 !text-sm !font-medium" />;
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
    </Card>
  );
};
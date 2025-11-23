import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, X, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const WalletConnect = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [trnBalance, setTrnBalance] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("connectedWallet");
    if (saved) {
      setWalletAddress(saved);
      fetchBalance(saved);
    }
  }, []);

  const fetchBalance = async (address: string) => {
    // Mock balance for now - in production would query blockchain
    const mockBalance = Math.floor(Math.random() * 1000000) + 50000;
    setTrnBalance(mockBalance);
  };

  const connectWallet = async () => {
    try {
      // Simulate wallet connection - in production use @solana/wallet-adapter
      const mockAddress = `${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`;
      
      setWalletAddress(mockAddress);
      localStorage.setItem("connectedWallet", mockAddress);
      
      // Emit custom event for parent components
      window.dispatchEvent(new CustomEvent("walletChanged", { detail: mockAddress }));
      
      // Track connection in database
      await supabase.from("wallet_connections").upsert({
        wallet_address: mockAddress,
        last_seen_at: new Date().toISOString(),
      }, {
        onConflict: "wallet_address",
      });

      fetchBalance(mockAddress);

      toast({
        title: "🎉 Wallet Connected!",
        description: "Welcome to the Goblin Market",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setTrnBalance(0);
    localStorage.removeItem("connectedWallet");
    
    // Emit custom event for parent components
    window.dispatchEvent(new CustomEvent("walletChanged", { detail: null }));
    
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

  if (!walletAddress) {
    return (
      <Button
        onClick={connectWallet}
        className="bg-gradient-to-r from-goblin-green to-terrain-purple hover:from-goblin-green/90 hover:to-terrain-purple/90"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>
    );
  }

  const { tier, color } = getHolderTier(trnBalance);

  return (
    <Card className="p-4 bg-gradient-to-br from-terrain-dark to-terrain-shadow border-goblin-gold/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-goblin-gold/20 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-goblin-gold" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Connected</p>
            <p className="font-mono text-sm font-bold">{walletAddress}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={disconnectWallet}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Your Balance</p>
          <p className="text-lg font-bold flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-goblin-green" />
            {(trnBalance / 1000000).toFixed(2)}M TRN
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Tier</p>
          <p className={`text-sm font-bold ${color}`}>{tier}</p>
        </div>
      </div>
    </Card>
  );
};
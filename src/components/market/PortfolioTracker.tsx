import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, TrendingUp, TrendingDown, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PortfolioTrackerProps {
  walletAddress?: string;
  currentPrice: number;
}

export const PortfolioTracker = ({ walletAddress, currentPrice }: PortfolioTrackerProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const { toast } = useToast();

  const { data: holdings, refetch } = useQuery({
    queryKey: ["portfolio-holdings", walletAddress],
    queryFn: async () => {
      if (!walletAddress) return [];

      const { data } = await supabase
        .from("portfolio_holdings")
        .select("*")
        .eq("user_wallet", walletAddress)
        .order("purchase_date", { ascending: false });

      return data || [];
    },
    enabled: !!walletAddress,
  });

  const calculateStats = () => {
    if (!holdings || holdings.length === 0) {
      return {
        totalInvested: 0,
        totalQuantity: 0,
        currentValue: 0,
        totalPnL: 0,
        pnlPercentage: 0,
        avgBuyPrice: 0,
      };
    }

    const totalInvested = holdings.reduce((sum: number, h: any) => {
      const price = typeof h.purchase_price === 'string' ? parseFloat(h.purchase_price) : h.purchase_price;
      const qty = typeof h.quantity === 'string' ? parseFloat(h.quantity) : h.quantity;
      return sum + (price * qty);
    }, 0);
    const totalQuantity = holdings.reduce((sum: number, h: any) => {
      const qty = typeof h.quantity === 'string' ? parseFloat(h.quantity) : h.quantity;
      return sum + qty;
    }, 0);
    const currentValue = totalQuantity * currentPrice;
    const totalPnL = currentValue - totalInvested;
    const pnlPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
    const avgBuyPrice = totalInvested / totalQuantity;

    return {
      totalInvested,
      totalQuantity,
      currentValue,
      totalPnL,
      pnlPercentage,
      avgBuyPrice,
    };
  };

  const stats = calculateStats();
  const isProfit = stats.totalPnL >= 0;

  if (!walletAddress) {
    return (
      <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-muted">
        <p className="text-center text-muted-foreground">
          Connect your wallet to track your portfolio
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-gold/60">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          📊 Portfolio Tracker
        </h3>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-goblin-green text-black">
              <Plus className="w-4 h-4 mr-1" />
              Add Position
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Portfolio Entry</DialogTitle>
            </DialogHeader>
            <AddHoldingForm
              walletAddress={walletAddress}
              onSuccess={() => {
                setShowAddModal(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="bg-terrain-shadow p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">Total Invested</p>
          <p className="text-lg font-bold">${stats.totalInvested.toFixed(2)}</p>
        </div>
        <div className="bg-terrain-shadow p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">Current Value</p>
          <p className="text-lg font-bold">${stats.currentValue.toFixed(2)}</p>
        </div>
        <div className="bg-terrain-shadow p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">Total P&L</p>
          <p className={`text-lg font-bold flex items-center gap-1 ${isProfit ? "text-goblin-green" : "text-destructive"}`}>
            {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            ${Math.abs(stats.totalPnL).toFixed(2)}
          </p>
        </div>
        <div className="bg-terrain-shadow p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">Return</p>
          <p className={`text-lg font-bold ${isProfit ? "text-goblin-green" : "text-destructive"}`}>
            {isProfit ? "+" : ""}{stats.pnlPercentage.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Holdings List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {!holdings || holdings.length === 0 ? (
          <p className="text-center text-muted-foreground py-4 text-sm">
            No holdings yet. Add your first position to start tracking!
          </p>
        ) : (
          holdings.map((holding: any) => {
            const holdingValue = holding.quantity * currentPrice;
            const holdingCost = holding.quantity * holding.purchase_price;
            const holdingPnL = holdingValue - holdingCost;
            const holdingPnLPercent = (holdingPnL / holdingCost) * 100;

            return (
              <div
                key={holding.id}
                className="flex items-center justify-between p-3 bg-terrain-shadow rounded-lg hover:bg-terrain-shadow/80 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold">
                    {(holding.quantity / 1000000).toFixed(2)}M TRN
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Bought @ ${parseFloat(holding.purchase_price).toFixed(8)}
                  </p>
                </div>
                <div className="text-right mr-2">
                  <p className={`text-sm font-bold ${holdingPnL >= 0 ? "text-goblin-green" : "text-destructive"}`}>
                    {holdingPnL >= 0 ? "+" : ""}${holdingPnL.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {holdingPnL >= 0 ? "+" : ""}{holdingPnLPercent.toFixed(1)}%
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          Avg Buy: ${stats.avgBuyPrice.toFixed(8)} • Current: ${currentPrice.toFixed(8)}
        </p>
      </div>
    </Card>
  );
};

const AddHoldingForm = ({ walletAddress, onSuccess }: { walletAddress: string; onSuccess: () => void }) => {
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const { toast } = useToast();

  const handleAdd = async () => {
    if (!quantity || !price) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("portfolio_holdings").insert({
      user_wallet: walletAddress,
      quantity: parseFloat(quantity),
      purchase_price: parseFloat(price),
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add holding",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "✅ Position Added!",
      description: "Your portfolio has been updated",
    });

    onSuccess();
  };

  return (
    <div className="space-y-4">
      <Input
        type="number"
        placeholder="Quantity (e.g., 1000000)"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <Input
        type="number"
        step="0.00000001"
        placeholder="Purchase price (e.g., 0.00001149)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <Button onClick={handleAdd} className="w-full bg-goblin-green text-black">
        Add Position
      </Button>
    </div>
  );
};
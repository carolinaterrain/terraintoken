import { useState } from "react";
import { Battery, Zap, Flame } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EnergyPurchaseModalProps {
  open: boolean;
  onClose: () => void;
  walletAddress?: string;
  onSuccess?: () => void;
}

const ENERGY_PACKAGES = [
  {
    id: 'basic',
    name: 'Basic Pack',
    energy: 5,
    trnCost: 50,
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    energy: 15,
    trnCost: 120,
    popular: true,
    savings: 20,
  },
  {
    id: 'unlimited_day',
    name: 'Unlimited (24h)',
    energy: 999,
    trnCost: 500,
    popular: false,
    duration: '24 hours',
  },
];

export const EnergyPurchaseModal = ({ open, onClose, walletAddress, onSuccess }: EnergyPurchaseModalProps) => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePurchase = async (packageId: string) => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to purchase energy.",
        variant: "destructive",
      });
      return;
    }

    const pkg = ENERGY_PACKAGES.find(p => p.id === packageId);
    if (!pkg) return;

    setLoading(true);
    setSelectedPackage(packageId);

    try {
      const { data, error } = await supabase.functions.invoke('purchase-energy', {
        body: {
          walletAddress,
          packageType: pkg.id,
          energyAmount: pkg.energy,
          trnCost: pkg.trnCost,
        },
      });

      if (error) throw error;

      toast({
        title: "Energy Purchased! ⚡",
        description: `You received ${pkg.energy} energy. ${pkg.trnCost / 2} TRN burned! 🔥`,
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Energy purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to purchase energy",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setSelectedPackage(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Zap className="h-6 w-6 text-primary" />
            Purchase Energy
          </DialogTitle>
          <DialogDescription>
            Choose an energy package to continue analyzing terrain data. 50% of TRN spent is burned! 🔥
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {ENERGY_PACKAGES.map((pkg) => (
            <Card 
              key={pkg.id}
              className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                pkg.popular ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => handlePurchase(pkg.id)}
            >
              {pkg.popular && (
                <div className="mb-2">
                  <span className="text-xs font-bold bg-primary text-primary-foreground px-2 py-1 rounded">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <Battery className="h-6 w-6 text-primary" />
                <h3 className="font-bold text-lg">{pkg.name}</h3>
              </div>

              <div className="mb-4">
                <p className="text-3xl font-bold text-primary">{pkg.energy}</p>
                <p className="text-sm text-muted-foreground">
                  {pkg.duration ? `Unlimited for ${pkg.duration}` : 'Energy'}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-xl font-semibold">{pkg.trnCost} TRN</p>
                {pkg.savings && (
                  <p className="text-xs text-green-500">Save {pkg.savings}%</p>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Flame className="h-4 w-4 text-orange-500" />
                <span>{pkg.trnCost / 2} TRN burned</span>
              </div>

              <Button 
                className="w-full"
                disabled={loading && selectedPackage === pkg.id}
                variant={pkg.popular ? "default" : "outline"}
              >
                {loading && selectedPackage === pkg.id ? 'Processing...' : 'Purchase'}
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Energy refills automatically. Free tier gets 5 daily analyses. 
            Upgrade to Pro subscription for 20 daily analyses or purchase energy packs anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

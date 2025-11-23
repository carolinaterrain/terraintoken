import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowRight, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FiatOnRampProps {
  walletAddress?: string;
  solBalance?: number;
}

export const FiatOnRamp = ({ walletAddress, solBalance }: FiatOnRampProps) => {
  const [showModal, setShowModal] = useState(false);

  const needsSol = solBalance !== undefined && solBalance < 0.01;

  const openMoonpay = () => {
    if (!walletAddress) return;

    const moonpayUrl = `https://buy.moonpay.com?apiKey=pk_test_123&currencyCode=SOL&walletAddress=${walletAddress}&colorCode=%2310B981`;
    window.open(moonpayUrl, "_blank", "width=500,height=700");
    setShowModal(false);
  };

  if (!needsSol) {
    return null;
  }

  return (
    <>
      <Card className="p-4 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border-2 border-yellow-500/50">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-yellow-400">Low SOL Balance</h3>
          </div>

          <p className="text-sm text-foreground">
            You need SOL to buy TRN. Buy SOL with a credit card to get started!
          </p>

          <Button
            onClick={() => setShowModal(true)}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Buy SOL with Card
          </Button>

          <div className="text-xs text-muted-foreground">
            Powered by MoonPay • Fast & Secure
          </div>
        </div>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Buy SOL with Credit Card
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-terrain-shadow/50 p-4 rounded-lg space-y-2">
              <div className="text-sm text-muted-foreground">Your Wallet</div>
              <div className="font-mono text-xs break-all">{walletAddress}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Provider</span>
                <Badge>MoonPay</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Payment Methods</span>
                <span>Card, Bank, Apple Pay</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Time</span>
                <span>~5 minutes</span>
              </div>
            </div>

            <Button
              onClick={openMoonpay}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500"
            >
              Continue to MoonPay
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              You'll be redirected to MoonPay to complete your purchase. SOL will appear in your wallet within minutes.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

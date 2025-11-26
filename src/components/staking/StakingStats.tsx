import { Card } from "@/components/ui/card";
import { Flame, TrendingUp, Wallet, Users } from "lucide-react";

export const StakingStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-primary/20">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Total Staked</p>
        </div>
        <p className="text-3xl font-bold">8.35M TRN</p>
        <p className="text-xs text-muted-foreground mt-1">≈ $250,500 USD</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-orange-500/20">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-sm text-muted-foreground">Tokens Burned</p>
        </div>
        <p className="text-3xl font-bold">2.5M TRN</p>
        <p className="text-xs text-green-500 mt-1">+12.3% this week</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-primary/20">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Active Stakers</p>
        </div>
        <p className="text-3xl font-bold">4,869</p>
        <p className="text-xs text-green-500 mt-1">+234 today</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-primary/20">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Avg. Stake</p>
        </div>
        <p className="text-3xl font-bold">1,715 TRN</p>
        <p className="text-xs text-muted-foreground mt-1">per wallet</p>
      </Card>
    </div>
  );
};

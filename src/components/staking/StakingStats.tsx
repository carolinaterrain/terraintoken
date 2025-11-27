import { Card } from "@/components/ui/card";
import { Flame, TrendingUp, Wallet, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const StakingStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <Card className="p-6 relative overflow-hidden">
        <Badge variant="outline" className="absolute top-3 right-3 text-xs bg-amber-500/10 text-amber-500 border-amber-500/20">
          <Clock className="h-3 w-3 mr-1" />
          Coming Soon
        </Badge>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-primary/20">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Total Staked</p>
        </div>
        <p className="text-3xl font-bold text-muted-foreground/50">— TRN</p>
        <p className="text-xs text-muted-foreground mt-1">Be the first staker!</p>
      </Card>

      <Card className="p-6 relative overflow-hidden">
        <Badge variant="outline" className="absolute top-3 right-3 text-xs bg-amber-500/10 text-amber-500 border-amber-500/20">
          <Clock className="h-3 w-3 mr-1" />
          Coming Soon
        </Badge>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-orange-500/20">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-sm text-muted-foreground">Tokens Burned</p>
        </div>
        <p className="text-3xl font-bold text-muted-foreground/50">— TRN</p>
        <p className="text-xs text-muted-foreground mt-1">From staking rewards</p>
      </Card>

      <Card className="p-6 relative overflow-hidden">
        <Badge variant="outline" className="absolute top-3 right-3 text-xs bg-amber-500/10 text-amber-500 border-amber-500/20">
          <Clock className="h-3 w-3 mr-1" />
          Coming Soon
        </Badge>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-primary/20">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Active Stakers</p>
        </div>
        <p className="text-3xl font-bold text-muted-foreground/50">0</p>
        <p className="text-xs text-muted-foreground mt-1">Launching Q1 2026</p>
      </Card>

      <Card className="p-6 relative overflow-hidden">
        <Badge variant="outline" className="absolute top-3 right-3 text-xs bg-amber-500/10 text-amber-500 border-amber-500/20">
          <Clock className="h-3 w-3 mr-1" />
          Coming Soon
        </Badge>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-primary/20">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Avg. Stake</p>
        </div>
        <p className="text-3xl font-bold text-muted-foreground/50">— TRN</p>
        <p className="text-xs text-muted-foreground mt-1">per wallet</p>
      </Card>
    </div>
  );
};

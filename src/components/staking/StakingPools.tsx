import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, Target, Users, Clock } from "lucide-react";

const STAKING_POOLS = [
  {
    id: 'price_predictions',
    name: 'Price Predictions',
    icon: TrendingUp,
    description: 'Stake TRN to predict future token prices',
    apy: '50-200%',
    totalStaked: '—',
    activeStakers: 0,
    status: 'Coming Q1 2026',
  },
  {
    id: 'meme_contests',
    name: 'Meme Contests',
    icon: Zap,
    description: 'Compete in weekly meme challenges',
    apy: '100-500%',
    totalStaked: '—',
    activeStakers: 0,
    status: 'Coming Q1 2026',
  },
  {
    id: 'prediction_tournaments',
    name: 'Prediction Tournaments',
    icon: Target,
    description: 'Join seasonal tournaments with mega prizes',
    apy: '500-2000%',
    totalStaked: '—',
    activeStakers: 0,
    status: 'Coming Q1 2026',
  },
  {
    id: 'governance_voting',
    name: 'Governance Voting',
    icon: Users,
    description: 'Stake to vote on protocol decisions',
    apy: '10-30%',
    totalStaked: '—',
    activeStakers: 0,
    status: 'Coming Q1 2026',
  },
];

export const StakingPools = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Planned Staking Pools</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STAKING_POOLS.map((pool) => {
          const Icon = pool.icon;
          return (
            <Card key={pool.id} className="p-6 hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/20">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{pool.name}</h3>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      <Clock className="h-3 w-3 mr-1" />
                      {pool.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Target APY</p>
                  <p className="text-xl font-bold text-primary">{pool.apy}</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {pool.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total Staked</p>
                  <p className="font-semibold text-muted-foreground/50">{pool.totalStaked}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active Stakers</p>
                  <p className="font-semibold text-muted-foreground/50">{pool.activeStakers}</p>
                </div>
              </div>

              <Button 
                disabled
                variant="outline"
                className="w-full"
              >
                <Clock className="h-4 w-4 mr-2" />
                Coming Soon
              </Button>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-8 p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Staking infrastructure is under development.</span>
          {' '}Join our waitlist to be notified when staking pools launch.
        </p>
      </div>
    </div>
  );
};

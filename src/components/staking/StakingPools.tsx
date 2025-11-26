import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, Target, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STAKING_POOLS = [
  {
    id: 'price_predictions',
    name: 'Price Predictions',
    icon: TrendingUp,
    description: 'Stake TRN to predict future token prices',
    apy: '50-200%',
    totalStaked: '1.2M TRN',
    activeStakers: 847,
    status: 'Active',
    route: '/goblin-market',
  },
  {
    id: 'meme_contests',
    name: 'Meme Contests',
    icon: Zap,
    description: 'Compete in weekly meme challenges',
    apy: '100-500%',
    totalStaked: '850K TRN',
    activeStakers: 623,
    status: 'Active',
    route: '/earn',
  },
  {
    id: 'prediction_tournaments',
    name: 'Prediction Tournaments',
    icon: Target,
    description: 'Join seasonal tournaments with mega prizes',
    apy: '500-2000%',
    totalStaked: '2.5M TRN',
    activeStakers: 1243,
    status: 'Active',
    route: '/goblin-market',
  },
  {
    id: 'governance_voting',
    name: 'Governance Voting',
    icon: Users,
    description: 'Stake to vote on protocol decisions',
    apy: '10-30%',
    totalStaked: '3.8M TRN',
    activeStakers: 2156,
    status: 'Active',
    route: '/goblin-market',
  },
];

export const StakingPools = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Active Staking Pools</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STAKING_POOLS.map((pool) => {
          const Icon = pool.icon;
          return (
            <Card key={pool.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/20">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{pool.name}</h3>
                    <Badge variant="outline">{pool.status}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">APY</p>
                  <p className="text-xl font-bold text-primary">{pool.apy}</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {pool.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total Staked</p>
                  <p className="font-semibold">{pool.totalStaked}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active Stakers</p>
                  <p className="font-semibold">{pool.activeStakers}</p>
                </div>
              </div>

              <Button 
                onClick={() => navigate(pool.route)}
                className="w-full"
              >
                <Zap className="h-4 w-4 mr-2" />
                Stake Now
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

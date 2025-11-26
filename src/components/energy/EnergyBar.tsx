import { Battery, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EnergyBarProps {
  currentEnergy: number;
  maxEnergy: number;
  onBuyMore: () => void;
}

export const EnergyBar = ({ currentEnergy, maxEnergy, onBuyMore }: EnergyBarProps) => {
  const energyPercent = (currentEnergy / maxEnergy) * 100;
  const isLow = energyPercent < 30;

  return (
    <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 min-w-[120px]">
          <div className={`p-2 rounded-full ${isLow ? 'bg-destructive/20' : 'bg-primary/20'}`}>
            <Battery className={`h-5 w-5 ${isLow ? 'text-destructive' : 'text-primary'}`} />
          </div>
          <div>
            <p className="text-sm font-medium">Energy</p>
            <p className="text-xs text-muted-foreground">{currentEnergy}/{maxEnergy}</p>
          </div>
        </div>
        
        <div className="flex-1">
          <Progress value={energyPercent} className="h-3" />
        </div>

        <Button 
          onClick={onBuyMore}
          size="sm"
          className="whitespace-nowrap"
        >
          <Zap className="h-4 w-4 mr-2" />
          Buy Energy
        </Button>
      </div>

      {isLow && (
        <p className="text-xs text-destructive mt-2 flex items-center gap-1">
          <Zap className="h-3 w-3" />
          Low energy! Purchase more to continue analyzing terrain.
        </p>
      )}
    </Card>
  );
};

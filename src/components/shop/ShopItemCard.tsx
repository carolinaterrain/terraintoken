import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ShopItemCardProps {
  name: string;
  description: string;
  trnCost: number;
  icon: LucideIcon;
  onPurchase: () => void;
  purchasing: boolean;
  duration?: string;
}

export const ShopItemCard = ({
  name,
  description,
  trnCost,
  icon: Icon,
  onPurchase,
  purchasing,
  duration,
}: ShopItemCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-full bg-primary/20">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">{name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          {duration && <p className="text-sm text-muted-foreground">Duration: {duration}</p>}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold">{trnCost} TRN</span>
        <Button onClick={onPurchase} disabled={purchasing}>
          {purchasing ? 'Processing...' : 'Purchase'}
        </Button>
      </div>
    </Card>
  );
};

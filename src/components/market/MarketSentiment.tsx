import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MarketSentimentProps {
  priceChange24h: number;
  volume24h: number;
  holders: number;
}

export const MarketSentiment = ({
  priceChange24h,
  volume24h,
  holders,
}: MarketSentimentProps) => {
  // Calculate sentiment score (0-100)
  const priceScore = Math.min(Math.max((priceChange24h + 50) / 100 * 100, 0), 100);
  const volumeScore = Math.min((volume24h / 10000) * 100, 100);
  const holderScore = Math.min((holders / 5000) * 100, 100);
  
  const sentimentScore = (priceScore * 0.5 + volumeScore * 0.3 + holderScore * 0.2);
  
  let sentiment: "bullish" | "bearish" | "neutral";
  let sentimentColor: string;
  let sentimentIcon: any;
  let sentimentEmoji: string;

  if (sentimentScore >= 60) {
    sentiment = "bullish";
    sentimentColor = "text-goblin-green";
    sentimentIcon = TrendingUp;
    sentimentEmoji = "🚀";
  } else if (sentimentScore <= 40) {
    sentiment = "bearish";
    sentimentColor = "text-destructive";
    sentimentIcon = TrendingDown;
    sentimentEmoji = "🐻";
  } else {
    sentiment = "neutral";
    sentimentColor = "text-goblin-gold";
    sentimentIcon = Minus;
    sentimentEmoji = "😐";
  }

  const Icon = sentimentIcon;

  return (
    <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-gold/60">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span>Market Sentiment</span>
        <span>{sentimentEmoji}</span>
      </h3>

      <div className="space-y-4">
        {/* Sentiment gauge */}
        <div className="relative">
          <div className="h-4 bg-terrain-shadow rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                sentiment === "bullish"
                  ? "bg-gradient-to-r from-goblin-green to-terrain-purple"
                  : sentiment === "bearish"
                  ? "bg-gradient-to-r from-destructive to-orange-500"
                  : "bg-gradient-to-r from-goblin-gold to-yellow-500"
              }`}
              style={{ width: `${sentimentScore}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Bearish</span>
            <span>Neutral</span>
            <span>Bullish</span>
          </div>
        </div>

        {/* Sentiment label */}
        <div className="text-center">
          <div className={`flex items-center justify-center gap-2 ${sentimentColor}`}>
            <Icon className="w-6 h-6" />
            <span className="text-2xl font-bold capitalize">{sentiment}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Sentiment Score: {sentimentScore.toFixed(0)}/100
          </p>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <p className="text-muted-foreground">Price</p>
            <p className={priceChange24h > 0 ? "text-goblin-green" : "text-destructive"}>
              {priceChange24h > 0 ? "+" : ""}{priceChange24h.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Volume</p>
            <p className="text-foreground">${(volume24h / 1000).toFixed(1)}K</p>
          </div>
          <div>
            <p className="text-muted-foreground">Holders</p>
            <p className="text-foreground">{holders}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

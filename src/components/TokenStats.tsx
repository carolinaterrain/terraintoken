import { useState } from "react";
import { TrendingUp, TrendingDown, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Stat {
  label: string;
  value: string;
  change?: number; // percentage change (positive or negative)
}

// Manual stats - update these values as needed
const stats: Stat[] = [
  { label: "Market Cap", value: "$420,069", change: 15.3 },
  { label: "Holders", value: "1,337", change: 8.7 },
  { label: "24h Volume", value: "$69,420", change: -3.2 },
  { label: "Price", value: "0.00042 SOL", change: 12.5 },
  { label: "All-time High", value: "$1.23", change: 0 },
];

const TokenStats = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleCopy = (value: string, label: string, index: number) => {
    navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    toast({
      title: "Copied!",
      description: `${label}: ${value}`,
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-primary/20 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-8 min-w-max">
            {stats.map((stat, index) => (
              <button
                key={index}
                onClick={() => handleCopy(stat.value, stat.label, index)}
                className="flex items-center gap-2 hover:bg-primary/10 px-3 py-2 rounded-lg transition-colors group"
              >
                <div className="text-left">
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                  <div className="text-sm font-bold flex items-center gap-1">
                    {stat.value}
                    {stat.change !== undefined && stat.change !== 0 && (
                      <span
                        className={`flex items-center text-xs ${
                          stat.change > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {stat.change > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {Math.abs(stat.change)}%
                      </span>
                    )}
                  </div>
                </div>
                {copiedIndex === index ? (
                  <Check className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <Copy className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            ))}
          </div>

          {/* Surfing goblin */}
          <div className="ml-4 text-2xl animate-slide-right pointer-events-none">
            🏄‍♂️
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenStats;

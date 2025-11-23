import { useQuery } from "@tanstack/react-query";

interface TokenStats {
  priceUsd: string;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  liquidity: number;
  holders?: number;
}

interface PriceDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const DEXSCREENER_API = "https://api.dexscreener.com/latest/dex";
const TRN_PAIR_ADDRESS = "GwXzGeZFF4jK1PqzVd17MHioY7pqSET7r6UY7RS1pump"; // Solana pair

export function useGoblinMarketData() {
  return useQuery({
    queryKey: ["goblin-market-data"],
    queryFn: async () => {
      const response = await fetch(`${DEXSCREENER_API}/pairs/solana/${TRN_PAIR_ADDRESS}`);
      if (!response.ok) throw new Error("Failed to fetch market data");
      
      const data = await response.json();
      const pair = data.pair;
      
      // Generate mock candlestick data based on current price
      const currentPrice = parseFloat(pair.priceUsd);
      const priceData: PriceDataPoint[] = generateMockCandlesticks(currentPrice, 24);
      
      const stats: TokenStats = {
        priceUsd: pair.priceUsd,
        priceChange24h: parseFloat(pair.priceChange?.h24 || "0"),
        volume24h: parseFloat(pair.volume?.h24 || "0"),
        marketCap: parseFloat(pair.marketCap || "0"),
        liquidity: parseFloat(pair.liquidity?.usd || "0"),
        holders: 1137, // Placeholder - update with real on-chain data when available
      };
      
      return {
        stats,
        priceData,
        support: currentPrice * 0.85, // Goblin Floor (15% below current)
        resistance: currentPrice * 1.25, // Dragon Ceiling (25% above current)
      };
    },
    refetchInterval: 60000, // Refresh every minute
    staleTime: 50000,
  });
}

// Generate realistic-looking candlestick data
function generateMockCandlesticks(basePrice: number, count: number): PriceDataPoint[] {
  const data: PriceDataPoint[] = [];
  const now = Date.now();
  const hourInMs = 3600000;
  
  let price = basePrice * 0.92; // Start slightly lower
  
  for (let i = count; i >= 0; i--) {
    const volatility = 0.02 + Math.random() * 0.03; // 2-5% volatility
    const trend = Math.random() > 0.5 ? 1 : -1;
    
    const open = price;
    const change = price * volatility * trend;
    const close = Math.max(price + change, basePrice * 0.5); // Don't go below 50% of base
    
    const high = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low = Math.min(open, close) * (1 - Math.random() * 0.02);
    
    data.push({
      timestamp: now - (i * hourInMs),
      open,
      high,
      low,
      close,
      volume: Math.random() * 50000 + 10000,
    });
    
    price = close;
  }
  
  return data;
}

export function useHolderProgress() {
  return useQuery({
    queryKey: ["holder-progress"],
    queryFn: async () => {
      // Placeholder - replace with real on-chain holder count
      return {
        current: 1137,
        target: 5000,
        milestones: [500, 1000, 2500, 5000],
      };
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });
}

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
const TRN_PAIR_ADDRESS = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump"; // Correct Solana pair

export function useGoblinMarketData() {
  return useQuery({
    queryKey: ["goblin-market-data"],
    queryFn: async () => {
      const response = await fetch(`${DEXSCREENER_API}/pairs/solana/${TRN_PAIR_ADDRESS}`);
      if (!response.ok) throw new Error("Failed to fetch market data");
      
      const data = await response.json();
      const pair = data.pair;
      
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
      };
    },
    refetchInterval: 60000, // Refresh every minute
    staleTime: 50000,
  });
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

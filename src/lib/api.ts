// API helper functions for external services

export interface TokenStats {
  marketCap: string;
  priceUsd: string;
  priceSol: string;
  change24h: number;
  volume24h: string;
  holders?: string;
}

export interface MemeTokenStats {
  symbol: string;
  price: string;
  change24h: number;
  commentary: string;
}

const TRN_CONTRACT = "2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump";

// Fetch TRN token stats from DexScreener
export async function fetchTRNStats(): Promise<TokenStats | null> {
  try {
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${TRN_CONTRACT}`
    );
    
    if (!response.ok) throw new Error("Failed to fetch stats");
    
    const data = await response.json();
    const pair = data.pairs?.[0];
    
    if (!pair) return null;
    
    return {
      marketCap: formatNumber(pair.fdv || pair.marketCap || 0),
      priceUsd: parseFloat(pair.priceUsd || 0).toFixed(8),
      priceSol: parseFloat(pair.priceNative || 0).toFixed(6),
      change24h: parseFloat(pair.priceChange?.h24 || 0),
      volume24h: formatNumber(pair.volume?.h24 || 0),
      holders: pair.info?.holders || "N/A"
    };
  } catch (error) {
    console.error("Error fetching TRN stats:", error);
    return null;
  }
}

// Fetch meme coin stats for the terrain report
export async function fetchMemeStats(): Promise<MemeTokenStats[]> {
  const memeCoins = [
    { symbol: "PEPE", address: "pepe-address", commentary: "Still hopping! 🐸" },
    { symbol: "BONK", address: "bonk-address", commentary: "Much wow! 🐕" },
    { symbol: "WIF", address: "wif-address", commentary: "Hat's off! 🎩" },
    { symbol: "DOGE", address: "doge-address", commentary: "To the moon! 🚀" },
  ];
  
  // Return mock data with randomized changes for demo
  return memeCoins.map(coin => ({
    symbol: coin.symbol,
    price: "$" + (Math.random() * 0.01).toFixed(6),
    change24h: (Math.random() - 0.5) * 20,
    commentary: coin.commentary
  }));
}

function formatNumber(num: number): string {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

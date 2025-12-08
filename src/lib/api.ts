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
    
    const priceSol = parseFloat(pair.priceNative || 0);
    
    return {
      marketCap: formatNumber(pair.fdv || pair.marketCap || 0),
      priceUsd: parseFloat(pair.priceUsd || 0).toFixed(8),
      priceSol: formatPriceSol(priceSol),
      change24h: parseFloat(pair.priceChange?.h24 || 0),
      volume24h: formatNumber(pair.volume?.h24 || 0),
      holders: pair.info?.holders || "N/A"
    };
  } catch (error) {
    console.error("Error fetching TRN stats:", error);
    // Return fallback data instead of null for better UX
    return {
      marketCap: "$--",
      priceUsd: "0.00000000",
      priceSol: "0.000000",
      change24h: 0,
      volume24h: "$--",
      holders: "N/A"
    };
  }
}

// Fetch meme coin stats for the terrain report
export async function fetchMemeStats(): Promise<MemeTokenStats[]> {
  const memeCoins = [
    { symbol: "BONK", address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", commentary: "Much wow! 🐕" },
    { symbol: "WIF", address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", commentary: "Hat's off! 🎩" },
    { symbol: "POPCAT", address: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr", commentary: "Pop pop! 🐱" },
    { symbol: "MYRO", address: "HhJpBhRRn4g56VsyLuT8DL5Bv31HkXqsrahTTUCZeZg4", commentary: "Good boy! 🐶" },
  ];
  
  try {
    const promises = memeCoins.map(async (coin) => {
      try {
        const response = await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${coin.address}`
        );
        
        if (!response.ok) throw new Error(`Failed to fetch ${coin.symbol}`);
        
        const data = await response.json();
        const pair = data.pairs?.[0];
        
        if (!pair) throw new Error(`No pair found for ${coin.symbol}`);
        
        const price = parseFloat(pair.priceUsd || 0);
        const change24h = parseFloat(pair.priceChange?.h24 || 0);
        
        return {
          symbol: coin.symbol,
          price: price < 0.01 ? `$${price.toFixed(6)}` : `$${price.toFixed(4)}`,
          change24h,
          commentary: coin.commentary
        };
      } catch (error) {
        console.error(`Error fetching ${coin.symbol}:`, error);
        return {
          symbol: coin.symbol,
          price: "$--",
          change24h: 0,
          commentary: coin.commentary
        };
      }
    });
    
    return await Promise.all(promises);
  } catch (error) {
    console.error("Error fetching meme stats:", error);
    // Return fallback data
    return memeCoins.map(coin => ({
      symbol: coin.symbol,
      price: "$--",
      change24h: 0,
      commentary: coin.commentary
    }));
  }
}

function formatNumber(num: number): string {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

// Format SOL price with appropriate precision (handles very small values)
function formatPriceSol(price: number): string {
  if (price === 0) return "0";
  if (price >= 1) return price.toFixed(4);
  if (price >= 0.001) return price.toFixed(6);
  if (price >= 0.0000001) return price.toFixed(10).replace(/\.?0+$/, '');
  return price.toExponential(4);
}

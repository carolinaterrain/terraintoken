import { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSmartPolling } from '@/hooks/useSmartPolling';
import { requestIdleCallback } from '@/lib/performanceUtils';
import type { DataSource } from '@/components/ui/data-freshness-badge';

// Unified token data interface - single source of truth
interface UnifiedTokenData {
  // Supply data
  totalSupply: number;
  circulatingSupply: number;
  decimals: number;
  
  // Holder data
  holderCount: number;
  holderTiers: {
    shrimp: number;
    crab: number;
    fish: number;
    dolphin: number;
    shark: number;
    whale: number;
    humpback: number;
  };
  top10Percentage: number;
  
  // Market data
  priceUsd: string;
  priceSol: string;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
  
  // Meta
  lastUpdated: string;
  source: DataSource;
  cacheAge?: number;
}

// Context value interface
interface TokenDataContextValue {
  // Raw unified data
  data: UnifiedTokenData | null;
  isLoading: boolean;
  error: Error | null;
  
  // Formatted convenience getters
  stats: {
    marketCap: string;
    priceUsd: string;
    priceSol: string;
    change24h: number;
    volume24h: string;
    liquidity: string;
  } | null;
  
  supply: {
    totalSupply: number;
    circulatingSupply: number;
    decimals: number;
    formatted: {
      total: string;
      circulating: string;
    };
  } | null;
  
  holderCount: {
    holderCount: number;
    tiers: UnifiedTokenData['holderTiers'];
    top10Percentage: number;
  } | null;
  
  // Data source indicators
  dataSource: DataSource;
  lastUpdated: string | null;
  
  // Refresh function
  refetch: () => void;
}

// Fallback data for immediate render
const FALLBACK_DATA: UnifiedTokenData = {
  totalSupply: 1000000000000000,
  circulatingSupply: 550000000000000,
  decimals: 6,
  holderCount: 0,
  holderTiers: { shrimp: 0, crab: 0, fish: 0, dolphin: 0, shark: 0, whale: 0, humpback: 0 },
  top10Percentage: 0,
  priceUsd: "0",
  priceSol: "0",
  priceChange24h: 0,
  marketCap: 0,
  volume24h: 0,
  liquidity: 0,
  lastUpdated: new Date().toISOString(),
  source: 'fallback',
};

const TokenDataContext = createContext<TokenDataContextValue | null>(null);

export const useTokenData = () => {
  const context = useContext(TokenDataContext);
  if (!context) {
    throw new Error('useTokenData must be used within TokenDataProvider');
  }
  return context;
};

// Format number with appropriate suffix
function formatNumber(num: number): string {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

// Format supply with decimals
function formatSupplyValue(supply: number, decimals: number): string {
  const value = supply / Math.pow(10, decimals);
  
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }
  
  return value.toLocaleString();
}

export const TokenDataProvider = ({ children }: { children: ReactNode }) => {
  // Defer data fetching until page is interactive
  const [enabled, setEnabled] = useState(false);
  
  useEffect(() => {
    const id = requestIdleCallback(() => {
      setEnabled(true);
    });
    return () => {
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(id as number);
      }
    };
  }, []);

  // Smart polling - 60 seconds for market data
  const pollingInterval = useSmartPolling(60000);

  // Single unified query for all token data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['unified-token-data'],
    queryFn: async (): Promise<UnifiedTokenData> => {
      const { data, error } = await supabase.functions.invoke('fetch-unified-token-data');
      
      if (error) {
        console.error('Error fetching unified token data:', error);
        throw error;
      }
      
      return data as UnifiedTokenData;
    },
    enabled,
    refetchInterval: enabled ? pollingInterval : false,
    staleTime: 55000,
    gcTime: 600000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Use fetched data or fallback
  const tokenData = data || FALLBACK_DATA;

  // Memoized formatted values
  const value = useMemo<TokenDataContextValue>(() => ({
    // Raw data
    data: tokenData,
    isLoading: enabled && isLoading,
    error: error as Error | null,
    
    // Formatted stats
    stats: {
      marketCap: formatNumber(tokenData.marketCap),
      priceUsd: tokenData.priceUsd,
      priceSol: tokenData.priceSol,
      change24h: tokenData.priceChange24h,
      volume24h: formatNumber(tokenData.volume24h),
      liquidity: formatNumber(tokenData.liquidity),
    },
    
    // Formatted supply
    supply: {
      totalSupply: tokenData.totalSupply,
      circulatingSupply: tokenData.circulatingSupply,
      decimals: tokenData.decimals,
      formatted: {
        total: formatSupplyValue(tokenData.totalSupply, tokenData.decimals),
        circulating: formatSupplyValue(tokenData.circulatingSupply, tokenData.decimals),
      },
    },
    
    // Holder data
    holderCount: {
      holderCount: tokenData.holderCount,
      tiers: tokenData.holderTiers,
      top10Percentage: tokenData.top10Percentage,
    },
    
    // Data source
    dataSource: tokenData.source,
    lastUpdated: tokenData.lastUpdated,
    
    // Refresh function
    refetch,
  }), [tokenData, enabled, isLoading, error, refetch]);

  return (
    <TokenDataContext.Provider value={value}>
      {children}
    </TokenDataContext.Provider>
  );
};

// Re-export the formatSupplyValue for components that need it
export { formatSupplyValue as formatSupply };

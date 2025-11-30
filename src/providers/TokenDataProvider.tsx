import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTRNStats } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';
import { useSmartPolling } from '@/hooks/useSmartPolling';
import { requestIdleCallback } from '@/lib/performanceUtils';

interface TokenData {
  stats: any;
  supply: any;
  holderCount: any;
  isLoading: boolean;
  dataSource: {
    stats: 'live' | 'fallback';
    supply: 'live' | 'fallback';
    holders: 'live' | 'fallback';
  };
}

// Fallback data for immediate render
const FALLBACK_STATS = {
  price: "$--",
  priceChange24h: "--",
  volume24h: "$--",
  marketCap: "$--",
};

const FALLBACK_SUPPLY = {
  totalSupply: 1006699550,
  circulatingSupply: 550000000,
  decimals: 2,
  lastUpdated: new Date().toISOString(),
  isStale: true,
};

const FALLBACK_HOLDER_COUNT = {
  holderCount: 0,
  lastUpdated: new Date().toISOString(),
  source: 'fallback'
};

const TokenDataContext = createContext<TokenData | null>(null);

export const useTokenData = () => {
  const context = useContext(TokenDataContext);
  if (!context) {
    throw new Error('useTokenData must be used within TokenDataProvider');
  }
  return context;
};

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

  const statsPolling = useSmartPolling(60000);
  const supplyPolling = useSmartPolling(300000);
  const holderPolling = useSmartPolling(120000);

  // Fetch token stats - deferred
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['token-stats'],
    queryFn: fetchTRNStats,
    enabled,
    refetchInterval: enabled ? statsPolling : false,
    staleTime: 55000,
    gcTime: 600000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
  });

  // Fetch token supply - deferred
  const { data: supply, isLoading: supplyLoading } = useQuery({
    queryKey: ['token-supply'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('fetch-token-supply');
      if (error) {
        console.error('Error fetching token supply:', error);
        return FALLBACK_SUPPLY;
      }
      return data;
    },
    enabled,
    refetchInterval: enabled ? supplyPolling : false,
    staleTime: 240000,
  });

  // Fetch holder count - deferred
  const { data: holderCount, isLoading: holderLoading } = useQuery({
    queryKey: ['live-holder-count'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('fetch-trn-holders');
      if (error) {
        console.error('Error fetching holder count:', error);
        return FALLBACK_HOLDER_COUNT;
      }
      return data;
    },
    enabled,
    refetchInterval: enabled ? holderPolling : false,
    staleTime: 100000,
  });

  // Provide fallback data immediately, then swap to live data when available
  const value: TokenData = {
    stats: stats || FALLBACK_STATS,
    supply: supply || FALLBACK_SUPPLY,
    holderCount: holderCount || FALLBACK_HOLDER_COUNT,
    isLoading: enabled && (statsLoading || supplyLoading || holderLoading),
    dataSource: {
      stats: stats?.marketCap !== "$--" ? 'live' : 'fallback',
      supply: supply?.isStale ? 'fallback' : 'live',
      holders: holderCount?.source === 'helius' ? 'live' : 'fallback',
    },
  };

  return (
    <TokenDataContext.Provider value={value}>
      {children}
    </TokenDataContext.Provider>
  );
};
